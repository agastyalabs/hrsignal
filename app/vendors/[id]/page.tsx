export const dynamic = "force-dynamic";

import Link from "next/link";

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { VendorLogo } from "@/components/VendorLogo";
import { domainFromUrl } from "@/lib/brand/logo";

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
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <div className="mb-6">
          <Link className="text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED]" href="/vendors">
            ← Back to vendors
          </Link>
        </div>

        <Card className="border border-[#1F2937] bg-[#111827] shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0F172A] ring-1 ring-[#1F2937]">
                <VendorLogo
                  slug={vendor.id}
                  name={vendor.name}
                  domain={domainFromUrl(vendor.websiteUrl)}
                  className="h-11 w-11 rounded-lg"
                  size={44}
                />
              </div>

              <div className="min-w-0">
                <h1 className="text-3xl font-semibold tracking-tight text-[#F9FAFB]">{vendor.name}</h1>
                {vendor.websiteUrl ? (
                  <p className="mt-2 text-sm text-[#CBD5E1]">
                    <a className="underline" href={vendor.websiteUrl} target="_blank" rel="noreferrer">
                      {vendor.websiteUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-[#1F2937] bg-[#0F172A] px-4 py-3 text-sm text-[#CBD5E1]">
              Published tools: <span className="font-semibold text-[#F9FAFB]">{vendor.tools.length}</span>
            </div>
          </div>

          <div className="mt-10">
            <div className="text-sm font-semibold text-[#F9FAFB]">Tools</div>
            {vendor.tools.length === 0 ? (
              <p className="mt-2 text-sm text-[#CBD5E1]">No published tools for this vendor yet.</p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {vendor.tools.map((t) => (
                  <Link key={t.id} href={`/tools/${t.slug}`} className="block">
                    <Card className="h-full border border-[#1F2937] bg-[#0F172A] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#334155] hover:shadow-md">
                      <div className="text-base font-semibold text-[#F9FAFB]">{t.name}</div>
                      {t.tagline ? <div className="mt-1 text-sm text-[#CBD5E1]">{t.tagline}</div> : null}
                      <div className="mt-3 text-sm text-[#94A3B8]">
                        {t.categories.map((c) => c.category.name).join(" • ")}
                      </div>
                      <div className="mt-4 text-sm font-medium text-[#8B5CF6]">View tool →</div>
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
