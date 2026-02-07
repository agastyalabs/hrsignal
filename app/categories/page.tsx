export const dynamic = "force-dynamic";

import Link from "next/link";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { CategoryCard } from "@/components/catalog/CategoryCard";

const FALLBACK = [
  { slug: "hrms", name: "Core HRMS", desc: "Employee lifecycle, org, docs, workflows" },
  { slug: "payroll", name: "Payroll & Compliance", desc: "PF/ESI/PT/TDS workflows and filings" },
  { slug: "attendance", name: "Attendance / Leave / Time", desc: "Shifts, biometric, field staff" },
  { slug: "ats", name: "ATS / Hiring", desc: "Pipeline, interviews, offers" },
  { slug: "performance", name: "Performance / OKR", desc: "Reviews, goals, feedback" },
  { slug: "bgv", name: "Background Verification (BGV)", desc: "Employee checks and screening" },
  { slug: "lms", name: "LMS / L&D", desc: "Training, compliance learning, onboarding" },
] as const;

export default async function CategoriesPage() {
  const categories = await getCategories();
  const topToolsByCategory = await getTopToolsByCategorySafe(categories.map((c) => c.slug));

  return (
    <div className="min-h-screen bg-[#0B0E23]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            title="Categories"
            subtitle="Start with the module you need. Each category opens a directory view you can filter and compare."
          />
          <Link className="text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED]" href="/tools">
            Browse all tools
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard
              key={c.slug}
              slug={c.slug as any}
              name={c.name}
              description={c.desc ?? ""}
              toolCount={(topToolsByCategory.get(c.slug) ?? []).length || undefined}
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

              return (
                <div
                  key={c.slug}
                  className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#121634] p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-[#F5F7FF]">{c.name}</div>
                      {c.desc ? <div className="mt-1 text-sm text-[#B6B9D8]">{c.desc}</div> : null}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link className="text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED]" href={`/tools?category=${c.slug}`}>
                        Browse →
                      </Link>
                      {compareSlugs.length >= 2 ? (
                        <Link
                          className="inline-flex h-9 items-center rounded-lg bg-[#7441F2] px-3 text-sm font-medium text-[#F5F7FF] hover:bg-[#825AE0]"
                          href={`/compare?tools=${encodeURIComponent(compareSlugs.join(","))}`}
                        >
                          Compare top tools
                        </Link>
                      ) : null}
                    </div>
                  </div>

                  {tools.length ? (
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {tools.map((t) => (
                        <Link key={t.slug} href={`/tools/${t.slug}`} className="block">
                          <Card className="h-full border border-[rgba(255,255,255,0.08)] bg-[#171C3F] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.14)] hover:shadow-md">
                            <div className="text-base font-semibold text-[#F5F7FF]">{t.name}</div>
                            {t.vendorName ? <div className="mt-1 text-sm text-[#B6B9D8]">by {t.vendorName}</div> : null}
                            {t.tagline ? <div className="mt-2 text-sm leading-relaxed text-[#B6B9D8]">{t.tagline}</div> : null}
                            <div className="mt-4 text-sm font-medium text-[#8B5CF6]">View details →</div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 text-sm text-[#B6B9D8]">No published tools yet for this category.</div>
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
