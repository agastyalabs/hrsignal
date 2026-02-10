export const dynamic = "force-dynamic";

import Link from "next/link";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { canonicalVendorSlug, normalizeVendorSlug } from "@/lib/vendors/slug";
import { getVendorBrief } from "@/lib/vendors/brief";
import { pricingTypeFromNote, normalizePricingText } from "@/lib/pricing/format";

function uniq<T>(xs: T[]) {
  return Array.from(new Set(xs));
}

function firstBullets(text: string, limit = 3): string[] {
  return String(text)
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-") || l.startsWith("•"))
    .map((l) => l.replace(/^[-•]\s+/, ""))
    .filter(Boolean)
    .slice(0, limit);
}

type CompareVendor = {
  slug: string;
  name: string;
  websiteUrl: string | null;
  pricingModel: string;
  deployment: string;
  indiaReadiness: string;
  keyModules: string;
  integrations: string;
  security: string;
  bestFitSize: string;
  sourcesCount: string;
  lastChecked: string;
};

export default async function VendorComparePage({
  searchParams,
}: {
  searchParams: Promise<{ vendors?: string }>;
}) {
  const sp = await searchParams;
  const raw = sp.vendors ? String(sp.vendors) : "";
  const requested = raw
    .split(",")
    .map((s) => normalizeVendorSlug(s.trim()))
    .filter(Boolean)
    .slice(0, 3);

  if (!requested.length) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <SiteHeader />
        <Section className="pt-10 sm:pt-14">
          <Card className="border border-[var(--border)] bg-[var(--surface-1)] p-6 shadow-[var(--shadow-sm)]">
            <div className="text-sm font-semibold text-[var(--text)]">Compare vendors</div>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Select up to 3 vendors from the Vendors page.</p>
            <Link className="mt-4 inline-block text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/vendors">
              Browse vendors →
            </Link>
          </Card>
        </Section>
        <SiteFooter />
      </div>
    );
  }

  // Load vendor records (best-effort). Vendor slugs are derived, so we match via canonicalVendorSlug.
  const dbVendors = process.env.DATABASE_URL
    ? await prisma.vendor.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          websiteUrl: true,
          verifiedInIndia: true,
          supportedSizeBands: true,
          categories: { select: { name: true } },
          tools: {
            where: { status: "PUBLISHED" },
            select: {
              slug: true,
              deployment: true,
              lastVerifiedAt: true,
              pricingPlans: { select: { priceNote: true }, take: 2 },
              integrations: { select: { integration: { select: { name: true } } } },
              indiaComplianceTags: true,
              categories: { select: { category: { select: { name: true } } } },
            },
            take: 20,
          },
        },
        take: 800,
      })
    : [];

  const bySlug = new Map<string, (typeof dbVendors)[number]>();
  for (const v of dbVendors) {
    const slug = canonicalVendorSlug({ vendorName: v.name, toolSlugs: v.tools.map((t) => t.slug) });
    if (!bySlug.has(slug)) bySlug.set(slug, v);
  }

  const compare: CompareVendor[] = [];
  for (const slug of requested) {
    const v = bySlug.get(slug) ?? null;
    const brief = await getVendorBrief({ vendorName: v?.name ?? slug, urlSlug: slug, toolSlugs: v?.tools.map((t) => t.slug) ?? [] });

    const deployments = v ? uniq(v.tools.map((t) => String(t.deployment ?? "").toUpperCase()).filter(Boolean)) : [];
    const deployment = deployments.length ? deployments.join(" • ") : "—";

    const firstPriceNote = v
      ? v.tools
          .flatMap((t) => (t.pricingPlans ?? []).map((p) => ({ note: p.priceNote ?? null, deployment: t.deployment ?? null })))
          .find((p) => p.note)?.note
      : null;

    const pricingType = pricingTypeFromNote(firstPriceNote ?? null, null);
    const pricingModel = firstPriceNote ? normalizePricingText(firstPriceNote, pricingType) : "—";

    const indiaReadiness = v ? (v.verifiedInIndia ? "Verified" : "Unverified") : brief.exists ? "Brief only" : "—";

    const moduleNames = v
      ? uniq(v.tools.flatMap((t) => t.categories.map((c) => c.category.name))).slice(0, 6)
      : [];
    const keyModules = moduleNames.length ? moduleNames.join(", ") : "—";

    const integrationNames = v
      ? uniq(v.tools.flatMap((t) => t.integrations.map((i) => i.integration.name))).slice(0, 10)
      : [];
    const integrations = integrationNames.length
      ? integrationNames.join(", ")
      : brief.sections["integrations"]
        ? firstBullets(brief.sections["integrations"], 3).join("; ") || "—"
        : "—";

    const securityText =
      brief.sections["compliance, security, and privacy"] ??
      brief.sections["compliance and security"] ??
      brief.sections["compliance"] ??
      "";
    const security = securityText ? (firstBullets(securityText, 3).join("; ") || "—") : "—";

    const bestFitText = brief.sections["best fit company size analyst view"] ?? "";
    const bestFitSize = bestFitText ? (firstBullets(bestFitText, 2).join("; ") || "—") : v?.supportedSizeBands?.length ? "See vendor size bands" : "—";

    compare.push({
      slug,
      name: slug === "freshteam" ? "Freshteam (Freshworks)" : v?.name ?? slug,
      websiteUrl: v?.websiteUrl ?? null,
      pricingModel,
      deployment,
      indiaReadiness,
      keyModules,
      integrations,
      security,
      bestFitSize,
      sourcesCount: brief.urls.length ? String(brief.urls.length) : "—",
      lastChecked: brief.updatedAt ? brief.updatedAt.toISOString().slice(0, 10) : "—",
    });
  }

  const rows: Array<{ label: string; key: keyof CompareVendor }> = [
    { label: "Pricing model", key: "pricingModel" },
    { label: "Deployment", key: "deployment" },
    { label: "India readiness", key: "indiaReadiness" },
    { label: "Key modules", key: "keyModules" },
    { label: "Integrations", key: "integrations" },
    { label: "Security", key: "security" },
    { label: "Best-fit size", key: "bestFitSize" },
    { label: "Sources", key: "sourcesCount" },
    { label: "Last checked", key: "lastChecked" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Compare vendors</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">A quick, apples-to-apples view using catalog + brief-derived fields.</p>
          </div>
          <Link className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/vendors">
            Back to vendors →
          </Link>
        </div>

        <Card className="border border-[var(--border)] bg-[var(--surface-1)] shadow-[var(--shadow-sm)] overflow-x-auto">
          <table className="min-w-[720px] w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="p-4 text-left text-xs font-semibold text-[var(--text-muted)]">Field</th>
                {compare.map((v) => (
                  <th key={v.slug} className="p-4 text-left">
                    <div className="text-sm font-semibold text-[var(--text)]">{v.name}</div>
                    <div className="mt-1 text-xs text-[var(--text-muted)]">{v.slug}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-b border-[var(--border)] align-top">
                  <td className="p-4 text-xs font-semibold text-[var(--text-muted)] w-[180px]">{r.label}</td>
                  {compare.map((v) => (
                    <td key={v.slug + r.key} className="p-4 text-sm text-[var(--text)]">
                      {String(v[r.key] ?? "—") || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="mt-4 text-xs text-[var(--text-muted)]">
          Missing fields are shown as “—”. We only surface what we can verify from the catalog and vendor briefs.
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
