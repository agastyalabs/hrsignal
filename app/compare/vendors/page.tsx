export const dynamic = "force-dynamic";

import Link from "next/link";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

import { canonicalVendorSlug, normalizeVendorSlug } from "@/lib/vendors/slug";
import { getVendorBrief } from "@/lib/vendors/brief";

function uniq(xs: string[]) {
  return Array.from(new Set(xs)).filter(Boolean);
}

function normListParam(raw: string | undefined): string[] {
  const parts = String(raw ?? "")
    .split(",")
    .map((s) => normalizeVendorSlug(s.trim()))
    .filter(Boolean);

  const out: string[] = [];
  for (const p of parts) {
    if (!out.includes(p)) out.push(p);
    if (out.length >= 3) break;
  }
  return out;
}

function fmtDate(d: Date | null): string {
  if (!d) return "—";
  return d.toISOString().slice(0, 10);
}

function clampScore(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

type VendorCompareModel = {
  slug: string;
  name: string;

  overallFit: number;
  toolsConsidered: string;
  indiaComplianceTags: string;
  integrations: string;
  evidenceDepth: string;
  freshness: string;
  riskFlags: string;
};

function computeOverallFit(args: {
  verified: boolean;
  complianceTagsCount: number;
  evidenceLinksCount: number;
  integrationsCount: number;
  hasPayroll: boolean;
  hasComplianceSignals: boolean;
}): number {
  // Weighted for India payroll context.
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

export default async function VendorComparePage({
  searchParams,
}: {
  searchParams: Promise<{ vendors?: string }>;
}) {
  const sp = await searchParams;
  const requested = normListParam(sp.vendors);

  if (!requested.length) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <SiteHeader />
        <Section className="pt-10 sm:pt-14">
          <Card className="p-6">
            <div className="text-sm font-semibold text-[var(--text)]">Compare vendors</div>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Add up to 3 vendors via URL: <span className="font-mono">?vendors=a,b,c</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <ButtonLink href="/vendors" size="md" variant="secondary">
                Browse vendors
              </ButtonLink>
            </div>
          </Card>
        </Section>
        <SiteFooter />
      </div>
    );
  }

  const dbVendors = process.env.DATABASE_URL
    ? await prisma.vendor.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          websiteUrl: true,
          verifiedInIndia: true,
          tools: {
            where: { status: "PUBLISHED" },
            select: {
              slug: true,
              name: true,
              lastVerifiedAt: true,
              indiaComplianceTags: true,
              integrations: { select: { integration: { select: { name: true } } } },
              categories: { select: { category: { select: { slug: true } } } },
            },
            orderBy: { name: "asc" },
            take: 40,
          },
        },
        take: 900,
      })
    : [];

  const bySlug = new Map<string, (typeof dbVendors)[number]>();
  for (const v of dbVendors) {
    const slug = canonicalVendorSlug({ vendorName: v.name, toolSlugs: v.tools.map((t) => t.slug) });
    if (!bySlug.has(slug)) bySlug.set(slug, v);
  }

  const models: VendorCompareModel[] = [];

  for (const slug of requested) {
    const v = bySlug.get(slug) ?? null;
    const brief = await getVendorBrief({
      vendorName: v?.name ?? slug,
      urlSlug: slug,
      toolSlugs: v?.tools.map((t) => t.slug) ?? [],
    });

    const toolNames = v?.tools?.map((t) => t.name).filter(Boolean) ?? [];
    const toolsConsidered = toolNames.length
      ? `${toolNames.length} tool${toolNames.length === 1 ? "" : "s"}: ${toolNames.slice(0, 6).join(", ")}${toolNames.length > 6 ? "…" : ""}`
      : "0 tools";

    const complianceTags = uniq(v ? v.tools.flatMap((t) => t.indiaComplianceTags ?? []) : []);
    const integrations = uniq(v ? v.tools.flatMap((t) => t.integrations.map((i) => i.integration.name)) : []);

    const newestVerificationMs = v
      ? v.tools
          .map((t) => (t.lastVerifiedAt ? new Date(t.lastVerifiedAt).getTime() : 0))
          .reduce((a, b) => Math.max(a, b), 0)
      : 0;

    // Dual freshness logic:
    // - Verification drives status (needs validation if no Tool.lastVerifiedAt)
    // - Source-updated is informational only (no penalty if missing)
    const verified = Boolean(newestVerificationMs);
    const verificationDate = newestVerificationMs ? new Date(newestVerificationMs) : null;

    const freshness = `${verified ? "Verified" : "Needs validation"}: ${fmtDate(verificationDate)}${brief.updatedAt ? ` • Source updated: ${fmtDate(brief.updatedAt)}` : ""}`;

    const hasPayroll = v ? v.tools.some((t) => t.categories.some((c) => c.category.slug === "payroll")) : false;
    const hasComplianceSignals = complianceTags.length > 0;

    const overallFit = computeOverallFit({
      verified,
      complianceTagsCount: complianceTags.length,
      evidenceLinksCount: brief.urls.length,
      integrationsCount: integrations.length,
      hasPayroll,
      hasComplianceSignals,
    });

    const riskFlags: string[] = [];
    if (!v || v.tools.length === 0) riskFlags.push("No published tools (compare will be limited)");
    if (!verified) riskFlags.push("Needs validation: no verification date");
    if (!integrations.length) riskFlags.push("Integrations not listed");
    if (!complianceTags.length) riskFlags.push("India compliance tags not listed");
    if (!brief.urls.length) riskFlags.push("Evidence links missing");

    models.push({
      slug,
      name: slug === "freshteam" ? "Freshteam (Freshworks)" : v?.name ?? slug,
      overallFit,
      toolsConsidered,
      indiaComplianceTags: complianceTags.length ? complianceTags.join(", ") : "—",
      integrations: integrations.length ? integrations.join(", ") : "—",
      evidenceDepth: brief.urls.length ? String(brief.urls.length) : "—",
      freshness,
      riskFlags: riskFlags.length ? riskFlags.slice(0, 5).join(" • ") : "—",
    });
  }

  const rows: Array<{ id: keyof VendorCompareModel; label: string }> = [
    { id: "overallFit", label: "Overall fit" },
    { id: "toolsConsidered", label: "Tools considered" },
    { id: "indiaComplianceTags", label: "India compliance tags (union)" },
    { id: "integrations", label: "Integrations (union)" },
    { id: "evidenceDepth", label: "Evidence depth (links)" },
    { id: "freshness", label: "Freshness" },
    { id: "riskFlags", label: "Risk flags" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Compare vendors</h1>
            <p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">
              India payroll context: verification drives status; source-updated is informational only.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/vendors" size="md" variant="secondary">
              Browse vendors
            </ButtonLink>
          </div>
        </div>

        {/* Mobile-first stacked comparison */}
        <div className="space-y-4 lg:hidden">
          {models.map((v) => (
            <Card key={v.slug} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-[var(--text)]">{v.name}</div>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">{v.slug}</div>
                </div>
                <Badge variant={v.overallFit >= 80 ? "verified" : "neutral"}>{v.overallFit}/100</Badge>
              </div>

              <div className="mt-4 space-y-3">
                {rows.slice(1).map((r) => (
                  <div key={String(r.id)} className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                    <div className="text-xs font-semibold text-[var(--text-muted)]">{r.label}</div>
                    <div className="mt-1 text-sm leading-relaxed text-[var(--text)]">
                      {String(v[r.id] ?? "—")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Link
                  className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline"
                  href={`/vendors/${v.slug}`}
                >
                  View vendor →
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block">
          <Card className="overflow-x-auto p-0">
            <table className="min-w-[980px] w-full text-sm">
              <thead className="bg-[var(--surface-1)]">
                <tr className="border-b border-[var(--border-soft)]">
                  <th className="p-4 text-left text-xs font-semibold text-[var(--text-muted)] w-[220px]">Field</th>
                  {models.map((v) => (
                    <th key={v.slug} className="p-4 text-left align-top">
                      <div className="text-sm font-semibold text-[var(--text)]">{v.name}</div>
                      <div className="mt-1 text-xs text-[var(--text-muted)]">{v.slug}</div>
                      <div className="mt-3">
                        <Badge variant={v.overallFit >= 80 ? "verified" : "neutral"}>{v.overallFit}/100</Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((r) => (
                  <tr key={String(r.id)} className="border-b border-[var(--border-soft)] align-top last:border-0">
                    <td className="p-4 text-xs font-semibold text-[var(--text-muted)]">{r.label}</td>
                    {models.map((v) => (
                      <td key={v.slug + String(r.id)} className="p-4 text-sm text-[var(--text)]">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-[var(--text)]">{String(v[r.id] ?? "—")}</pre>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="mt-4 text-xs text-[var(--text-muted)]" title="Weights are tuned for India payroll context.">
          Tip: compare up to 3 vendors using <span className="font-mono">?vendors=a,b,c</span>.
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
