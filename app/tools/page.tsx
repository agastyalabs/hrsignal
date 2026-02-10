export const dynamic = "force-dynamic";

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
    pricingType: "Quote-based",
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
    pricingType: "PEPM",
    pricingHint: "Indicative PEPM (request quote)",
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
    pricingType: "Per user/month",
    pricingHint: "Per user/month (plan-based)",
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
    pricingType: "Per user/month",
    pricingHint: "Per user/month (plan-based)",
  },
];

import { clampCsv, indiaOnlyFromSearchParams } from "@/lib/india/mode";

const SIZE_BUCKETS = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5001-10000",
  "10000+",
] as const;

type SizeBucket = (typeof SIZE_BUCKETS)[number];

function isSizeBucket(v: string): v is SizeBucket {
  return (SIZE_BUCKETS as readonly string[]).includes(v);
}

function prettySizeBucket(v: string): string {
  if (!isSizeBucket(v)) return v;
  if (v === "10000+") return "10,000+";
  const [a, b] = v.split("-");
  if (a && b) {
    const left = a === "5001" ? "5001" : a;
    const right = b === "10000" ? "10,000" : b;
    return `${left}–${right}`;
  }
  return v;
}

function mapSizeBucketToLegacyBands(v: string): string[] {
  // IMPORTANT: we keep DB enums as-is (legacy BuyerSizeBand values).
  // These buckets are a P0 UX improvement; matching is best-effort.
  if (!isSizeBucket(v)) return [];

  if (v === "1-10" || v === "11-50" || v === "51-200") return ["EMP_20_200"];
  if (v === "201-500") return ["EMP_50_500"];
  if (v === "501-1000") return ["EMP_100_1000"];

  // For 1001+ buckets we don't have a dedicated band in DB yet.
  // Best-effort: include the largest available legacy band.
  return ["EMP_100_1000"];
}


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

  const sizeBucket = (sp.size ?? "").trim();
  const sizeQueryBands = sizeBucket ? mapSizeBucketToLegacyBands(sizeBucket) : [];
  const sizeLabel = sizeBucket ? prettySizeBucket(sizeBucket) : "Any";
  const deployment = sp.deployment?.trim() || "";
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
                deployment: deployment as never,
              }
            : {}),
          ...(compliance.length
            ? {
                indiaComplianceTags: { hasSome: compliance },
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
          if (n.includes("zoho") || n.includes("fresh")) type = "Per user/month";
        }

        const text = normalizePricingText(note, type);
        return { type, text };
      }

      tools = rows.map((t) => {
        const categories = t.categories.map((c) => c.category.name);
        const keyFeatures = [
          ...new Set([
            ...categories.slice(0, 2),
            t.deployment ? String(t.deployment).toLowerCase() === "cloud" ? "Cloud" : "Deployment options" : null,
            t.indiaComplianceTags?.length ? "India compliance" : null,
          ].filter(Boolean) as string[]),
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
        } satisfies ToolCardModel;
      });
      if (!tools.length) mode = "empty";
    } catch {
      mode = "fallback";
      tools = FALLBACK_TOOLS;
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
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
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-4 shadow-sm">
              <div className="text-sm font-semibold text-[#F9FAFB]">Search & filters</div>
              <p className="mt-1 text-sm leading-relaxed text-[#CBD5E1]">
                India-first mode is ON by default. Turn it off to browse all listings.
              </p>

              <form className="mt-4 space-y-4" method="get" action="/tools">
                <div>
                  <label className="text-xs font-medium text-[#CBD5E1]">India-first mode</label>
                  <select className="input mt-1" name="india" defaultValue={indiaOnly ? "1" : "0"} aria-label="India-first mode">
                    <option value="1">On (India-verified vendors only)</option>
                    <option value="0">Off (show all vendors)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#CBD5E1]">Search</label>
                  <input
                    className="input mt-1"
                    name="q"
                    defaultValue={q}
                    placeholder="e.g., Keka, payroll, attendance"
                    aria-label="Search tools"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#CBD5E1]">Company size</label>
                  <select className="input mt-1" name="size" defaultValue={sizeBucket} aria-label="Company size">
                    <option value="">Any</option>
                    <option value="1-10">1–10 employees</option>
                    <option value="11-50">11–50 employees</option>
                    <option value="51-200">51–200 employees</option>
                    <option value="201-500">201–500 employees</option>
                    <option value="501-1000">501–1000 employees</option>
                    <option value="1001-5000">1001–5000 employees</option>
                    <option value="5001-10000">5001–10,000 employees</option>
                    <option value="10000+">10,000+ employees</option>
                  </select>
                  <div className="mt-1 text-xs text-[#94A3B8]">Selected: {sizeLabel}</div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#CBD5E1]">Deployment</label>
                  <select className="input mt-1" name="deployment" defaultValue={deployment} aria-label="Deployment">
                    <option value="">Any</option>
                    <option value="CLOUD">Cloud</option>
                    <option value="ONPREM">On-prem</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#CBD5E1]">Modules</label>
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
                  <div className="mt-1 text-xs text-[#94A3B8]">Tip: choose the primary module in v1.</div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#CBD5E1]">India compliance</label>
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
                  <label className="text-xs font-medium text-[#CBD5E1]">Region fit</label>
                  <select className="input mt-1" name="region" defaultValue={region} aria-label="Region fit">
                    <option value="">Any</option>
                    <option value="multi">Multi-state support</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#CBD5E1]">Category</label>
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
                  <label className="text-xs font-medium text-[#CBD5E1]">Sort</label>
                  <select className="input mt-1" name="sort" defaultValue={sort} aria-label="Sort">
                    <option value="name">Name</option>
                    <option value="recent">Recently verified</option>
                  </select>
                </div>

                <button className="h-11 w-full rounded-lg bg-[#8B5CF6] text-sm font-medium text-[#0B1220] hover:bg-[#7C3AED]">
                  Apply
                </button>

                <Link
                  className="block text-center text-sm font-medium text-[#CBD5E1] hover:text-[#F9FAFB]"
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
              <div className="text-sm text-[#CBD5E1]">
                Showing <span className="font-medium text-[#F9FAFB]">{tools.length}</span> tools
              </div>
              <Link className="text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED] hover:underline" href="/recommend">
                Prefer a guided shortlist? →
              </Link>
            </div>

            {mode === "fallback" ? (
              <div className="mt-4 rounded-2xl border border-[#1F2937] bg-[#111827] p-5 shadow-sm">
                <div className="text-sm font-semibold text-[#F9FAFB]">Showing sample tools</div>
                <p className="mt-1 text-sm leading-relaxed text-[#CBD5E1]">
                  The database/catalog is not connected. Connect DB + run migrations/seed to see the real marketplace catalog.
                </p>
              </div>
            ) : null}

            {mode === "empty" ? (
              <div className="mt-4 rounded-2xl border border-[#1F2937] bg-[#111827] p-5 shadow-sm">
                <div className="text-sm font-semibold text-[#F9FAFB]">No tools match yet</div>
                <p className="mt-1 text-sm leading-relaxed text-[#CBD5E1]">
                  Try removing filters, or seed/publish more tools from Admin.
                </p>
                <Link className="mt-3 inline-block text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED]" href="/admin">
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

        <div className="mt-10 rounded-2xl border border-[#1F2937] bg-[#111827] p-6 shadow-sm">
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
