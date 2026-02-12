export const dynamic = "force-dynamic";

import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LeadSection } from "./LeadSection";
import { CompareToggle } from "@/components/compare/CompareToggle";
import { VendorLogo } from "@/components/VendorLogo";
import { domainFromUrl } from "@/lib/brand/logo";
import { normalizePricingText, pricingTypeFromNote } from "@/lib/pricing/format";
import type { Metadata } from "next";
import { absUrl } from "@/lib/seo/url";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = `${slug} — Tool details | HRSignal`;
  const description = `Research and compare ${slug}. See fit notes, trust signals, and request demos without vendor spam.`;
  const url = absUrl(`/tools/${slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Fallback for local/demo when DB is not connected
  if (!process.env.DATABASE_URL) {
    const fallback = {
      greythr: {
        name: "greytHR",
        tagline: "HRMS + payroll for Indian SMEs",
        vendor: "greytHR",
        categories: ["HRMS", "Payroll"],
      },
      keka: {
        name: "Keka",
        tagline: "Modern HRMS with payroll",
        vendor: "Keka",
        categories: ["HRMS", "Payroll", "Performance"],
      },
      "zoho-people": {
        name: "Zoho People",
        tagline: "HRMS with attendance/leave",
        vendor: "Zoho",
        categories: ["HRMS", "Attendance"],
      },
      freshteam: {
        name: "Freshteam",
        tagline: "ATS + onboarding for SMEs",
        vendor: "Freshworks",
        categories: ["ATS"],
      },
    } as const;

    const f = fallback[slug as keyof typeof fallback];
    if (!f) return notFound();

    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <SiteHeader />
        <main className="mx-auto max-w-4xl px-6 py-10">
          <Link className="text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED]" href="/tools">
            Back to tools
          </Link>
          <div className="mt-4 rounded-xl bg-[#111827] p-6 shadow-sm border border-[#1F2937]">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F172A] ring-1 ring-[#1F2937]">
                <VendorLogo slug={slug} name={f.name} domain={null} className="h-9 w-9 rounded-md" size={36} />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold text-[#F9FAFB]">{f.name}</h1>
                <p className="mt-1 text-sm text-[#CBD5E1]">by {f.vendor}</p>
              </div>
            </div>
            <p className="mt-4 text-[#CBD5E1]">{f.tagline}</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Info title="Categories" value={f.categories.join(", ")} />
              <Info title="Integrations" value="—" />
            </div>
            <div className="mt-8 rounded-xl border border-[#1F2937] bg-[#0F172A] p-4 text-sm text-[#CBD5E1]">
This page is available in read-only mode until the catalog database is connected.
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const tool = await prisma.tool.findUnique({
    where: { slug },
    include: {
      vendor: true,
      categories: { include: { category: true } },
      integrations: { include: { integration: true } },
      pricingPlans: true,
    },
  });

  if (!tool || tool.status !== "PUBLISHED") return notFound();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link className="text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED]" href="/tools">
          Back to tools
        </Link>

        <div className="mt-4 rounded-xl border border-[#1F2937] bg-[#111827] p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F172A] ring-1 ring-[#1F2937]">
              <VendorLogo
                slug={tool.vendor?.id ?? tool.slug}
                name={tool.vendor?.name ?? tool.name}
                domain={domainFromUrl(tool.vendor?.websiteUrl)}
                className="h-9 w-9 rounded-md"
                size={36}
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-[#F9FAFB]">{tool.name}</h1>
              {tool.vendor?.name ? <p className="mt-1 text-sm text-[#CBD5E1]">by {tool.vendor.name}</p> : null}
            </div>
          </div>
          {tool.tagline ? <p className="mt-4 text-[#CBD5E1]">{tool.tagline}</p> : null}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Info title="Categories" value={tool.categories.map((c) => c.category.name).join(", ") || "—"} />
            <Info
              title="Best for"
              value={
                tool.bestForSizeBands.length
                  ? tool.bestForSizeBands
                      .map((b) =>
                        b === "EMP_20_200"
                          ? "51–200 employees"
                          : b === "EMP_50_500"
                            ? "201–500 employees"
                            : b === "EMP_100_1000"
                              ? "501–1000 employees"
                              : String(b)
                      )
                      .join(", ")
                  : "SMEs"
              }
            />
            <Info title="Implementation" value={tool.categories.length >= 3 ? "2–6 weeks" : "1–3 weeks"} />
            <Info
              title="Integrations"
              value={tool.integrations.map((i) => i.integration.name).join(", ") || "—"}
            />
          </div>

          <div className="mt-6 rounded-xl border border-[#1F2937] bg-[#0F172A] p-4">
            <div className="text-sm font-semibold text-[#F9FAFB]">Key features</div>
            <ul className="mt-2 grid grid-cols-1 gap-2 text-sm text-[#CBD5E1] sm:grid-cols-2">
              <li>• Export-ready reports and audit trail</li>
              <li>• Configurable workflows and approvals</li>
              <li>• India compliance tags where applicable</li>
              <li>• Clean employee + manager self-serve</li>
            </ul>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[#F9FAFB]">Pricing</h2>
            {tool.pricingPlans.length ? (
              <ul className="mt-2 space-y-2 text-sm">
                {tool.pricingPlans.map((p) => {
                  const type = pricingTypeFromNote(p.priceNote, tool.deployment);
                  const text = normalizePricingText(p.priceNote, type);
                  return (
                    <li key={p.id} className="rounded-lg border border-[#1F2937] bg-[#0F172A] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-medium text-[#F9FAFB]">{p.name}</div>
                        <span className="shrink-0 rounded-full border border-[#1F2937] bg-[#111827] px-2 py-0.5 text-xs font-semibold text-[#CBD5E1]">
                          {type}
                        </span>
                      </div>
                      <div className="mt-1 text-[#CBD5E1]">{text}</div>
                      {p.setupFeeNote ? <div className="mt-1 text-[#94A3B8]">Setup: {p.setupFeeNote}</div> : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-2 rounded-lg border border-[#1F2937] bg-[#0F172A] p-3 text-sm text-[#CBD5E1]">
                <span className="mr-2 inline-flex rounded-full border border-[#1F2937] bg-[#111827] px-2 py-0.5 text-xs font-semibold text-[#CBD5E1]">
                  Quote-based
                </span>
                Contact vendor / request quote.
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              className="rounded-lg bg-[#8B5CF6] px-4 py-2 text-sm font-medium text-[#0B1220] hover:bg-[#7C3AED]"
              href={`/recommend?prefill=${encodeURIComponent(tool.slug)}`}
            >
              See if this fits my team
            </Link>
            <TrackedLink
              event="click_request_demo"
              eventData={{ from: "tool_detail", tool: tool.slug }}
              className="rounded-lg border border-[#1F2937] bg-transparent px-4 py-2 text-sm font-medium text-[#F9FAFB] hover:bg-[#0F172A]"
              href={`/tools/${tool.slug}#lead`}
            >
              Request Demo via HRSignal
            </TrackedLink>
            <CompareToggle slug={tool.slug} />
          </div>

          <LeadSection>
            <div className="mt-10 rounded-xl border border-[#1F2937] bg-[#0F172A] p-4">
            <p className="text-sm text-[#CBD5E1]">
              Want an intro or pricing help? Use the Stack Builder—HRSignal will route you to the best-fit vendor.
            </p>
            <Link className="mt-3 inline-block text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED]" href="/recommend">
              Open recommendations →
            </Link>
            </div>
          </LeadSection>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="text-sm font-medium text-[#CBD5E1]">{title}</div>
      <div className="mt-1 text-sm text-[#94A3B8]">{value}</div>
    </div>
  );
}
