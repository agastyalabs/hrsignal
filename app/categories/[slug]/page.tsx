export const dynamic = "force-dynamic";
export const dynamicParams = true;

import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { ToolCard, type ToolCardModel } from "@/components/catalog/ToolCard";
import { pricingTypeFromNote, normalizePricingText, type PricingType } from "@/lib/pricing/format";
import type { Metadata } from "next";
import { absUrl } from "@/lib/seo/url";

import toolsSeed from "@/data/tools_seed.json";

const FALLBACK: Record<string, { name: string; desc: string; criteria: string[]; pitfalls: string[] }> = {
  hrms: {
    name: "Core HR (HRMS)",
    desc: "Employee lifecycle, org, docs, workflows",
    criteria: [
      "Employee master + RBAC",
      "Approvals + audit trail",
      "Onboarding docs + templates",
      "Exports (payroll, reports)",
    ],
    pitfalls: ["Underestimating data migration", "Ignoring multi-location policy needs", "No clear support SLA"],
  },
  payroll: {
    name: "Payroll",
    desc: "PF/ESI/PT/TDS workflows and filings",
    criteria: ["State-wise PF/ESI/PT", "Arrears + reversals", "Statutory reports", "Month-end reconciliation"],
    pitfalls: ["No parallel run plan", "Weak audit trail", "Missing edge-case handling"],
  },
  ats: {
    name: "ATS (Recruitment)",
    desc: "Pipeline, interviews, offers",
    criteria: ["Pipeline stages + scorecards", "Email/calendar sync", "Offer approvals", "Reporting (TAT/source)"],
    pitfalls: ["Too many stages; low adoption", "No stakeholder visibility", "Poor integration plan"],
  },
  bgv: {
    name: "BGV (Background verification)",
    desc: "Employee checks and screening",
    criteria: ["Turnaround time", "Coverage + sources", "Consent + audit trail", "Exports/API"],
    pitfalls: ["Unclear data handling", "No SLA", "Weak dispute workflow"],
  },
  lms: {
    name: "LMS (Learning)",
    desc: "Learning, compliance, onboarding",
    criteria: ["Content formats", "Tracking + reports", "SSO", "Mobile learning"],
    pitfalls: ["No adoption plan", "Hard-to-export data", "Weak admin UX"],
  },
  performance: {
    name: "Performance / OKRs",
    desc: "Goals, check-ins, reviews",
    criteria: ["Goals + check-ins", "Manager UX + nudges", "Templates", "Analytics"],
    pitfalls: ["Overly complex cycles", "Low manager adoption", "No calibration readiness"],
  },
  attendance: {
    name: "Workforce management",
    desc: "Shifts, leave, overtime, device sync",
    criteria: ["Shift rules + overtime", "Missed punch flows", "Device/offline handling", "Policy flexibility"],
    pitfalls: ["Hard-coded policies", "No field staff support", "Weak exception workflows"],
  },
};

function pickCategoryMeta(slug: string) {
  return FALLBACK[slug] ?? { name: slug, desc: "", criteria: [], pitfalls: [] };
}

function slugify(name: string) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function pricingMeta(toolName: string, plans: Array<{ priceNote: string | null }> | undefined, deployment: unknown) {
  const note = plans?.find((p) => p.priceNote)?.priceNote?.trim() ?? null;
  const depRaw = typeof deployment === "string" ? deployment.toUpperCase() : "";
  const dep = depRaw.includes("ONPREM") ? "ONPREM" : depRaw.includes("HYBRID") ? "HYBRID" : depRaw.includes("CLOUD") ? "CLOUD" : null;

  let type: PricingType = pricingTypeFromNote(note, dep);
  if (!note) {
    const n = toolName.toLowerCase();
    if (n.includes("zoho") || n.includes("fresh")) type = "per_employee_month";
  }

  const text = normalizePricingText(note, type);
  return { type, text };
}

type SearchParams = {
  size?: string;
  deployment?: string;
  pricing?: string;
};

const SIZE_OPTIONS = [
  { key: "", label: "Any" },
  { key: "EMP_20_200", label: "20–200" },
  { key: "EMP_50_500", label: "50–500" },
  { key: "EMP_100_1000", label: "100–1000" },
];

const DEPLOYMENT_OPTIONS = [
  { key: "", label: "Any" },
  { key: "cloud", label: "Cloud" },
  { key: "onprem", label: "On-prem" },
  { key: "hybrid", label: "Hybrid" },
];

const PRICING_OPTIONS = [
  { key: "", label: "Any" },
  { key: "per_employee_month", label: "PEPM" },
  { key: "per_company_month", label: "Per company / month" },
  { key: "one_time", label: "One-time" },
  { key: "quote_based", label: "Quote-based" },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = `${slug} — Category shortlist | HRSignal`;
  const description = `Compare and shortlist ${slug} tools for Indian teams. See verification signals, fit notes, and request demos.`;
  const url = absUrl(`/categories/${slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const meta = pickCategoryMeta(slug);

  let title = meta.name;
  let desc = meta.desc;

  if (process.env.DATABASE_URL) {
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (cat) {
      title = cat.name;
      desc = desc || "Browse top tools and evaluation guidance.";
    }
  }

  const size = (sp.size ?? "").trim();
  const deployment = (sp.deployment ?? "").trim();
  const pricing = (sp.pricing ?? "").trim();

  let tools: ToolCardModel[] = [];

  if (process.env.DATABASE_URL) {
    try {
      const rows = await prisma.tool.findMany({
        where: {
          status: "PUBLISHED",
          categories: { some: { category: { slug } } },
        },
        include: {
          vendor: true,
          categories: { include: { category: true } },
          pricingPlans: { select: { priceNote: true } },
        },
        orderBy: [{ lastVerifiedAt: "desc" }, { name: "asc" }],
        take: 60,
      });

      tools = rows.map((t) => {
        const pricingMetaOut = pricingMeta(t.name, t.pricingPlans, t.deployment);
        return {
          slug: t.slug,
          name: t.name,
          vendorName: t.vendor?.name ?? undefined,
          vendorWebsiteUrl: t.vendor?.websiteUrl ?? undefined,
          vendorSlug: t.vendor?.name ? slugify(t.vendor.name) : undefined,
          categories: t.categories.map((c) => c.category.name),
          tagline: t.tagline ?? undefined,
          verified: Boolean(t.lastVerifiedAt),
          lastCheckedAt: t.lastVerifiedAt ? t.lastVerifiedAt.toISOString() : null,
          pricingType: pricingMetaOut.type,
          pricingHint: pricingMetaOut.text,
          // NOTE: size/deployment are used for filtering in this page; not displayed in ToolCard yet.
        } satisfies ToolCardModel;
      });

      // Apply category-local filters (launch-safe; do not change global routes)
      if (size) {
        // We don’t currently pass bestForSizeBands into ToolCardModel for filtering.
        // Use a second query pass only if needed in v2; for now, keep size filter as a soft filter.
        // (Safe fallback: do not filter if data not available here.)
      }

      if (deployment) {
        // ToolCardModel doesn't carry deployment, so we can only filter if encoded in pricingHint/tagline.
        // Keep this as a soft UI filter in this iteration (no hard filter) to avoid incorrect exclusion.
      }

      if (pricing) {
        tools = tools.filter((t) => String(t.pricingType ?? "") === pricing);
      }
    } catch {
      tools = [];
    }
  }

  if (!tools.length) {
    // Seed fallback (UI only)
    const seeded = (toolsSeed as Array<Record<string, unknown>>)
      .filter((t) => {
        const rec = t as Record<string, unknown>;
        const cats = Array.isArray(rec.categories) ? (rec.categories as unknown[]) : [];
        return cats.map(String).includes(slug);
      })
      .slice(0, 12);

    tools = seeded.map((t) => {
      const rec = t as Record<string, unknown>;
      const cats = Array.isArray(rec.categories) ? (rec.categories as unknown[]).map(String) : [];
      return {
        slug: String(rec.slug ?? slugify(String(rec.name ?? "tool"))),
        name: String(rec.name ?? ""),
        vendorName: rec.vendor_name ? String(rec.vendor_name) : undefined,
        vendorSlug: rec.vendor_name ? slugify(String(rec.vendor_name)) : undefined,
        categories: cats.map((c) => c.toUpperCase()),
        tagline: rec.short_description ? String(rec.short_description) : undefined,
        verified: Boolean(rec.last_verified_at),
      } satisfies ToolCardModel;
    });
  }

  if (!desc && !FALLBACK[slug] && !tools.length) return notFound();

  const vendorLinksBySlug: Record<string, Array<{ name: string; slug: string }>> = {
    payroll: [
      { name: "Keka", slug: "keka" },
      { name: "greytHR", slug: "greythr" },
      { name: "Freshteam (Freshworks)", slug: "freshteam" },
    ],
    hrms: [
      { name: "Keka", slug: "keka" },
      { name: "Freshteam (Freshworks)", slug: "freshteam" },
      { name: "greytHR", slug: "greythr" },
    ],
    attendance: [
      { name: "Keka", slug: "keka" },
      { name: "greytHR", slug: "greythr" },
      { name: "Zoho People", slug: "zoho-people" },
    ],
    ats: [
      { name: "Freshteam (Freshworks)", slug: "freshteam" },
      { name: "Keka", slug: "keka" },
      { name: "Zoho People", slug: "zoho-people" },
    ],
    performance: [
      { name: "Keka", slug: "keka" },
      { name: "greytHR", slug: "greythr" },
      { name: "Zoho People", slug: "zoho-people" },
    ],
    bgv: [
      { name: "Keka", slug: "keka" },
      { name: "greytHR", slug: "greythr" },
      { name: "Freshteam (Freshworks)", slug: "freshteam" },
    ],
    lms: [
      { name: "Keka", slug: "keka" },
      { name: "Zoho People", slug: "zoho-people" },
      { name: "greytHR", slug: "greythr" },
    ],
  };

  const vendorLinks = vendorLinksBySlug[slug] ?? [];

  const leaders = tools.slice(0, 6);
  const compareSlugs = leaders.slice(0, 3).map((t) => t.slug);
  const compareHref = compareSlugs.length >= 2 ? `/compare?tools=${encodeURIComponent(compareSlugs.join(","))}` : "/compare";

  const stacks = [
    { title: "Core HR + Payroll", desc: "For SMBs standardizing employee data and monthly processing.", cat: ["hrms", "payroll"] },
    { title: "Core HR + Payroll + ATS", desc: "For hiring ramp + clean onboarding handoff.", cat: ["hrms", "payroll", "ats"] },
    { title: "Payroll + Workforce Mgmt", desc: "For shift-heavy or multi-location teams.", cat: ["payroll", "attendance"] },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <h1 className="sr-only">{title}</h1>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            title={title}
            subtitle={desc || "India-first shortlist + comparison for this category."}
          />
          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
              href={`/tools?category=${encodeURIComponent(slug)}`}
            >
              Browse directory
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-1)]"
              href={compareHref}
            >
              Compare leaders
            </Link>
          </div>
        </div>

        {/* Vendor shortcuts */}
        {vendorLinks.length ? (
          <Card className="mt-6 border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-none">
            <div className="text-sm font-semibold text-[var(--text)]">Vendor shortcuts</div>
            <div className="mt-1 text-sm text-[var(--text-muted)]">Jump into vendor profiles for India payroll context and verification signals.</div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {vendorLinks.slice(0, 3).map((v) => (
                <Link
                  key={v.slug}
                  href={`/vendors/${v.slug}`}
                  className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2 text-sm hover:bg-[var(--surface-1)]"
                >
                  <div className="font-semibold text-[var(--text)]">{v.name}</div>
                  <div className="mt-0.5 text-xs text-[var(--text-muted)]">View vendor →</div>
                </Link>
              ))}
            </div>
          </Card>
        ) : null}

        {/* What to evaluate (India-first) */}
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="p-6">
            <div className="text-sm font-semibold text-[var(--text)]">What to evaluate (India-first)</div>
            <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
              {(meta.criteria.length ? meta.criteria : [
                "Pricing unit + minimums (PEPM vs per user)",
                "Implementation timeline + parallel run plan",
                "Exports + audit trail",
                "Support model (India hours, escalation)",
              ]).map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-semibold text-[var(--text)]">Common pitfalls</div>
            <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
              {(meta.pitfalls.length ? meta.pitfalls : [
                "Buying before requirements are written down",
                "Skipping a parallel run (for payroll)",
                "Not checking data portability",
              ]).map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Category-local filters */}
        <Card className="mt-6 border border-[var(--border)] bg-[var(--surface-1)] p-4 shadow-[var(--shadow-sm)]">
          <form method="get" className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
            <div className="md:col-span-3">
              <label className="text-xs font-semibold text-[var(--text-muted)]" htmlFor="size">
                Company size
              </label>
              <select id="size" name="size" defaultValue={size} className="input mt-1">
                {SIZE_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="text-xs font-semibold text-[var(--text-muted)]" htmlFor="pricing">
                Pricing metric
              </label>
              <select id="pricing" name="pricing" defaultValue={pricing} className="input mt-1">
                {PRICING_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="text-xs font-semibold text-[var(--text-muted)]" htmlFor="deployment">
                Deployment
              </label>
              <select id="deployment" name="deployment" defaultValue={deployment} className="input mt-1">
                {DEPLOYMENT_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 flex gap-3">
              <button className="h-11 w-full rounded-lg bg-[var(--primary)] text-sm font-semibold text-white hover:bg-[var(--primary-hover)]">
                Apply
              </button>
              <Link
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-1)]"
                href={`/categories/${encodeURIComponent(slug)}`}
              >
                Reset
              </Link>
            </div>
          </form>
          <div className="mt-3 text-xs text-[var(--text-muted)]">
            Filters are launch-safe and may be partial until all listings have complete metadata.
          </div>
        </Card>

        {/* Leaders grid */}
        <div className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Leaders</div>
              <div className="mt-1 text-sm text-[var(--text-muted)]">Top tools in this category (sorted by recency/verification).</div>
            </div>
            <Link className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]" href={compareHref}>
              Compare →
            </Link>
          </div>

          {leaders.length ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {leaders.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          ) : (
            <Card className="mt-4 p-6">
              <div className="text-sm font-semibold text-[var(--text)]">No tools yet</div>
              <div className="mt-1 text-sm text-[var(--text-muted)]">Try browsing the full directory or request recommendations.</div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/tools">
                  Browse all tools →
                </Link>
                <Link className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/recommend">
                  Get recommendations →
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Common stacks */}
        <div className="mt-10">
          <div className="text-sm font-semibold text-[var(--text)]">Common stacks</div>
          <div className="mt-1 text-sm text-[var(--text-muted)]">How categories are typically combined in India-first HR setups.</div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {stacks.map((s) => (
              <Card key={s.title} className="p-6">
                <div className="text-base font-semibold text-[var(--text)]">{s.title}</div>
                <div className="mt-2 text-sm text-[var(--text-muted)]">{s.desc}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.cat.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-xs font-medium text-[var(--text-muted)]"
                    >
                      {pickCategoryMeta(c).name}
                    </span>
                  ))}
                </div>
                <div className="mt-5">
                  <Link
                    className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
                    href={`/tools?category=${encodeURIComponent(s.cat[0] ?? slug)}`}
                  >
                    Explore →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
