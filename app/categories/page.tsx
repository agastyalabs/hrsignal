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
