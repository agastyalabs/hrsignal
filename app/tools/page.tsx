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

import { clampCsv, indiaOnlyFromSearchParams } from "@/lib/india/mode";

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

  const sizeBands = clampCsv(sp.size, 5);
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
          ...(sizeBands.length
            ? {
                OR: [
                  { bestForSizeBands: { hasSome: sizeBands as never } },
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
    <div className="min-h-screen bg-gray-50">
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
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">Search & filters</div>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                India-first mode is ON by default. Turn it off to browse all listings.
              </p>

              <form className="mt-4 space-y-4" method="get" action="/tools">
                <div>
                  <label className="text-xs font-medium text-gray-600">India-first mode</label>
                  <select className="input mt-1" name="india" defaultValue={indiaOnly ? "1" : "0"} aria-label="India-first mode">
                    <option value="1">On (India-verified vendors only)</option>
                    <option value="0">Off (show all vendors)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Search</label>
                  <input
                    className="input mt-1"
                    name="q"
                    defaultValue={q}
                    placeholder="e.g., Keka, payroll, attendance"
                    aria-label="Search tools"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Company size</label>
                  <select className="input mt-1" name="size" defaultValue={sizeBands.join(",")} aria-label="Company size">
                    <option value="">Any</option>
                    <option value="EMP_20_200">20–200 employees</option>
                    <option value="EMP_50_500">50–500 employees</option>
                    <option value="EMP_100_1000">100–1000 employees</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Deployment</label>
                  <select className="input mt-1" name="deployment" defaultValue={deployment} aria-label="Deployment">
                    <option value="">Any</option>
                    <option value="CLOUD">Cloud</option>
                    <option value="ONPREM">On-prem</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Modules</label>
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
                  <div className="mt-1 text-xs text-gray-500">Tip: choose the primary module in v1.</div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">India compliance</label>
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
                  <label className="text-xs font-medium text-gray-600">Region fit</label>
                  <select className="input mt-1" name="region" defaultValue={region} aria-label="Region fit">
                    <option value="">Any</option>
                    <option value="multi">Multi-state support</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Category</label>
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
                  <label className="text-xs font-medium text-gray-600">Sort</label>
                  <select className="input mt-1" name="sort" defaultValue={sort} aria-label="Sort">
                    <option value="name">Name</option>
                    <option value="recent">Recently verified</option>
                  </select>
                </div>

                <button className="h-10 w-full rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700">
                  Apply
                </button>

                <Link
                  className="block text-center text-sm font-medium text-gray-600 hover:text-gray-900"
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
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium text-gray-900">{tools.length}</span> tools
              </div>
              <Link className="text-sm font-medium text-indigo-700 hover:text-indigo-800 hover:underline" href="/recommend">
                Prefer a guided shortlist? →
              </Link>
            </div>

            {mode === "fallback" ? (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-gray-900">Showing sample tools</div>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  The database/catalog is not connected. Connect DB + run migrations/seed to see the real marketplace catalog.
                </p>
              </div>
            ) : null}

            {mode === "empty" ? (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-gray-900">No tools match yet</div>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  Try removing filters, or seed/publish more tools from Admin.
                </p>
                <Link className="mt-3 inline-block text-sm font-medium text-indigo-700 hover:text-indigo-800" href="/admin">
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

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
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
