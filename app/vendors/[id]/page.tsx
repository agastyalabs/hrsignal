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
import { normalizePricingText, pricingTypeFromNote } from "@/lib/pricing/format";

export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) return notFound();

  const vendor = await prisma.vendor.findUnique({
    where: { id },
    include: {
      categories: true,
      tools: {
        where: { status: "PUBLISHED" },
        orderBy: { name: "asc" },
        include: {
          categories: { include: { category: true } },
          integrations: { include: { integration: true } },
          pricingPlans: true,
        },
      },
    },
  });

  if (!vendor) return notFound();

  const toolCategories = Array.from(
    new Set(vendor.tools.flatMap((t) => t.categories.map((c) => c.category.name)))
  );

  const integrationNames = Array.from(
    new Set(vendor.tools.flatMap((t) => t.integrations.map((i) => i.integration.name)))
  ).sort();

  const complianceTags = Array.from(new Set(vendor.tools.flatMap((t) => t.indiaComplianceTags ?? []))).sort();

  const sizeLabel = (band: string) => {
    if (band === "EMP_20_200") return "51–200";
    if (band === "EMP_50_500") return "201–500";
    if (band === "EMP_100_1000") return "501–1000";
    return band;
  };

  const bestForSizes = vendor.supportedSizeBands.length
    ? vendor.supportedSizeBands.map((b) => sizeLabel(b)).join(", ")
    : null;

  const bestForStates = vendor.supportedStates?.length ? vendor.supportedStates.join(", ") : null;

  const pricingNotes = vendor.tools
    .flatMap((t) =>
      t.pricingPlans.map((p) => {
        const type = pricingTypeFromNote(p.priceNote, t.deployment);
        return {
          tool: t.name,
          name: p.name,
          type,
          note: normalizePricingText(p.priceNote, type),
        };
      })
    )
    .filter((x) => x.note);

  const alternatives = await prisma.vendor.findMany({
    where: {
      id: { not: vendor.id },
      isActive: true,
      categories: vendor.categories.length ? { some: { id: { in: vendor.categories.map((c) => c.id) } } } : undefined,
    },
    orderBy: { verifiedInIndia: "desc" },
    take: 6,
    select: { id: true, name: true },
  });

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
            <div className="text-sm font-semibold text-[#F9FAFB]">Overview</div>
            <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="border border-[#1F2937] bg-[#0F172A] p-5 shadow-sm lg:col-span-2">
                <div className="text-sm leading-relaxed text-[#CBD5E1]">
                  {vendor.tools.length
                    ? `${vendor.name} publishes ${vendor.tools.length} HR software tool${vendor.tools.length === 1 ? "" : "s"} on HRSignal. This profile summarizes what they offer and who typically evaluates them.`
                    : `${vendor.name} is listed on HRSignal. We’re currently building out a fuller vendor brief and tool coverage.`}
                </div>
                <div className="mt-4 text-xs font-semibold text-[#94A3B8]">Categories</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(toolCategories.length ? toolCategories : vendor.categories.map((c) => c.name)).slice(0, 10).map((x) => (
                    <span key={x} className="rounded-full border border-[#1F2937] bg-[#111827] px-2.5 py-1 text-xs font-medium text-[#CBD5E1]">
                      {x}
                    </span>
                  ))}
                  {toolCategories.length === 0 && vendor.categories.length === 0 ? (
                    <span className="text-xs text-[#94A3B8]">Info pending</span>
                  ) : null}
                </div>
              </Card>

              <Card className="border border-[#1F2937] bg-[#0F172A] p-5 shadow-sm">
                <div className="text-sm font-semibold text-[#F9FAFB]">Best for</div>
                <dl className="mt-3 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold text-[#94A3B8]">Company size</dt>
                    <dd className="mt-1 text-[#CBD5E1]">{bestForSizes ?? "Info pending"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-[#94A3B8]">India coverage</dt>
                    <dd className="mt-1 text-[#CBD5E1]">
                      {vendor.verifiedInIndia ? "India-first listing" : "Info pending"}
                      {vendor.multiStateSupport ? " • Multi-state" : ""}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-[#94A3B8]">States</dt>
                    <dd className="mt-1 text-[#CBD5E1]">{bestForStates ?? "Info pending"}</dd>
                  </div>
                </dl>
              </Card>
            </div>
          </div>

          <div className="mt-10">
            <div className="text-sm font-semibold text-[#F9FAFB]">Key features</div>
            <Card className="mt-3 border border-[#1F2937] bg-[#0F172A] p-5 shadow-sm">
              <ul className="grid grid-cols-1 gap-2 text-sm text-[#CBD5E1] sm:grid-cols-2">
                {(vendor.tools.length
                  ? [
                      "HR workflows aligned to Indian SME ops",
                      "Configurable policies (leave, attendance, payroll cycles)",
                      integrationNames.length ? "Common integrations available" : "Integrations: info pending",
                      complianceTags.length ? "India compliance tags supported" : "Compliance notes: info pending",
                    ]
                  : ["Info pending", "Info pending", "Info pending", "Info pending"]) .map((x, idx) => (
                  <li key={`${x}-${idx}`}>• {x}</li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-[#F9FAFB]">Pros</div>
              <Card className="mt-3 border border-[#1F2937] bg-[#0F172A] p-5 shadow-sm">
                <ul className="space-y-2 text-sm text-[#CBD5E1]">
                  <li>• Clear module coverage via published tools</li>
                  <li>• India-first evaluation signals (where available)</li>
                  <li>• Works well when your requirements match listed categories</li>
                </ul>
              </Card>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#F9FAFB]">Cons</div>
              <Card className="mt-3 border border-[#1F2937] bg-[#0F172A] p-5 shadow-sm">
                <ul className="space-y-2 text-sm text-[#CBD5E1]">
                  <li>• Pricing and implementation detail may be vendor-specific</li>
                  <li>• Some coverage fields may be marked “Info pending”</li>
                  <li>• You may need a demo to confirm edge-case compliance</li>
                </ul>
              </Card>
            </div>
          </div>

          <div className="mt-10">
            <div className="text-sm font-semibold text-[#F9FAFB]">Pricing</div>
            <Card className="mt-3 border border-[#1F2937] bg-[#0F172A] p-5 shadow-sm">
              {pricingNotes.length ? (
                <ul className="space-y-2 text-sm text-[#CBD5E1]">
                  {pricingNotes.slice(0, 6).map((p) => (
                    <li key={`${p.tool}-${p.name}`} className="flex flex-wrap items-center gap-2">
                      <span>• {p.tool} — {p.name}:</span>
                      <span className="rounded-full border border-[#1F2937] bg-[#111827] px-2 py-0.5 text-xs font-semibold text-[#CBD5E1]">{p.type}</span>
                      <span>{p.note}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-[#CBD5E1]">Info pending. Use “Request demo/pricing” from a tool page to get a quote that fits your headcount and modules.</div>
              )}
            </Card>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-[#F9FAFB]">Integrations</div>
              <Card className="mt-3 border border-[#1F2937] bg-[#0F172A] p-5 shadow-sm">
                {integrationNames.length ? (
                  <div className="flex flex-wrap gap-2">
                    {integrationNames.slice(0, 14).map((n) => (
                      <span key={n} className="rounded-full border border-[#1F2937] bg-[#111827] px-2.5 py-1 text-xs font-medium text-[#CBD5E1]">
                        {n}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-[#CBD5E1]">Info pending.</div>
                )}
              </Card>
            </div>

            <div>
              <div className="text-sm font-semibold text-[#F9FAFB]">Implementation / onboarding</div>
              <Card className="mt-3 border border-[#1F2937] bg-[#0F172A] p-5 shadow-sm">
                <div className="text-sm leading-relaxed text-[#CBD5E1]">
                  Info pending. For India-first rollouts, confirm data migration (masters), policy setup (leave/attendance/payroll), and month-end timelines during the demo.
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-[#F9FAFB]">Support & compliance notes</div>
              <Card className="mt-3 border border-[#1F2937] bg-[#0F172A] p-5 shadow-sm">
                {complianceTags.length ? (
                  <div>
                    <div className="text-sm text-[#CBD5E1]">Compliance tags seen on published tools:</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {complianceTags.map((t) => (
                        <span key={t} className="rounded-full border border-[#1F2937] bg-[#111827] px-2.5 py-1 text-xs font-medium text-[#CBD5E1]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-[#CBD5E1]">Info pending. Always validate PF/ESI/PT/TDS scope and state coverage during evaluation.</div>
                )}
              </Card>
            </div>

            <div>
              <div className="text-sm font-semibold text-[#F9FAFB]">Alternatives</div>
              <Card className="mt-3 border border-[#1F2937] bg-[#0F172A] p-5 shadow-sm">
                {alternatives.length ? (
                  <ul className="space-y-2 text-sm text-[#CBD5E1]">
                    {alternatives.slice(0, 6).map((a) => (
                      <li key={a.id}>
                        • <Link className="text-[#8B5CF6] hover:text-[#7C3AED]" href={`/vendors/${a.id}`}>{a.name}</Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-[#CBD5E1]">Info pending.</div>
                )}
                <div className="mt-4 text-sm">
                  <Link className="font-medium text-[#8B5CF6] hover:text-[#7C3AED]" href="/tools">
                    Browse tools →
                  </Link>
                </div>
              </Card>
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
