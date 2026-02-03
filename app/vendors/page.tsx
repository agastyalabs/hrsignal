export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default async function VendorsPage() {
  let vendors: Array<{ id: string; name: string; websiteUrl: string | null; toolsCount: number }> = [];

  if (process.env.DATABASE_URL) {
    try {
      const rows = await prisma.vendor.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        include: { _count: { select: { tools: true } } },
        take: 200,
      });
      vendors = rows.map((v) => ({
        id: v.id,
        name: v.name,
        websiteUrl: v.websiteUrl ?? null,
        toolsCount: v._count.tools,
      }));
    } catch {
      vendors = [];
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold">Vendors</h1>
          <a className="text-sm underline" href="/tools">
            Browse tools
          </a>
        </div>

        {!process.env.DATABASE_URL ? (
          <div className="mt-6 rounded-xl bg-white p-6 shadow">
            <p className="text-zinc-700">Vendor directory requires DB connection.</p>
            <p className="mt-2 text-sm text-zinc-600">Set <code>DATABASE_URL</code> and seed catalog.</p>
          </div>
        ) : null}

        {process.env.DATABASE_URL && vendors.length === 0 ? (
          <div className="mt-6 rounded-xl bg-white p-6 shadow">
            <p className="text-zinc-700">No vendors yet.</p>
            <p className="mt-2 text-sm text-zinc-600">Seed the catalog from Admin → Seed catalog.</p>
            <a className="mt-3 inline-block text-sm font-medium underline" href="/admin">
              Go to Admin →
            </a>
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((v) => (
            <a key={v.id} href={`/vendors/${v.id}`} className="rounded-xl bg-white p-4 shadow hover:shadow-md">
              <div className="text-lg font-semibold">{v.name}</div>
              <div className="mt-1 text-sm text-zinc-600">{v.toolsCount} tools</div>
              {v.websiteUrl ? (
                <div className="mt-3 text-sm text-zinc-700">{v.websiteUrl.replace(/^https?:\/\//, "")}</div>
              ) : null}
            </a>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
