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
import { normalizePricingText, pricingTypeFromNote, type PricingType } from "@/lib/pricing/format";
import { canonicalVendorSlug } from "@/lib/vendors/slug";
import { getVendorBrief } from "@/lib/vendors/brief";

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
    pricingType: PricingType;
    pricingText: string;
  }> = [];

  if (process.env.DATABASE_URL) {
    try {
      const rows = await prisma.vendor.findMany({
        where: {
          isActive: true,
          ...(indiaOnly ? { registeredCountry: "IN", verifiedInIndia: true } : {}),
        },
        orderBy: [{ verifiedInIndia: "desc" }, { name: "asc" }],
        include: {
          _count: { select: { tools: true } },
          categories: { select: { slug: true, name: true } },
          tools: {
            where: { status: "PUBLISHED" },
            select: {
              slug: true,
              tagline: true,
              deployment: true,
              lastVerifiedAt: true,
              pricingPlans: { select: { priceNote: true, setupFeeNote: true }, take: 2 },
            },
            take: 4,
          },
        },
        take: 200,
      });

      const vendorsWithBriefMeta = await Promise.all(
        rows.map(async (v) => {
          const slug = canonicalVendorSlug({ vendorName: v.name, toolSlugs: v.tools.map((t) => t.slug) });
          const brief = await getVendorBrief({ vendorName: v.name, urlSlug: slug, toolSlugs: v.tools.map((t) => t.slug) });
          return { v, slug, brief };
        })
      );

      vendors = vendorsWithBriefMeta.map(({ v, slug, brief }) => {
        const firstPlan = v.tools
          .flatMap((t) =>
            (t.pricingPlans ?? []).map((p) => ({
              deployment: t.deployment,
              priceNote: p.priceNote,
              setupFeeNote: p.setupFeeNote,
            }))
          )
          .find((p) => p.priceNote || p.setupFeeNote);

        const type = pricingTypeFromNote(firstPlan?.priceNote ?? null, firstPlan?.deployment ?? null);
        const text = firstPlan?.priceNote
          ? normalizePricingText(firstPlan.priceNote, type)
          : "Contact vendor / request quote";

        const newest = v.tools
          .map((t) => (t.lastVerifiedAt ? new Date(t.lastVerifiedAt).getTime() : 0))
          .reduce((a, b) => Math.max(a, b), 0);
        const freshnessLabel = newest ? `Updated: ${new Date(newest).toISOString().slice(0, 10)}` : null;

        return {
          id: v.id,
          slug,
          name: v.name,
          websiteUrl: v.websiteUrl ?? null,
          toolsCount: v._count.tools,
          categories: v.categories.map((c) => c.name),
          tagline: v.tools[0]?.tagline ?? null,
          pricingType: type,
          pricingText: text,
          verifiedInIndia: v.verifiedInIndia,
          freshnessLabel: brief.updatedAt ? `Updated: ${brief.updatedAt.toISOString().slice(0, 10)}` : freshnessLabel,
          sourcesCount: brief.urls.length ? brief.urls.length : null,
        };
      });
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
              <label className="text-xs font-medium text-[var(--text-muted)]" htmlFor="india-mode">
                India-first
              </label>
              <select
                id="india-mode"
                name="india"
                defaultValue={indiaOnly ? "1" : "0"}
                className="input mt-0"
                aria-label="India-first mode"
              >
                <option value="1">On</option>
                <option value="0">Off</option>
              </select>
              <button className="h-11 rounded-lg bg-[var(--primary)] px-3 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]">
                Apply
              </button>
            </form>
            <Link className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline" href="/tools">
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
