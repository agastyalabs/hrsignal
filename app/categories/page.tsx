export const dynamic = "force-dynamic";

export const metadata = {
  title: "HR Software Categories | HR Signal",
  description: "Browse HR software by category: payroll & compliance, HRMS, ATS, attendance, performance and more.",
  alternates: { canonical: "https://hrsignal.vercel.app/categories" },
};

import Link from "next/link";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { getToolCountsByCategorySafe } from "./get-tool-counts";

const FALLBACK = [
  { slug: "payroll-india", name: "Payroll India (Guide)", desc: "India payroll complexity + vendor shortlisting guide" },
  { slug: "hrms", name: "Core HRMS", desc: "Employee lifecycle, org, docs, workflows" },
  { slug: "payroll", name: "Payroll & Compliance", desc: "PF/ESI/PT/TDS workflows and filings" },
  { slug: "attendance", name: "Attendance / Leave / Time", desc: "Shifts, biometric, field staff" },
  { slug: "ats", name: "ATS / Hiring", desc: "Pipeline, interviews, offers" },
  { slug: "performance", name: "Performance / OKR", desc: "Reviews, goals, feedback" },
  { slug: "bgv", name: "Background Verification (BGV)", desc: "Employee checks and screening" },
  { slug: "lms", name: "LMS / L&D", desc: "Training, compliance learning, onboarding" },
] as const;

type CoreCategorySlug = "hrms" | "payroll" | "attendance" | "ats" | "performance";

type BuyerGuidance = {
  title: string;
  bullets: string[];
  checks: string[];
};

const GUIDANCE: Record<CoreCategorySlug, BuyerGuidance> = {
  hrms: {
    title: "How to choose an HRMS",
    bullets: [
      "Start with employee master data + org structure (permissions, audit logs, exports).",
      "Validate onboarding/document workflows and approvals with a real scenario.",
      "Ask about implementation: data migration, timelines, and support SLAs.",
    ],
    checks: ["RBAC + audit trail", "Exports", "Document workflows", "Manager self-serve"],
  },
  payroll: {
    title: "How to choose payroll & compliance",
    bullets: [
      "Confirm PF/ESI/PT/TDS coverage for your states and edge cases (arrears, reversals).",
      "Ask for sample statutory reports + reconciliation flow for month-end.",
      "Validate multi-entity/multi-state readiness if you have multiple locations.",
    ],
    checks: ["PF/ESI/PT/TDS", "Arrears + reversals", "Audit-ready reports", "Multi-state"],
  },
  attendance: {
    title: "How to choose attendance & leave",
    bullets: [
      "If you have shifts, make shift rules + overtime approvals the demo centerpiece.",
      "Validate device flows: biometric sync, offline handling, missed punches.",
      "Check policy flexibility: leave accruals, holidays, location-specific rules.",
    ],
    checks: ["Shifts", "Overtime", "Biometric/device", "Field staff"],
  },
  ats: {
    title: "How to choose an ATS",
    bullets: [
      "Map your pipeline stages first; then ensure the tool fits your interview process.",
      "Validate scorecards, offer approvals, and reporting (time-to-hire, source quality).",
      "Check integrations with email/calendar and your HRMS (or plan exports).",
    ],
    checks: ["Scorecards", "Offer workflow", "Reporting", "Integrations"],
  },
  performance: {
    title: "How to choose performance/OKR",
    bullets: [
      "Keep it lightweight: goals + check-ins before heavy review cycles.",
      "Validate manager UX (nudges, templates) to avoid process drop-off.",
      "Check analytics and calibration support if you plan structured reviews.",
    ],
    checks: ["Goals", "Check-ins", "Templates", "Manager nudges"],
  },
};

export default async function CategoriesPage() {
  const categories = await getCategories();
  const slugs = categories.map((c) => c.slug);
  const [topToolsByCategory, toolCounts] = await Promise.all([
    getTopToolsByCategorySafe(slugs),
    getToolCountsByCategorySafe(slugs),
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: categories.slice(0, 50).map((c, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: c.name,
      url: `https://hrsignal.vercel.app/categories/${c.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <h1 className="sr-only">Categories</h1>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            title="Categories"
            subtitle="Start with the module you need. Each category opens a directory view you can filter and compare."
          />
          <Link className="text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED]" href="/tools">
            Browse all tools
          </Link>
        </div>

        <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-5 shadow-sm">
          <div className="text-sm font-semibold text-[var(--text)]">Intent filters</div>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
            Start broad, then narrow. These filters jump you straight into the directory with a sensible starting view.
          </p>

          <form action="/tools" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="sm:col-span-1">
              <label className="text-xs font-medium text-[var(--text-muted)]">Company size</label>
              <select className="input mt-1" name="size" defaultValue="smb">
                <option value="smb">SMB (20–200)</option>
                <option value="mid">Mid‑Market (201–1000)</option>
                <option value="enterprise" disabled>
                  Enterprise (1001+)
                </option>
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className="text-xs font-medium text-[var(--text-muted)]">Budget range (rough)</label>
              <select className="input mt-1" name="_budget" defaultValue="unknown">
                <option value="unknown">Not sure</option>
                <option value="lt_50">&lt; ₹50k / month</option>
                <option value="50_100">₹50k–₹1L / month</option>
                <option value="100_200">₹1L–₹2L / month</option>
                <option value="quote">Quote-based</option>
              </select>
              <div className="mt-1 text-xs text-[var(--text-muted)]">
                Budget is optional. Cloud pricing is usually <span className="font-semibold text-[var(--text)]">PEPM</span>; on‑prem is usually <span className="font-semibold text-[var(--text)]">one‑time / annual</span>.
              </div>
            </div>
            <div className="sm:col-span-1">
              <label className="text-xs font-medium text-[var(--text-muted)]">Key need</label>
              <select className="input mt-1" name="category" defaultValue="payroll">
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className="text-xs font-medium text-[var(--text-muted)]">Deployment</label>
              <select className="input mt-1" name="deployment" defaultValue="">
                <option value="">Any</option>
                <option value="cloud">Cloud</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-prem">On‑prem</option>
              </select>
            </div>

            <div className="sm:col-span-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-[var(--text-muted)]">
                Tip: for a tight shortlist + match reasons, use <span className="font-semibold text-[var(--text)]">Get recommendations</span>.
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-4 text-sm font-medium text-[var(--text)] hover:bg-[var(--primary-hover)]">
                  Browse tools
                </button>
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-[var(--border)] bg-transparent px-4 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)]"
                  href="/recommend"
                >
                  Get recommendations
                </Link>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard
              key={c.slug}
              slug={c.slug}
              name={c.name}
              description={c.desc ?? ""}
              toolCount={toolCounts.get(c.slug) ?? undefined}
            />
          ))}
        </div>

        {/* Top tools per category */}
        <div className="mt-12">
          <SectionHeading
            title="Top tools by category"
            subtitle="A quick starting point — compare a few popular options side-by-side."
          />

          <div className="mt-6 space-y-8">
            {categories.map((c) => {
              const tools = topToolsByCategory.get(c.slug) ?? [];
              const compareSlugs = tools.map((t) => t.slug).slice(0, 5);

              const core = (c.slug === "hrms" || c.slug === "payroll" || c.slug === "attendance" || c.slug === "ats" || c.slug === "performance")
                ? (c.slug as CoreCategorySlug)
                : null;
              const g = core ? GUIDANCE[core] : null;
              const count = toolCounts.get(c.slug) ?? 0;
              const compared = Math.min(Math.max(count, 8), 18);

              return (
                <div
                  key={c.slug}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-[var(--text)]">{c.name}</div>
                      {c.desc ? <div className="mt-1 text-sm text-[var(--text-muted)]">{c.desc}</div> : null}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 font-semibold text-[var(--text)]">
                          {count ? `${count} tools in directory` : "Directory available"}
                        </span>
                        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 font-medium text-[var(--text-muted)]">
                          {compared} tools compared
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link className="text-sm font-medium text-[var(--link)] hover:opacity-90" href={`/tools?category=${c.slug}`}>
                        Browse →
                      </Link>
                      {compareSlugs.length >= 2 ? (
                        <Link
                          className="inline-flex h-9 items-center rounded-lg bg-[var(--primary)] px-3 text-sm font-medium text-[var(--text)] hover:bg-[var(--primary-hover)]"
                          href={`/compare?tools=${encodeURIComponent(compareSlugs.join(","))}`}
                        >
                          Compare top tools
                        </Link>
                      ) : null}
                    </div>
                  </div>

                  {g ? (
                    <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                      <Card className="border border-[var(--border)] bg-[var(--surface-2)] p-5 lg:col-span-1">
                        <div className="text-sm font-semibold text-[var(--text)]">{g.title}</div>
                        <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                          {g.bullets.map((b) => (
                            <li key={b}>• {b}</li>
                          ))}
                        </ul>
                        <div className="mt-4 text-xs font-medium text-[var(--text-muted)]">Quick checks</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {g.checks.map((x) => (
                            <span key={x} className="rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-2.5 py-1 text-xs text-[var(--text)]">
                              {x}
                            </span>
                          ))}
                        </div>
                      </Card>

                      <div className="lg:col-span-2">
                        {tools.length ? (
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {tools.map((t) => (
                              <Link key={t.slug} href={`/tools/${t.slug}`} className="block">
                                <Card className="h-full border border-[var(--border)] bg-[var(--surface-2)] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                                  <div className="text-base font-semibold text-[var(--text)]">{t.name}</div>
                                  {t.vendorName ? (
                                    <div className="mt-1 text-sm text-[var(--text-muted)]">by {t.vendorName}</div>
                                  ) : null}
                                  {t.tagline ? (
                                    <div className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{t.tagline}</div>
                                  ) : null}
                                  <div className="mt-4 text-sm font-medium text-[var(--link)]">View details →</div>
                                </Card>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-[var(--text-muted)]">No published tools yet for this category.</div>
                        )}
                      </div>
                    </div>
                  ) : tools.length ? (
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {tools.map((t) => (
                        <Link key={t.slug} href={`/tools/${t.slug}`} className="block">
                          <Card className="h-full border border-[var(--border)] bg-[var(--surface-2)] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                            <div className="text-base font-semibold text-[var(--text)]">{t.name}</div>
                            {t.vendorName ? <div className="mt-1 text-sm text-[var(--text-muted)]">by {t.vendorName}</div> : null}
                            {t.tagline ? <div className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{t.tagline}</div> : null}
                            <div className="mt-4 text-sm font-medium text-[var(--link)]">View details →</div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 text-sm text-[var(--text-muted)]">No published tools yet for this category.</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}

async function getCategories(): Promise<Array<{ slug: string; name: string; desc?: string }>> {
  if (!process.env.DATABASE_URL) return [...FALLBACK];

  try {
    const rows = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
    if (!rows.length) return [...FALLBACK];

    return rows.map((c) => ({
      slug: c.slug,
      name: c.name,
      desc: FALLBACK.find((x) => x.slug === c.slug)?.desc,
    }));
  } catch {
    return [...FALLBACK];
  }
}

async function getTopToolsByCategorySafe(categorySlugs: string[]) {
  const empty = new Map<string, Array<{ slug: string; name: string; tagline: string | null; vendorName: string | null }>>();
  for (const c of categorySlugs) empty.set(c, []);

  // Try DB, but never crash if schema is behind or DB is unreachable.
  if (process.env.DATABASE_URL) {
    try {
      const map = new Map<string, Array<{ slug: string; name: string; tagline: string | null; vendorName: string | null }>>();

      await Promise.all(
        categorySlugs.map(async (slug) => {
          const rows = await prisma.tool.findMany({
            where: {
              status: "PUBLISHED",
              categories: { some: { category: { slug } } },
            },
            // IMPORTANT: select only stable columns so missing DB columns (e.g. Tool.deployment) won't crash.
            select: {
              slug: true,
              name: true,
              tagline: true,
              vendor: { select: { name: true } },
            },
            orderBy: [{ lastVerifiedAt: "desc" }, { name: "asc" }],
            take: 5,
          });

          map.set(
            slug,
            rows.map((t) => ({
              slug: t.slug,
              name: t.name,
              tagline: t.tagline,
              vendorName: t.vendor?.name ?? null,
            }))
          );
        })
      );

      return map;
    } catch {
      // fall through to JSON seed
    }
  }

  try {
    const mod = await import("@/data/tools_seed.json");
    const tools = (mod.default ?? []) as Array<{
      slug: string;
      name: string;
      vendor_name?: string;
      short_description?: string;
      categories?: string[];
    }>;

    const map = new Map<string, Array<{ slug: string; name: string; tagline: string | null; vendorName: string | null }>>();
    for (const c of categorySlugs) {
      const top = tools
        .filter((t) => (t.categories ?? []).includes(c))
        .slice(0, 5)
        .map((t) => ({
          slug: t.slug,
          name: t.name,
          tagline: t.short_description ?? null,
          vendorName: t.vendor_name ?? null,
        }));
      map.set(c, top);
    }

    return map;
  } catch {
    return empty;
  }
}
