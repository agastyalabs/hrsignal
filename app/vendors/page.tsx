export const dynamic = "force-dynamic";

import Link from "next/link";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { VendorCard } from "@/components/catalog/VendorCard";
import { Button, ButtonLink } from "@/components/ui/Button";
import { VendorCompareTray } from "@/components/vendor-compare/VendorCompareTray";

import { indiaOnlyFromSearchParams } from "@/lib/india/mode";
import { normalizePricingText, pricingTypeFromNote, type PricingType } from "@/lib/pricing/format";
import { canonicalVendorSlug } from "@/lib/vendors/slug";
import { getVendorBrief } from "@/lib/vendors/brief";

type VendorsSearchParams = {
  india?: string;
  size?: string;
  category?: string;
  deployment?: string;
  pricing?: string;
  indiaReady?: string;
  sort?: string;
};

function prettyPricingKey(key: string) {
  const map: Record<string, string> = {
    per_employee_month: "Per employee / month",
    per_company_month: "Per company / month",
    one_time: "One-time license",
    quote_based: "Custom quote",
  };
  return map[key] ?? key;
}

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<VendorsSearchParams>;
}) {
  const sp = await searchParams;
  const indiaOnly = indiaOnlyFromSearchParams(sp);

  const size = sp.size ? String(sp.size) : "";
  const category = sp.category ? String(sp.category) : "";
  const deployment = sp.deployment ? String(sp.deployment) : "";
  const pricing = sp.pricing ? String(sp.pricing) : "";
  const indiaReady = sp.indiaReady ? String(sp.indiaReady) : "";
  const sort = sp.sort ? String(sp.sort) : "recent";

  let vendors: Array<{
    id: string;
    slug: string;
    name: string;
    websiteUrl: string | null;
    toolsCount: number;
    categories: string[];
    categorySlugs: string[];
    tagline: string | null;
    pricingType: PricingType;
    pricingText: string;
    pricingKey: string;
    deploymentKeys: string[];
    verifiedInIndia: boolean;
    freshnessLabel: string | null;
    freshnessSortKey: number;
    sourcesCount: number | null;
    supportedSizeBands: string[];
  }> = [];

  const sizeLabel = (band: string) => {
    if (band === "EMP_20_200") return "51–200";
    if (band === "EMP_50_500") return "201–500";
    if (band === "EMP_100_1000") return "501–1000";
    return band;
  };

  const normalizeDeploymentKey = (d: unknown) => {
    const v = String(d ?? "").toUpperCase();
    if (v.includes("ONPREM")) return "onprem";
    if (v.includes("HYBRID")) return "hybrid";
    if (v.includes("CLOUD")) return "cloud";
    return "";
  };

  if (process.env.DATABASE_URL) {
    try {
      const rows = await prisma.vendor.findMany({
        where: {
          isActive: true,
          ...(indiaOnly ? { registeredCountry: "IN", verifiedInIndia: true } : {}),
        },
        orderBy: [{ verifiedInIndia: "desc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          websiteUrl: true,
          verifiedInIndia: true,
          supportedSizeBands: true,
          _count: { select: { tools: true } },
          categories: { select: { slug: true, name: true } },
          tools: {
            where: { status: "PUBLISHED" },
            select: {
              slug: true,
              tagline: true,
              deployment: true,
              lastVerifiedAt: true,
              pricingPlans: { select: { priceNote: true, setupFeeNote: true }, take: 2 },
            },
            take: 6,
          },
        },
        take: 200,
      });

      const vendorsWithBriefMeta = await Promise.all(
        rows.map(async (v) => {
          const slug = canonicalVendorSlug({ vendorName: v.name, toolSlugs: v.tools.map((t) => t.slug) });
          const brief = await getVendorBrief({ vendorName: v.name, urlSlug: slug, toolSlugs: v.tools.map((t) => t.slug) });
          return { v, slug, brief };
        })
      );

      vendors = vendorsWithBriefMeta.map(({ v, slug, brief }) => {
        const firstPlan = v.tools
          .flatMap((t) =>
            (t.pricingPlans ?? []).map((p) => ({
              deployment: t.deployment,
              priceNote: p.priceNote,
              setupFeeNote: p.setupFeeNote,
            }))
          )
          .find((p) => p.priceNote || p.setupFeeNote);

        const type = pricingTypeFromNote(firstPlan?.priceNote ?? null, firstPlan?.deployment ?? null);
        const text = firstPlan?.priceNote
          ? normalizePricingText(firstPlan.priceNote, type)
          : "Contact vendor / request quote";

        const newestTool = v.tools
          .map((t) => (t.lastVerifiedAt ? new Date(t.lastVerifiedAt).getTime() : 0))
          .reduce((a, b) => Math.max(a, b), 0);

        const freshnessFromBrief = brief.updatedAt ? brief.updatedAt.getTime() : 0;
        const freshnessSortKey = Math.max(newestTool, freshnessFromBrief);
        const freshnessLabel = freshnessSortKey ? `Updated: ${new Date(freshnessSortKey).toISOString().slice(0, 10)}` : null;

        const deploymentKeys = Array.from(
          new Set(v.tools.map((t) => normalizeDeploymentKey(t.deployment)).filter(Boolean))
        );

        const pricingKey = String(type ?? "quote_based");

        return {
          id: v.id,
          slug,
          name: v.name,
          websiteUrl: v.websiteUrl ?? null,
          toolsCount: v._count.tools,
          categories: v.categories.map((c) => c.name),
          categorySlugs: v.categories.map((c) => c.slug),
          tagline: v.tools[0]?.tagline ?? null,
          pricingType: type,
          pricingText: text,
          pricingKey,
          deploymentKeys,
          verifiedInIndia: Boolean(v.verifiedInIndia),
          freshnessLabel,
          freshnessSortKey,
          sourcesCount: brief.urls.length ? brief.urls.length : null,
          lastCheckedAt: freshnessSortKey ? new Date(freshnessSortKey).toISOString() : null,
          supportedSizeBands: (v.supportedSizeBands ?? []).map((b) => sizeLabel(String(b))),
        };
      });
    } catch {
      vendors = [];
    }
  }

  const filtered = vendors
    .filter((v) => {
      if (indiaReady === "1" && !v.verifiedInIndia) return false;
      if (size && !v.supportedSizeBands.includes(size)) return false;
      if (category && !v.categorySlugs.includes(category)) return false;
      if (deployment && !v.deploymentKeys.includes(deployment)) return false;
      if (pricing && v.pricingKey !== pricing) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "tools") return b.toolsCount - a.toolsCount;
      if (sort === "recent") return b.freshnessSortKey - a.freshnessSortKey;
      if (sort === "rated" || sort === "reviewed") return b.toolsCount - a.toolsCount; // ratings not available yet
      return b.freshnessSortKey - a.freshnessSortKey;
    });

  const activePills: Array<{ key: string; label: string }> = [];
  if (indiaOnly) activePills.push({ key: "india", label: "India-first" });
  if (indiaReady === "1") activePills.push({ key: "indiaReady", label: "India-ready" });
  if (size) activePills.push({ key: "size", label: `Size: ${size}` });
  if (category) activePills.push({ key: "category", label: `Category: ${category}` });
  if (deployment) activePills.push({ key: "deployment", label: `Deployment: ${deployment}` });
  if (pricing) activePills.push({ key: "pricing", label: `Pricing: ${prettyPricingKey(pricing)}` });
  if (sort && sort !== "recent") activePills.push({ key: "sort", label: `Sort: ${sort}` });

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            title="Vendors"
            subtitle="Browse companies behind the tools. Filter by size, category, and India readiness."
          />
          <Link className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline" href="/tools">
            Browse tools
          </Link>
        </div>

        <div className="mt-6 border-b border-[var(--border-soft)] pb-4">
          <form method="get" action="/vendors" className="flex flex-wrap items-end gap-3">
            <div className="min-w-[180px] flex-1 sm:flex-none">
              <label className="text-xs font-semibold text-[var(--text-muted)]" htmlFor="sort">
                Sort
              </label>
              <select id="sort" name="sort" defaultValue={sort} className="input mt-1">
                <option value="recent">Recently updated</option>
                <option value="tools">Most tools</option>
                <option value="reviewed">Most reviewed (N/A)</option>
                <option value="rated">Top rated (N/A)</option>
              </select>
            </div>

            <div className="min-w-[180px] flex-1 sm:flex-none">
              <label className="text-xs font-semibold text-[var(--text-muted)]" htmlFor="size">
                Company size
              </label>
              <select id="size" name="size" defaultValue={size} className="input mt-1">
                <option value="">All</option>
                <option value="51–200">51–200</option>
                <option value="201–500">201–500</option>
                <option value="501–1000">501–1000</option>
              </select>
            </div>

            <div className="min-w-[180px] flex-1 sm:flex-none">
              <label className="text-xs font-semibold text-[var(--text-muted)]" htmlFor="category">
                Category
              </label>
              <select id="category" name="category" defaultValue={category} className="input mt-1">
                <option value="">All</option>
                <option value="hrms">HRMS</option>
                <option value="ats">ATS</option>
                <option value="payroll">Payroll</option>
                <option value="attendance">Attendance</option>
                <option value="performance">Performance</option>
                <option value="bgv">BGV</option>
                <option value="lms">LMS</option>
              </select>
            </div>

            <div className="min-w-[180px] flex-1 sm:flex-none">
              <label className="text-xs font-semibold text-[var(--text-muted)]" htmlFor="deployment">
                Deployment
              </label>
              <select id="deployment" name="deployment" defaultValue={deployment} className="input mt-1">
                <option value="">All</option>
                <option value="cloud">Cloud</option>
                <option value="hybrid">Hybrid</option>
                <option value="onprem">On‑prem</option>
              </select>
            </div>

            <div className="min-w-[200px] flex-1 sm:flex-none">
              <label className="text-xs font-semibold text-[var(--text-muted)]" htmlFor="pricing">
                Pricing metric
              </label>
              <select id="pricing" name="pricing" defaultValue={pricing} className="input mt-1">
                <option value="">All</option>
                <option value="per_employee_month">Per employee / month</option>
                <option value="per_company_month">Per company / month</option>
                <option value="one_time">One-time license</option>
                <option value="quote_based">Custom quote</option>
              </select>
            </div>

            <div className="min-w-[160px] flex-1 sm:flex-none">
              <label className="text-xs font-semibold text-[var(--text-muted)]" htmlFor="indiaReady">
                India-ready
              </label>
              <select id="indiaReady" name="indiaReady" defaultValue={indiaReady} className="input mt-1">
                <option value="">All</option>
                <option value="1">Verified</option>
              </select>
            </div>

            <input type="hidden" name="india" value={indiaOnly ? "1" : "0"} />

            <div className="flex items-end gap-3">
              <Button type="submit" size="md" variant="primary">
                Apply
              </Button>
              <ButtonLink href="/vendors" size="md" variant="secondary">
                Clear all
              </ButtonLink>
            </div>

            <div className="ml-auto pb-[2px] text-xs font-semibold text-[var(--text-muted)]">
              {filtered.length} results
            </div>

            {activePills.length ? (
              <div className="w-full pt-2">
                <div className="flex flex-wrap gap-2">
                  {activePills.map((p) => (
                    <span
                      key={p.key}
                      className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]"
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </form>
        </div>

        {!process.env.DATABASE_URL ? (
          <Card className="mt-6 shadow-sm">
            <div className="text-sm font-semibold text-[#F9FAFB]">Connect the catalog database</div>
            <p className="mt-1 text-sm leading-relaxed text-[#CBD5E1]">
              Vendor directory requires a DB connection. Set <code>DATABASE_URL</code> and seed the catalog.
            </p>
          </Card>
        ) : null}

        {process.env.DATABASE_URL && vendors.length === 0 ? (
          <Card className="mt-6 p-6 shadow-[var(--shadow-sm)]">
            <div className="text-sm font-semibold text-[var(--text)]">No vendors yet</div>
            <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">Seed the catalog from Admin → Seed catalog.</p>
            <Link className="mt-3 inline-block text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline" href="/admin">
              Go to Admin →
            </Link>
          </Card>
        ) : null}

        {process.env.DATABASE_URL && vendors.length > 0 && filtered.length === 0 ? (
          <Card className="mt-6 p-6 shadow-[var(--shadow-sm)]">
            <div className="text-sm font-semibold text-[var(--text)]">No vendors match these filters</div>
            <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
              Try clearing filters, or broaden India-ready/category constraints.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/vendors">
                Clear all →
              </Link>
              <Link className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/categories">
                Browse categories →
              </Link>
            </div>
          </Card>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v, idx) => (
            <VendorCard key={v.id} vendor={{ ...v, rank: idx + 1 }} />
          ))}
        </div>
      </Section>

      <VendorCompareTray />
      <SiteFooter />
    </div>
  );
}
