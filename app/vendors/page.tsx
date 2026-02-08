export const dynamic = "force-dynamic";

import Link from "next/link";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { VendorCard } from "@/components/catalog/VendorCard";

import { indiaOnlyFromSearchParams } from "@/lib/india/mode";

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ india?: string }>;
}) {
  const sp = await searchParams;
  const indiaOnly = indiaOnlyFromSearchParams(sp);

  let vendors: Array<{
    id: string;
    slug: string;
    name: string;
    websiteUrl: string | null;
    toolsCount: number;
    categories: string[];
    tagline: string | null;
  }> = [];

  if (process.env.DATABASE_URL) {
    try {
      const rows = await prisma.vendor.findMany({
        where: {
          isActive: true,
          ...(indiaOnly ? { registeredCountry: "IN", verifiedInIndia: true } : {}),
        },
        orderBy: { name: "asc" },
        include: {
          _count: { select: { tools: true } },
          categories: true,
          tools: { where: { status: "PUBLISHED" }, select: { tagline: true }, take: 1 },
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

      vendors = rows.map((v) => ({
        id: v.id,
        slug: slugify(v.name),
        name: v.name,
        websiteUrl: v.websiteUrl ?? null,
        toolsCount: v._count.tools,
        categories: v.categories.map((c) => c.name),
        tagline: v.tools[0]?.tagline ?? null,
      }));
    } catch {
      vendors = [];
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            title="Vendors"
            subtitle="Browse companies behind the tools. Vendor pages show their published listings."
          />
          <div className="flex flex-wrap items-center gap-3">
            <form method="get" action="/vendors" className="flex items-center gap-2">
              <label className="text-xs font-medium text-[#CBD5E1]" htmlFor="india-mode">
                India-first
              </label>
              <select
                id="india-mode"
                name="india"
                defaultValue={indiaOnly ? "1" : "0"}
                className="h-11 rounded-lg border border-[#1F2937] bg-[#111827] px-3 text-sm text-[#F9FAFB]"
                aria-label="India-first mode"
              >
                <option value="1">On</option>
                <option value="0">Off</option>
              </select>
              <button className="h-11 rounded-lg bg-[#8B5CF6] px-3 text-sm font-medium text-[#0B1220] hover:bg-[#7C3AED]">
                Apply
              </button>
            </form>
            <Link className="text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED] hover:underline" href="/tools">
              Browse tools
            </Link>
          </div>
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
          <Card className="mt-6 shadow-sm">
            <div className="text-sm font-semibold text-[#F9FAFB]">No vendors yet</div>
            <p className="mt-1 text-sm leading-relaxed text-[#CBD5E1]">Seed the catalog from Admin → Seed catalog.</p>
            <Link className="mt-3 inline-block text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED] hover:underline" href="/admin">
              Go to Admin →
            </Link>
          </Card>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((v) => (
            <VendorCard key={v.id} vendor={v} />
          ))}
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
