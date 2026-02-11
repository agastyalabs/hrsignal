import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { ChecklistDownloadCard } from "@/components/lead/ChecklistDownloadCard";

import { canonicalVendorSlug, normalizeVendorSlug } from "@/lib/vendors/slug";
import { getVendorBrief } from "@/lib/vendors/brief";

function titleCase(s: string) {
  return s
    .split(/\s+/g)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function parseVsSlug(slug: string): { a: string; b: string } | null {
  const raw = String(slug || "").trim();
  const parts = raw.split("-vs-").map((p) => normalizeVendorSlug(p));
  if (parts.length !== 2) return null;
  const [a, b] = parts;
  if (!a || !b || a === b) return null;
  return { a, b };
}

function uniq(xs: string[]) {
  return Array.from(new Set(xs)).filter(Boolean);
}

function clampScore(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function computeOverallFit(args: {
  verified: boolean;
  complianceTagsCount: number;
  evidenceLinksCount: number;
  integrationsCount: number;
  hasPayroll: boolean;
  hasComplianceSignals: boolean;
}): number {
  // Deterministic and explainable; aligned to existing compare logic.
  // India compliance (30%), Evidence depth (20%), Integration visibility (15%), Freshness (10%), Payroll edge-case readiness (25%).
  const india = Math.min(30, args.complianceTagsCount * 7.5); // 4 tags ~ full
  const evidence = Math.min(20, args.evidenceLinksCount * 4); // 5 links ~ full
  const integrations = Math.min(15, args.integrationsCount * 3); // 5 integrations ~ full
  const freshness = args.verified ? 10 : 0;
  const edge = args.hasPayroll
    ? args.hasComplianceSignals
      ? 25
      : 10
    : args.hasComplianceSignals
      ? 15
      : 5;

  return clampScore(india + evidence + integrations + freshness + edge);
}

function extractBullets(markdown: string): string[] {
  return String(markdown || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-") || l.startsWith("•"))
    .map((l) => l.replace(/^[-•]\s+/, ""))
    .filter(Boolean)
    .slice(0, 4);
}

function computePricingTransparency(briefUrls: string[]): "Verified" | "Needs validation" {
  const hit = briefUrls.some((u) => {
    const s = String(u).toLowerCase();
    return s.includes("pricing") || s.includes("plans") || s.includes("price");
  });
  return hit ? "Verified" : "Needs validation";
}

type VendorRow = {
  slug: string;
  name: string;
  readiness: number;
  complianceTagsCount: number;
  integrationsCount: number;
  pricingTransparency: "Verified" | "Needs validation";
  bestForBullets: string[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const p = await params;
  const parsed = parseVsSlug(p.slug);
  if (!parsed) return { title: "Vendor comparison" };

  const aName = titleCase(parsed.a.replace(/-/g, " "));
  const bName = titleCase(parsed.b.replace(/-/g, " "));

  const title = `${aName} vs ${bName} — India HRMS comparison`;
  const description = `Side-by-side comparison of ${aName} vs ${bName} for India HRMS & payroll buying: readiness score, compliance signals, integrations, pricing transparency, and best-fit notes.`;

  return { title, description };
}

export default async function CompareVsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await params;
  const parsed = parseVsSlug(p.slug);
  if (!parsed) notFound();

  if (!process.env.DATABASE_URL) {
    // Keep behavior explicit: this route relies on the catalog DB.
    notFound();
  }

  const dbVendors = await prisma.vendor.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      verifiedInIndia: true,
      tools: {
        where: { status: "PUBLISHED" },
        select: {
          slug: true,
          lastVerifiedAt: true,
          indiaComplianceTags: true,
          categories: { select: { category: { select: { slug: true } } } },
          integrations: { select: { integration: { select: { name: true } } } },
        },
        take: 60,
      },
    },
    take: 1200,
  });

  const bySlug = new Map<string, (typeof dbVendors)[number]>();
  for (const v of dbVendors) {
    const slug = canonicalVendorSlug({ vendorName: v.name, toolSlugs: v.tools.map((t) => t.slug) });
    if (!bySlug.has(slug)) bySlug.set(slug, v);
  }

  const vA = bySlug.get(parsed.a) ?? null;
  const vB = bySlug.get(parsed.b) ?? null;

  if (!vA || !vB) notFound();

  async function toRow(v: (typeof dbVendors)[number], urlSlug: string): Promise<VendorRow> {
    const complianceTags = uniq(v.tools.flatMap((t) => t.indiaComplianceTags ?? []).filter(Boolean));
    const integrations = uniq(v.tools.flatMap((t) => t.integrations.map((i) => i.integration.name)).filter(Boolean));

    const newestVerificationMs = v.tools
      .map((t) => (t.lastVerifiedAt ? new Date(t.lastVerifiedAt).getTime() : 0))
      .reduce((a, b) => Math.max(a, b), 0);

    const verified = Boolean(newestVerificationMs) || Boolean(v.verifiedInIndia);

    const brief = await getVendorBrief({
      vendorName: v.name,
      urlSlug,
      toolSlugs: v.tools.map((t) => t.slug),
    });

    const bestForRaw =
      brief.sections["best fit for"] ??
      brief.sections["best for"] ??
      brief.sections["who it is for"] ??
      "";

    const evidenceLinksCount = brief.urls.length;

    const hasPayroll = v.tools.some((t) => t.categories.some((c) => c.category.slug === "payroll"));
    const hasComplianceSignals = complianceTags.length > 0;

    return {
      slug: urlSlug,
      name: v.name,
      readiness: computeOverallFit({
        verified,
        complianceTagsCount: complianceTags.length,
        evidenceLinksCount,
        integrationsCount: integrations.length,
        hasPayroll,
        hasComplianceSignals,
      }),
      complianceTagsCount: complianceTags.length,
      integrationsCount: integrations.length,
      pricingTransparency: computePricingTransparency(brief.urls),
      bestForBullets: extractBullets(bestForRaw),
    };
  }

  const [a, b] = await Promise.all([toRow(vA, parsed.a), toRow(vB, parsed.b)]);

  const h1 = `${a.name} vs ${b.name} — India HRMS comparison`;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">{h1}</h1>
          <p className="mt-2 max-w-[80ch] text-sm leading-7 text-[var(--text-muted)]">
            A side-by-side comparison for India payroll and multi-state compliance evaluation. Use this to shortlist faster, ask better demo
            questions, and validate evidence before you buy.
          </p>

          <div className="mt-6">
            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-0 shadow-none">
              <div className="overflow-x-auto">
                <table className="min-w-[720px] w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-soft)]">
                      <th className="p-4 text-xs font-semibold text-[var(--text-muted)]">Metric</th>
                      <th className="p-4 text-xs font-semibold text-[var(--text-muted)]">{a.name}</th>
                      <th className="p-4 text-xs font-semibold text-[var(--text-muted)]">{b.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--border-soft)]">
                      <td className="p-4 text-sm font-semibold text-[var(--text)]">HRSignal Readiness Score™</td>
                      <td className="p-4">
                        <Badge variant={a.readiness >= 80 ? "verified" : "neutral"}>{a.readiness}/100</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={b.readiness >= 80 ? "verified" : "neutral"}>{b.readiness}/100</Badge>
                      </td>
                    </tr>

                    <tr className="border-b border-[var(--border-soft)]">
                      <td className="p-4 text-sm text-[var(--text)]">Compliance tags count</td>
                      <td className="p-4 text-sm text-[var(--text-muted)]">{a.complianceTagsCount}</td>
                      <td className="p-4 text-sm text-[var(--text-muted)]">{b.complianceTagsCount}</td>
                    </tr>

                    <tr className="border-b border-[var(--border-soft)]">
                      <td className="p-4 text-sm text-[var(--text)]">Integrations count</td>
                      <td className="p-4 text-sm text-[var(--text-muted)]">{a.integrationsCount}</td>
                      <td className="p-4 text-sm text-[var(--text-muted)]">{b.integrationsCount}</td>
                    </tr>

                    <tr className="border-b border-[var(--border-soft)]">
                      <td className="p-4 text-sm text-[var(--text)]">Pricing transparency</td>
                      <td className="p-4 text-sm text-[var(--text-muted)]">{a.pricingTransparency}</td>
                      <td className="p-4 text-sm text-[var(--text-muted)]">{b.pricingTransparency}</td>
                    </tr>

                    <tr>
                      <td className="p-4 text-sm text-[var(--text)]">Best for</td>
                      <td className="p-4 text-sm text-[var(--text-muted)]">
                        {a.bestForBullets.length ? (
                          <ul className="space-y-1">
                            {a.bestForBullets.map((x) => (
                              <li key={x}>• {x}</li>
                            ))}
                          </ul>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-[var(--text-muted)]">
                        {b.bestForBullets.length ? (
                          <ul className="space-y-1">
                            {b.bestForBullets.map((x) => (
                              <li key={x}>• {x}</li>
                            ))}
                          </ul>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="mt-8">
            {/* Source page constrained by existing API schema (homepage|payroll-india|scanner). */}
            <ChecklistDownloadCard sourcePage="homepage" />
          </div>

          <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-[var(--text)]">Find my India-ready shortlist</div>
                <div className="mt-1 text-sm text-[var(--text-muted)]">
                  Answer a few questions and get a deterministic shortlist with validation checkpoints.
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <ButtonLink href="/recommend" size="md" className="w-full justify-center sm:w-auto">
                  Get my shortlist
                </ButtonLink>
                <Link
                  href="/methodology"
                  className="text-sm font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 hover:text-violet-100"
                >
                  How scoring works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
