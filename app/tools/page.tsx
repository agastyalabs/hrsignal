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

const FALLBACK_TOOLS: ToolCardModel[] = [
  {
    slug: "greythr",
    name: "greytHR",
    vendorName: "greytHR",
    categories: ["HRMS", "Payroll"],
    tagline: "HRMS + payroll for Indian SMEs",
  },
  {
    slug: "keka",
    name: "Keka",
    vendorName: "Keka",
    categories: ["HRMS", "Payroll", "Performance"],
    tagline: "Modern HRMS with payroll",
  },
  {
    slug: "zoho-people",
    name: "Zoho People",
    vendorName: "Zoho",
    categories: ["HRMS", "Attendance"],
    tagline: "HRMS with attendance/leave",
  },
  {
    slug: "freshteam",
    name: "Freshteam",
    vendorName: "Freshworks",
    categories: ["ATS"],
    tagline: "ATS + onboarding for SMEs",
  },
];

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.category?.trim();
  const q = sp.q?.trim();
  const sort = sp.sort?.trim() === "recent" ? "recent" : "name";

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
        },
        orderBy: sort === "recent" ? { lastVerifiedAt: "desc" } : { name: "asc" },
        include: { vendor: true, categories: { include: { category: true } } },
        take: 200,
      });

      tools = rows.map((t) => ({
        slug: t.slug,
        name: t.name,
        vendorName: t.vendor?.name ?? undefined,
        categories: t.categories.map((c) => c.category.name),
        tagline: t.tagline ?? undefined,
        verified: Boolean(t.lastVerifiedAt),
      }));
      if (!tools.length) mode = "empty";
    } catch {
      mode = "fallback";
      tools = FALLBACK_TOOLS;
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
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
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="text-sm font-semibold text-zinc-900">Search & filters</div>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Keep it simple in v1: search + category + sort. More filters coming soon.
              </p>

              <form className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-zinc-600">Search</label>
                  <input
                    className="input mt-1"
                    name="q"
                    defaultValue={q}
                    placeholder="e.g., Keka, payroll, attendance"
                    aria-label="Search tools"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-600">Category</label>
                  <select className="input mt-1" name="category" defaultValue={category ?? ""} aria-label="Category">
                    <option value="">All categories</option>
                    <option value="hrms">HRMS</option>
                    <option value="payroll">Payroll + Compliance</option>
                    <option value="attendance">Attendance/Leave</option>
                    <option value="ats">ATS/Hiring</option>
                    <option value="performance">Performance/OKR</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-600">Sort</label>
                  <select className="input mt-1" name="sort" defaultValue={sort} aria-label="Sort">
                    <option value="name">Name</option>
                    <option value="recent">Recently verified</option>
                  </select>
                </div>

                <button className="h-10 w-full rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700">
                  Apply
                </button>

                <div className="pt-1">
                  <div className="text-xs font-medium text-zinc-500">Coming soon</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-700">
                      Company size
                    </span>
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-700">
                      Integrations
                    </span>
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-700">
                      Deployment
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0 lg:col-span-8">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-zinc-600">
                Showing <span className="font-medium text-zinc-900">{tools.length}</span> tools
              </div>
              <Link className="text-sm font-medium text-indigo-700 hover:underline" href="/recommend">
                Prefer a guided shortlist? →
              </Link>
            </div>

            {mode === "fallback" ? (
              <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
                <div className="text-sm font-semibold text-zinc-900">Showing sample tools</div>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  The database/catalog is not connected. Connect DB + run migrations/seed to see the real marketplace catalog.
                </p>
              </div>
            ) : null}

            {mode === "empty" ? (
              <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
                <div className="text-sm font-semibold text-zinc-900">No tools match yet</div>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  Try removing filters, or seed/publish more tools from Admin.
                </p>
                <Link className="mt-3 inline-block text-sm font-medium text-indigo-700" href="/admin">
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

        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6">
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
