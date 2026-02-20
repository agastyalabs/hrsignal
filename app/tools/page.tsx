export const dynamic = "force-dynamic";

export const metadata = {
  title: "HR Tools Directory (India) | HR Signal",
  description: "Browse and compare HRMS, payroll & compliance, attendance, ATS and performance tools. Evidence-first shortlists.",
  alternates: { canonical: "https://hrsignal.vercel.app/tools" },
};

import Link from "next/link";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { ToolCard, type ToolCardModel } from "@/components/catalog/ToolCard";
import { normalizePricingText, pricingTypeFromNote, type PricingType } from "@/lib/pricing/format";
import { AnalyticsView } from "@/components/analytics/AnalyticsView";

const FALLBACK_TOOLS: ToolCardModel[] = [
  {
    slug: "greythr",
    name: "greytHR",
    vendorName: "greytHR",
    categories: ["HRMS", "Payroll"],
    tagline: "HRMS + payroll for Indian SMEs",
    bestFor: ["20–500 employees"],
    keyFeatures: ["Payroll compliance", "Leave & attendance", "Employee self-serve"],
    implementationTime: "2–4 weeks",
    pricingType: "quote_based",
    pricingHint: "Contact vendor / request quote",
  },
  {
    slug: "keka",
    name: "Keka",
    vendorName: "Keka",
    categories: ["HRMS", "Payroll", "Performance"],
    tagline: "Modern HRMS with payroll",
    bestFor: ["50–1000 employees"],
    keyFeatures: ["Core HR", "Payroll", "Performance"],
    implementationTime: "2–6 weeks",
    pricingType: "per_employee_month",
    pricingHint: "Indicative per employee / month (request quote)",
  },
  {
    slug: "zoho-people",
    name: "Zoho People",
    vendorName: "Zoho",
    categories: ["HRMS", "Attendance"],
    tagline: "HRMS with attendance/leave",
    bestFor: ["20–500 employees"],
    keyFeatures: ["Attendance", "Leave policies", "Workflows"],
    implementationTime: "1–3 weeks",
    pricingType: "per_employee_month",
    pricingHint: "Per employee / month (plan-based)",
  },
  {
    slug: "freshteam",
    name: "Freshteam",
    vendorName: "Freshworks",
    categories: ["ATS"],
    tagline: "ATS + onboarding for SMEs",
    bestFor: ["Hiring teams"],
    keyFeatures: ["Pipeline", "Scorecards", "Offer workflow"],
    implementationTime: "1–2 weeks",
    pricingType: "per_employee_month",
    pricingHint: "Per employee / month (plan-based)",
  },
];

import { clampCsv, indiaOnlyFromSearchParams } from "@/lib/india/mode";

import {
  normalizeSizeParam,
  mapSizeBucketToLegacyBands,
  sizeLabel,
  normalizeDeploymentParam,
  deploymentToPrismaEnum,
  normalizePricingMetricParam,
  pricingTypeToMetric,
  normalizeEvidenceParam,
} from "@/lib/filters/taxonomy";


export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
    india?: string;
    size?: string;
    deployment?: string;
    modules?: string;
    compliance?: string;
    region?: string;
  }>;
}) {
  const sp = await searchParams;
  const indiaOnly = indiaOnlyFromSearchParams(sp);
  const category = sp.category?.trim();
  const q = sp.q?.trim();
  const sort = sp.sort?.trim() === "recent" ? "recent" : "name";

  const sizeBucket = normalizeSizeParam(sp.size) ?? null;
  const sizeQueryBands = sizeBucket ? mapSizeBucketToLegacyBands(sizeBucket) : [];
  const sizeLabelText = sizeBucket ? sizeLabel(sizeBucket) : "Any";

  const deployment = normalizeDeploymentParam(sp.deployment) ?? null;
  const pricingMetric = normalizePricingMetricParam((sp as Record<string, unknown>).pricing as string | undefined) ?? null;
  const evidence = normalizeEvidenceParam((sp as Record<string, unknown>).evidence as string | undefined) ?? null;

  const modules = clampCsv(sp.modules, 10);
  const compliance = clampCsv(sp.compliance, 20);
  const region = sp.region?.trim() || "";

  let tools: ToolCardModel[] = [];
  let mode: "live" | "empty" | "fallback" = "live";

  if (!process.env.DATABASE_URL) {
    mode = "fallback";
    tools = FALLBACK_TOOLS;
  } else {
    try {
      const rows = await prisma.tool.findMany({
        where: {
          status: "PUBLISHED",
          ...(indiaOnly
            ? {
                vendor: {
                  registeredCountry: "IN",
                  verifiedInIndia: true,
                },
              }
            : {}),
          ...(q
            ? {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { tagline: { contains: q, mode: "insensitive" } },
                  { vendor: { name: { contains: q, mode: "insensitive" } } },
                ],
              }
            : {}),
          ...(category
            ? {
                categories: {
                  some: { category: { slug: category } },
                },
              }
            : {}),
          ...(modules.length
            ? {
                categories: {
                  some: { category: { slug: { in: modules } } },
                },
              }
            : {}),
          ...(sizeQueryBands.length
            ? {
                OR: [
                  { bestForSizeBands: { hasSome: sizeQueryBands as never } },
                  { bestForSizeBands: { equals: [] } },
                ],
              }
            : {}),
          ...(deployment
            ? {
                deployment: deploymentToPrismaEnum(deployment) as never,
              }
            : {}),
          ...(compliance.length
            ? {
                indiaComplianceTags: { hasSome: compliance },
              }
            : {}),
          ...(evidence === "verified"
            ? {
                lastVerifiedAt: { not: null },
              }
            : evidence === "needs_validation"
              ? {
                  lastVerifiedAt: null,
                }
              : {}),
          ...(region === "multi"
            ? {
                vendor: {
                  ...(indiaOnly ? { registeredCountry: "IN", verifiedInIndia: true } : {}),
                  multiStateSupport: true,
                },
              }
            : {}),
        },
        orderBy: sort === "recent" ? { lastVerifiedAt: "desc" } : { name: "asc" },
        include: {
          vendor: true,
          categories: { include: { category: true } },
          pricingPlans: { select: { name: true, priceNote: true } },
        },
        take: 200,
      });

      function slugify(name: string) {
        return String(name)
          .toLowerCase()
          .replace(/&/g, "and")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .slice(0, 60);
      }

      function prettySizeBandLabel(band: string): string {
        // We only have legacy bands in DB today; label them using the new logical buckets.
        if (band === "EMP_20_200") return "51–200 employees";
        if (band === "EMP_50_500") return "201–500 employees";
        if (band === "EMP_100_1000") return "501–1000 employees";
        return String(band);
      }

      function bestForLabels(bands: unknown): string[] {
        const arr = Array.isArray(bands) ? (bands as string[]) : [];
        const out = arr.map((b) => prettySizeBandLabel(b)).filter(Boolean);
        return out.length ? out : ["SMEs"];
      }

      function implementationTime(categories: string[]) {
        const has = (x: string) => categories.some((c) => c.toLowerCase().includes(x));
        if (has("payroll") || has("compliance")) return "2–4 weeks";
        if (has("hrms") || has("core")) return "2–6 weeks";
        if (has("attendance") || has("leave") || has("time")) return "1–3 weeks";
        if (has("ats") || has("hiring")) return "1–2 weeks";
        if (has("performance") || has("okr")) return "1–3 weeks";
        return "2–6 weeks";
      }

      function pricingMeta(toolName: string, plans: Array<{ priceNote: string | null }> | undefined, deployment: unknown) {
        const note = plans?.find((p) => p.priceNote)?.priceNote?.trim() ?? null;
        const dep = typeof deployment === "string" ? (deployment as "CLOUD" | "ONPREM" | "HYBRID") : null;

        // Prefer explicit notes, otherwise keep a conservative default.
        let type: PricingType = pricingTypeFromNote(note, dep);

        // Heuristic for common SaaS vendors when no notes exist.
        if (!note) {
          const n = toolName.toLowerCase();
          if (n.includes("zoho") || n.includes("fresh")) type = "per_employee_month";
        }

        const text = normalizePricingText(note, type);
        return { type, text };
      }

      tools = rows
        .map((t) => {
          const categories = t.categories.map((c) => c.category.name);
          const keyFeatures = [
            ...new Set(
              [
                ...categories.slice(0, 2),
                t.deployment ? (String(t.deployment).toLowerCase() === "cloud" ? "Cloud" : "Deployment options") : null,
                t.indiaComplianceTags?.length ? "India compliance" : null,
              ].filter(Boolean) as string[]
            ),
          ].slice(0, 3);

          const pricing = pricingMeta(t.name, t.pricingPlans, t.deployment);

          return {
            slug: t.slug,
            name: t.name,
            vendorName: t.vendor?.name ?? undefined,
            vendorWebsiteUrl: t.vendor?.websiteUrl ?? undefined,
            vendorSlug: t.vendor?.name ? slugify(t.vendor.name) : undefined,
            categories,
            tagline: t.tagline ?? undefined,
            verified: Boolean(t.lastVerifiedAt),
            lastCheckedAt: t.lastVerifiedAt ? t.lastVerifiedAt.toISOString() : null,
            bestFor: bestForLabels(t.bestForSizeBands),
            keyFeatures,
            implementationTime: implementationTime(categories),
            pricingHint: pricing.text,
            pricingType: pricing.type,
            // used only for in-memory filter after DB fetch
            _pricingMetric: pricingTypeToMetric(pricing.type),
          } as ToolCardModel & { _pricingMetric: string };
        })
        .filter((t) => {
          if (!pricingMetric) return true;
          return (t as unknown as { _pricingMetric: string })._pricingMetric === pricingMetric;
        })
        .map((t) => {
          const x = t as ToolCardModel & { _pricingMetric: string };
          const rest: ToolCardModel = {
            slug: x.slug,
            name: x.name,
            vendorName: x.vendorName,
            vendorWebsiteUrl: x.vendorWebsiteUrl,
            vendorSlug: x.vendorSlug,
            categories: x.categories,
            tagline: x.tagline,
            verified: x.verified,
            bestFor: x.bestFor,
            keyFeatures: x.keyFeatures,
            implementationTime: x.implementationTime,
            pricingHint: x.pricingHint,
            pricingType: x.pricingType,
          };
          return rest;
        });

      if (!tools.length) mode = "empty";
    } catch {
      mode = "fallback";
      tools = FALLBACK_TOOLS;
    }
  }

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: tools.slice(0, 50).map((t, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: t.name,
      url: `https://hrsignal.vercel.app/tools/${t.slug}`,
    })),
  };

  const filterApplied = Boolean(
    q ||
      category ||
      sort !== "name" ||
      indiaOnly ||
      sizeBucket ||
      deployment ||
      pricingMetric ||
      modules.length ||
      compliance.length ||
      region ||
      evidence
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)]">
      <AnalyticsView event="view_directory" props={{ directory: "tools" }} />
      {filterApplied ? (
        <AnalyticsView
          event="apply_filters"
          props={{
            directory: "tools",
            q: q ?? "",
            category: category ?? "",
            sort,
            india: indiaOnly ? 1 : 0,
            size: sizeBucket ?? "",
            deployment: deployment ?? "",
            pricing: pricingMetric ?? "",
            modules: modules.join(","),
            compliance: compliance.join(","),
            region: region ?? "",
            evidence: evidence ?? "",
          }}
        />
      ) : null}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <h1 className="sr-only">Tools directory</h1>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            title="Tools directory"
            subtitle="Browse HRMS, payroll & compliance, attendance, ATS and performance tools. Use filters to narrow quickly."
          />
          <ButtonLink href="/recommend" variant="primary" size="md">
            Get recommendations
          </ButtonLink>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Filters */}
          <aside className="lg:col-span-4">
            <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4 shadow-[var(--shadow-soft)]">
              <div className="text-sm font-semibold text-[var(--text)]">Search & filters</div>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                India-first mode is ON by default. Turn it off to browse all listings.
              </p>

              <form className="mt-4 space-y-4" method="get" action="/tools">
                <div>
                  <label className="text-xs font-medium text-[var(--text-muted)]">India-first mode</label>
                  <select className="input mt-1" name="india" defaultValue={indiaOnly ? "1" : "0"} aria-label="India-first mode">
                    <option value="1">On (India-verified vendors only)</option>
                    <option value="0">Off (show all vendors)</option>
                  </select>
                </div>

                {/* Search lives in global header. Preserve any existing query in the filter form submit. */}
                {q ? <input type="hidden" name="q" value={q} /> : null}

                <div>
                  <label className="text-xs font-medium text-[var(--text-muted)]">Company size</label>
                  <select className="input mt-1" name="size" defaultValue={sizeBucket ?? ""} aria-label="Company size">
                    <option value="">Any</option>
                    <option value="smb">SMB (20–200)</option>
                    <option value="mid">Mid‑Market (201–1000)</option>
                    <option value="enterprise" disabled>
                      Enterprise (1001+)
                    </option>
                  </select>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">Selected: {sizeLabelText}</div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--text-muted)]">Deployment</label>
                  <select className="input mt-1" name="deployment" defaultValue={deployment ?? ""} aria-label="Deployment">
                    <option value="">Any</option>
                    <option value="cloud">Cloud / SaaS</option>
                    <option value="onprem">On‑prem</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--text-muted)]">Pricing metric</label>
                  <select className="input mt-1" name="pricing" defaultValue={pricingMetric ?? ""} aria-label="Pricing metric">
                    <option value="">Any</option>
                    <option value="pepm">PEPM</option>
                    <option value="one_time">On‑prem one-time</option>
                    <option value="quote_based">Quote-based</option>
                    <option value="per_company_month">Per company / month</option>
                  </select>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">Rule of thumb: Cloud pricing is typically PEPM (per employee / month). On‑prem is typically one‑time / annual.</div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--text-muted)]">Evidence</label>
                  <select className="input mt-1" name="evidence" defaultValue={evidence ?? ""} aria-label="Evidence">
                    <option value="">Any</option>
                    <option value="verified">Verified</option>
                    <option value="needs_validation">Needs validation</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--text-muted)]">Modules</label>
                  <select className="input mt-1" name="modules" defaultValue={modules.join(",")} aria-label="Modules">
                    <option value="">Any</option>
                    <option value="hrms">HRMS</option>
                    <option value="payroll">Payroll + Compliance</option>
                    <option value="attendance">Attendance/Leave</option>
                    <option value="ats">ATS/Hiring</option>
                    <option value="performance">Performance/OKR</option>
                    <option value="lms">LMS</option>
                    <option value="bgv">BGV</option>
                  </select>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">Tip: choose the primary module in v1.</div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--text-muted)]">India compliance</label>
                  <select className="input mt-1" name="compliance" defaultValue={compliance.join(",")} aria-label="India compliance">
                    <option value="">Any</option>
                    <option value="PF">PF</option>
                    <option value="ESI">ESI</option>
                    <option value="PT">PT</option>
                    <option value="LWF">LWF</option>
                    <option value="TDS">TDS</option>
                    <option value="Form16">Form 16</option>
                    <option value="24Q">24Q</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--text-muted)]">Region fit</label>
                  <select className="input mt-1" name="region" defaultValue={region} aria-label="Region fit">
                    <option value="">Any</option>
                    <option value="multi">Multi-state support</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--text-muted)]">Category</label>
                  <select className="input mt-1" name="category" defaultValue={category ?? ""} aria-label="Category">
                    <option value="">All categories</option>
                    <option value="hrms">HRMS</option>
                    <option value="payroll">Payroll + Compliance</option>
                    <option value="attendance">Attendance/Leave</option>
                    <option value="ats">ATS/Hiring</option>
                    <option value="performance">Performance/OKR</option>
                    <option value="lms">LMS</option>
                    <option value="bgv">BGV</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--text-muted)]">Sort</label>
                  <select className="input mt-1" name="sort" defaultValue={sort} aria-label="Sort">
                    <option value="name">Name</option>
                    <option value="recent">Recently verified</option>
                  </select>
                </div>

                <button className="h-11 w-full rounded-[var(--radius-sm)] bg-[var(--primary)] text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]">
                  Apply
                </button>

                <Link
                  className="block text-center text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)]"
                  href="/tools"
                >
                  Reset filters
                </Link>
              </form>
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0 lg:col-span-8">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-[var(--text-muted)]">
                Showing <span className="font-semibold text-[var(--text)]">{tools.length}</span> tools
              </div>
              <Link className="text-sm font-semibold text-[var(--link)] hover:text-[var(--link-hover)] hover:underline" href="/recommend">
                Prefer a guided shortlist? →
              </Link>
            </div>

            {mode === "fallback" ? (
              <div className="mt-4 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-soft)]">
                <div className="text-sm font-semibold text-[var(--text)]">Showing sample tools</div>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                  The database/catalog is not connected. Connect DB + run migrations/seed to see the real marketplace catalog.
                </p>
              </div>
            ) : null}

            {mode === "empty" ? (
              <div className="mt-4 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-soft)]">
                <div className="text-sm font-semibold text-[var(--text)]">No tools match yet</div>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                  Try removing filters, or seed/publish more tools from Admin.
                </p>
                <Link className="mt-3 inline-block text-sm font-semibold text-[var(--link)] hover:text-[var(--link-hover)]" href="/admin">
                  Go to Admin →
                </Link>
              </div>
            ) : null}

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {tools.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </div>
        </div>

        {/* Results + empty/fallback states are rendered in the right column above. */}

        <div className="mt-10 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-[var(--shadow-soft)]">
          <SectionHeading
            title="Why trust these listings?"
            subtitle="We prioritize transparent metadata (categories, integrations, last verified) and keep recommendations explainable."
          />
          <div className="mt-6">
            <TrustStrip />
          </div>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
