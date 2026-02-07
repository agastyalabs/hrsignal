export const dynamic = "force-dynamic";

import Link from "next/link";

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";

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

      <Section className="pt-10 sm:pt-14">
        <div className="mb-6">
          <Link className="text-sm font-medium text-indigo-700 hover:underline" href="/vendors">
            ← Back to vendors
          </Link>
        </div>

        <Card className="shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{vendor.name}</h1>
              {vendor.websiteUrl ? (
                <p className="mt-2 text-sm text-zinc-600">
                  <a className="underline" href={vendor.websiteUrl} target="_blank" rel="noreferrer">
                    {vendor.websiteUrl.replace(/^https?:\/\//, "")}
                  </a>
                </p>
              ) : null}
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              Published tools: <span className="font-semibold text-zinc-900">{vendor.tools.length}</span>
            </div>
          </div>

          <div className="mt-10">
            <div className="text-sm font-semibold text-zinc-900">Tools</div>
            {vendor.tools.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-600">No published tools for this vendor yet.</p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {vendor.tools.map((t) => (
                  <Link key={t.id} href={`/tools/${t.slug}`} className="block">
                    <Card className="h-full shadow-sm transition-all hover:-translate-y-0.5 hover:shadow">
                      <div className="text-base font-semibold text-zinc-900">{t.name}</div>
                      {t.tagline ? <div className="mt-1 text-sm text-zinc-600">{t.tagline}</div> : null}
                      <div className="mt-3 text-sm text-zinc-700">
                        {t.categories.map((c) => c.category.name).join(" • ")}
                      </div>
                      <div className="mt-4 text-sm font-medium text-indigo-700">View tool →</div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Card>
      </Section>

      <SiteFooter />
    </div>
  );
}
