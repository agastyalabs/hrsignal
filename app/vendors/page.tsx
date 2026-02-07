export const dynamic = "force-dynamic";

import Link from "next/link";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

export default async function VendorsPage() {
  let vendors: Array<{
    id: string;
    name: string;
    websiteUrl: string | null;
    toolsCount: number;
    categories: string[];
    tagline: string | null;
  }> = [];

  if (process.env.DATABASE_URL) {
    try {
      const rows = await prisma.vendor.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        include: {
          _count: { select: { tools: true } },
          categories: true,
          tools: { where: { status: "PUBLISHED" }, select: { tagline: true }, take: 1 },
        },
        take: 200,
      });
      vendors = rows.map((v) => ({
        id: v.id,
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
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            title="Vendors"
            subtitle="Browse companies behind the tools. Vendor pages show their published listings."
          />
          <Link className="text-sm font-medium text-indigo-700 hover:underline" href="/tools">
            Browse tools
          </Link>
        </div>

        {!process.env.DATABASE_URL ? (
          <Card className="mt-6 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">Connect the catalog database</div>
            <p className="mt-1 text-sm leading-6 text-zinc-600">
              Vendor directory requires a DB connection. Set <code>DATABASE_URL</code> and seed the catalog.
            </p>
          </Card>
        ) : null}

        {process.env.DATABASE_URL && vendors.length === 0 ? (
          <Card className="mt-6 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">No vendors yet</div>
            <p className="mt-1 text-sm leading-6 text-zinc-600">Seed the catalog from Admin → Seed catalog.</p>
            <Link className="mt-3 inline-block text-sm font-medium text-indigo-700 hover:underline" href="/admin">
              Go to Admin →
            </Link>
          </Card>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((v) => (
            <Link key={v.id} href={`/vendors/${v.id}`} className="block">
              <Card className="h-full shadow-sm transition-all hover:-translate-y-0.5 hover:shadow">
                <div className="text-base font-semibold text-zinc-900">{v.name}</div>
                {v.tagline ? <div className="mt-1 text-sm text-zinc-600">{v.tagline}</div> : null}
                <div className="mt-3 text-sm text-zinc-600">{v.toolsCount} tools</div>
                {v.categories.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {v.categories.slice(0, 2).map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-700"
                      >
                        {c}
                      </span>
                    ))}
                    {v.categories.length > 2 ? (
                      <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs text-zinc-500">
                        +{v.categories.length - 2}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                {v.websiteUrl ? (
                  <div className="mt-3 text-sm text-zinc-700">{v.websiteUrl.replace(/^https?:\/\//, "")}</div>
                ) : null}
                <div className="mt-4 text-sm font-medium text-indigo-700">View vendor →</div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
