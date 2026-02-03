export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";

export default async function ToolsPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold">Browse tools</h1>
          <p className="mt-2 text-zinc-600">
            Catalog is not connected yet (missing <code>DATABASE_URL</code>). Once set, this page will show the marketplace listings.
          </p>
          <p className="mt-4 text-sm text-zinc-600">
            Next step: provision Postgres (Vercel Postgres/Neon/Supabase) and set <code>DATABASE_URL</code> in <code>.env.local</code> and Vercel.
          </p>
        </div>
      </div>
    );
  }

  const tools = await prisma.tool.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { name: "asc" },
    include: { vendor: true, categories: { include: { category: true } } },
    take: 200,
  });

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold">Browse tools</h1>
          <a className="text-sm underline" href="/stack-builder">
            Build my HR stack
          </a>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tools.map((t) => (
            <a key={t.id} href={`/tools/${t.slug}`} className="rounded-xl bg-white p-4 shadow hover:shadow-md">
              <div className="text-lg font-semibold">{t.name}</div>
              <div className="mt-1 text-sm text-zinc-600">{t.vendor?.name ?? ""}</div>
              <div className="mt-3 text-sm text-zinc-700">
                {t.categories.map((c) => c.category.name).join(" • ")}
              </div>
              {t.tagline ? <div className="mt-3 text-sm text-zinc-600">{t.tagline}</div> : null}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
