export const dynamic = "force-dynamic";

import Link from "next/link";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

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
  const topToolsByCategory = await getTopToolsByCategory(categories.map((c) => c.slug));

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            title="Categories"
            subtitle="Start with the module you need. Each category opens a directory view you can filter and compare."
          />
          <Link className="text-sm font-medium text-indigo-700 hover:underline" href="/tools">
            Browse all tools
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.slug} href={`/tools?category=${encodeURIComponent(c.slug)}`} className="block">
              <Card className="h-full shadow-sm transition-all hover:-translate-y-0.5 hover:shadow">
                <div className="text-base font-semibold text-zinc-900">{c.name}</div>
                {c.desc ? <div className="mt-2 text-sm leading-6 text-zinc-600">{c.desc}</div> : null}
                <div className="mt-4 text-sm font-medium text-indigo-700">Explore →</div>
              </Card>
            </Link>
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
                <div key={c.slug} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-zinc-900">{c.name}</div>
                      {c.desc ? <div className="mt-1 text-sm text-zinc-600">{c.desc}</div> : null}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link className="text-sm font-medium text-indigo-700 hover:underline" href={`/tools?category=${c.slug}`}>
                        Browse →
                      </Link>
                      {compareSlugs.length >= 2 ? (
                        <Link
                          className="inline-flex h-9 items-center rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white hover:bg-indigo-700"
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
                          <Card className="h-full shadow-sm transition-all hover:-translate-y-0.5 hover:shadow">
                            <div className="text-base font-semibold text-zinc-900">{t.name}</div>
                            {t.vendorName ? <div className="mt-1 text-sm text-zinc-600">by {t.vendorName}</div> : null}
                            {t.tagline ? <div className="mt-2 text-sm leading-6 text-zinc-700">{t.tagline}</div> : null}
                            <div className="mt-4 text-sm font-medium text-indigo-700">View details →</div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 text-sm text-zinc-600">No published tools yet for this category.</div>
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

async function getTopToolsByCategory(categorySlugs: string[]) {
  const map = new Map<string, Array<{ slug: string; name: string; tagline: string | null; vendorName: string | null }>>();
  if (!process.env.DATABASE_URL) {
    for (const c of categorySlugs) map.set(c, []);
    return map;
  }

  // Simple approach: for each category, fetch a few recent tools.
  await Promise.all(
    categorySlugs.map(async (slug) => {
      const rows = await prisma.tool.findMany({
        where: {
          status: "PUBLISHED",
          categories: { some: { category: { slug } } },
        },
        include: { vendor: true },
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
}
