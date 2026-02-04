export const dynamic = "force-dynamic";

import Link from "next/link";

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) return notFound();

  const vendor = await prisma.vendor.findUnique({
    where: { id },
    include: {
      tools: {
        where: { status: "PUBLISHED" },
        orderBy: { name: "asc" },
        include: { categories: { include: { category: true } } },
      },
    },
  });

  if (!vendor) return notFound();

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link className="text-sm font-medium text-indigo-700" href="/vendors">
          Back to vendors
        </Link>

        <div className="mt-4 rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold">{vendor.name}</h1>
          {vendor.websiteUrl ? (
            <p className="mt-1 text-sm text-zinc-600">
              <a className="underline" href={vendor.websiteUrl} target="_blank" rel="noreferrer">
                {vendor.websiteUrl}
              </a>
            </p>
          ) : null}

          <div className="mt-8">
            <h2 className="text-lg font-semibold">Tools</h2>
            {vendor.tools.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-600">No published tools for this vendor yet.</p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {vendor.tools.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tools/${t.slug}`}
                    className="rounded-xl border border-zinc-200 bg-white p-4 hover:shadow"
                  >
                    <div className="text-lg font-semibold">{t.name}</div>
                    {t.tagline ? <div className="mt-1 text-sm text-zinc-600">{t.tagline}</div> : null}
                    <div className="mt-3 text-sm text-zinc-700">
                      {t.categories.map((c) => c.category.name).join(" • ")}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
