export const dynamic = "force-dynamic";

import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { VendorLogoStrip } from "@/components/marketing/VendorLogoStrip";
import { TestimonialStrip } from "@/components/marketing/TestimonialStrip";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { ToolCard, type ToolCardModel } from "@/components/catalog/ToolCard";
import { prisma } from "@/lib/db";

const CATEGORIES = [
  {
    slug: "hrms",
    name: "Core HRMS",
    description: "Employee lifecycle, org, docs, workflows",
    indiaReady: false,
  },
  {
    slug: "payroll",
    name: "Payroll + Compliance",
    description: "India-first PF/ESI/PT/TDS fit",
    indiaReady: true,
  },
  {
    slug: "attendance",
    name: "Attendance/Leave/Time",
    description: "Shifts, biometric, field staff",
    indiaReady: true,
  },
  {
    slug: "ats",
    name: "ATS / Hiring",
    description: "Pipeline, interviews, offers",
    indiaReady: false,
  },
  {
    slug: "performance",
    name: "Performance/OKR",
    description: "Reviews, goals, feedback",
    indiaReady: false,
  },
] as const;

export default async function Home() {
  const trending = await getTrendingTools();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />

      {/* Hero (bento) */}
      <Section className="pt-10 sm:pt-14">
        <div className="relative overflow-hidden rounded-[1.2rem] border border-[var(--border-soft)] bg-[var(--surface-1)]/65 shadow-none">
          {/* Subtle brand wash (no decorative illustration) */}
          <div className="pointer-events-none absolute inset-0 opacity-90">
            <div className="absolute -top-40 right-[-180px] h-[520px] w-[520px] rounded-full bg-[color:var(--primary)]/11 blur-3xl" />
            <div className="absolute -bottom-44 left-[-200px] h-[560px] w-[560px] rounded-full bg-[color:var(--accent)]/7 blur-3xl" />
          </div>

          <div className="relative grid grid-cols-1 gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:gap-12">
            {/* Left */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[#CBD5E1]">
                India-first HR software discovery
                <span className="h-1 w-1 rounded-full bg-[#334155]" />
                Explainable shortlists
              </div>

              <h1 className="mt-5 text-[length:var(--h1-size)] font-extrabold leading-[1.06] tracking-tight text-[var(--text)]">
                Discover the right HR tools for your Indian SME.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-muted)]">
                HRSignal helps Indian SMEs shortlist HRMS, payroll & compliance, attendance, ATS and performance tools—with clear match reasons.
              </p>

              <div className="mt-6 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {["Export-ready reporting", "RBAC + audit trail", "Month-end reality checks", "No vendor spam by default"].map((x) => (
                  <div
                    key={x}
                    className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-4 text-sm font-medium text-[var(--text-muted)]"
                  >
                    {x}
                  </div>
                ))}
              </div>

              <div className="mt-6 text-sm font-medium text-[#94A3B8]">
                200+ directory listings • Deterministic recommendations • Privacy-first
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/tools?category=${encodeURIComponent(c.slug)}`}
                    className="rounded-full border border-[#1F2937] bg-[var(--surface-2)] px-3 py-1 text-sm text-[#CBD5E1] transition-all duration-200 hover:border-[#334155] hover:bg-[#111827] hover:text-[#F9FAFB]"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: product-driven preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)]/70 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold tracking-wide text-[var(--text-muted)]">PREVIEW</div>
                    <div className="mt-1 text-sm font-semibold text-[var(--text)]">Payroll & Compliance shortlist</div>
                  </div>
                  <div className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
                    Evidence-first
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-4">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Top pick</div>
                  <div className="mt-2 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[var(--text)]">Keka</div>
                      <div className="mt-1 text-xs text-[var(--text-muted)]">PF/ESI/PT + month-end controls</div>
                    </div>
                    <div className="rounded-full border border-[rgba(39,211,188,0.35)] bg-[rgba(39,211,188,0.12)] px-2.5 py-1 text-xs font-semibold text-[var(--text)]">
                      Verified recently
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {[
                      "Matches your state complexity",
                      "Supports payroll edge cases",
                      "Evidence-backed compliance claims",
                    ].map((x) => (
                      <div key={x} className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
                        <span className="mt-[2px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(124,77,255,0.18)] text-[var(--text)]">✓</span>
                        <span>{x}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Per employee / month", "India-ready", "GST"].map((x) => (
                      <span key={x} className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text)]">
                        {x}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <ButtonLink href="/recommend" size="md" className="w-full justify-center">
                    Get recommendations
                  </ButtonLink>
                  <ButtonLink href="/tools" variant="secondary" size="md" className="w-full justify-center">
                    Browse directory
                  </ButtonLink>
                </div>

                <div className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">
                  Privacy-first: we don’t blast your details to every vendor.
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { k: "Listings", v: "200+" },
                  { k: "Mode", v: "Explainable" },
                  { k: "Fit", v: "India-first" },
                ].map((m) => (
                  <div
                    key={m.k}
                    className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-3 text-center shadow-none"
                  >
                    <div className="text-xs font-medium text-[#94A3B8]">{m.k}</div>
                    <div className="mt-1 text-sm font-semibold text-[#F9FAFB]">{m.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-1)]/60 p-5 sm:p-6">
            <div className="mb-4">
              <div className="text-sm font-semibold text-[var(--text)]">Why trust HRSignal?</div>
              <div className="mt-1 text-sm text-[var(--text-muted)]">Authority built on evidence, not hype.</div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  k: "Verified signals",
                  v: "Badges reflect evidence + freshness — not marketing claims.",
                },
                {
                  k: "Explainable fit",
                  v: "Every pick includes ‘why shortlisted’ + what to validate next.",
                },
                {
                  k: "No vendor spam",
                  v: "We route you to one best-fit vendor after review.",
                },
              ].map((x) => (
                <div key={x.k} className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)]/70 p-4">
                  <div className="text-sm font-semibold text-[var(--text)]">{x.k}</div>
                  <div className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{x.v}</div>
                </div>
              ))}
            </div>
          </div>

          <TrustStrip />
          <VendorLogoStrip title="Popular vendors" subtitle="A few commonly evaluated vendors in the India-first HR stack." />
        </div>
      </Section>

      {/* Categories */}
      <Section>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            title="Browse by category"
            subtitle="Start with the module you need. We keep categories simple in v1 so browsing stays fast."
          />
          <Link className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/tools">
            View all tools →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.slug} slug={c.slug} name={c.name} description={c.description} indiaReady={c.indiaReady} />
          ))}
        </div>
      </Section>

      {/* Trending */}
      <Section className="bg-transparent">
        <SectionHeading title="Trending tools" subtitle="Quick picks to start your shortlist." />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section>
        <SectionHeading
          title="How HRSignal works"
          subtitle="A simple workflow: discover, shortlist with reasons, and request demos/quotes when you’re ready."
        />
        <div className="mt-6">
          <FeatureGrid
            features={[
              {
                title: "Pick a category",
                description: "Browse HRMS, payroll & compliance, attendance, ATS, or performance tools.",
              },
              {
                title: "Get recommendations",
                description: "Answer a short questionnaire and get 3–5 matches with explainable reasons.",
              },
              {
                title: "Request demos/quotes",
                description: "Share requirements once. We route your request to a best-fit vendor after review.",
              },
              {
                title: "Stay in control",
                description: "Privacy-first by default. No spammy blast to multiple vendors.",
              },
            ]}
          />
        </div>
      </Section>

      {/* Social proof */}
      <Section className="bg-transparent">
        <SectionHeading title="Built for India-first SMEs" subtitle="Practical, explainable shortlists—built to reduce vendor spam." />

        <div className="mt-6">
          <TestimonialStrip />
        </div>

        <div className="mt-10 rounded-2xl border border-[#1F2937] bg-[#0F172A] p-6 shadow-[var(--shadow-sm)] sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-xl font-semibold text-[#F9FAFB]">Ready for a guided shortlist?</div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#CBD5E1]">
                Get explainable recommendations based on company size, modules, integrations, and compliance needs.
              </p>
            </div>
            <ButtonLink href="/recommend" size="lg">
              Get recommendations
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section>
        <SectionHeading
          title="Pricing"
          subtitle="Free while we’re in early access. We’ll add a paid plan once benchmarks + advanced insights land."
        />

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-6 shadow-none">
            <div className="text-sm font-semibold text-[var(--text)]">Starter</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">Free</div>
            <p className="mt-2 text-sm text-[#CBD5E1]">Get recommendations + shortlist with reasons.</p>
            <ul className="mt-4 space-y-2 text-sm text-[#CBD5E1]">
              <li>• 3–5 recommendations</li>
              <li>• Explainable match reasons</li>
              <li>• Request pricing/vendor intro</li>
            </ul>
            <div className="mt-5">
              <ButtonLink href="/recommend" size="lg" className="w-full justify-center">
                Get started
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(124,77,255,0.22)] bg-[rgba(124,77,255,0.10)] p-6 shadow-none">
            <div className="text-sm font-semibold text-[var(--text)]">Teams</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">Early access</div>
            <p className="mt-2 text-sm text-[var(--text-muted)]">We’ll set this up with you (white-glove).</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
              <li>• Custom filters (states, compliance, integrations)</li>
              <li>• Vendor screening and intro</li>
              <li>• Priority support</li>
            </ul>
            <div className="mt-5">
              <ButtonLink href="/recommend" size="lg" variant="primary" className="w-full justify-center">
                Request early access
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-6 shadow-none">
            <div className="text-sm font-semibold text-[var(--text)]">Enterprise</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">Talk to us</div>
            <p className="mt-2 text-sm text-[#CBD5E1]">For larger teams and multi-entity compliance needs.</p>
            <ul className="mt-4 space-y-2 text-sm text-[#CBD5E1]">
              <li>• Custom scoring rules</li>
              <li>• Assisted evaluation</li>
              <li>• SLA + reporting</li>
            </ul>
            <div className="mt-5">
              <ButtonLink href="/recommend" size="lg" variant="secondary" className="w-full justify-center">
                Contact sales
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQs */}
      <Section className="bg-transparent">
        <SectionHeading title="FAQs" subtitle="Straight answers so you can move fast." />
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[
            {
              q: "Do you share my details with multiple vendors?",
              a: "No. We only share your requirement with one best-fit vendor after review.",
            },
            {
              q: "Is this only for India?",
              a: "The catalog is India-first (PF/ESI/PT, state coverage), but you can still browse globally.",
            },
            {
              q: "How are recommendations generated?",
              a: "We score tools by category coverage, size fit, and required integrations. You can see why each tool fits.",
            },
            {
              q: "What if my requirements are unique?",
              a: "Add details in the note and we’ll refine the shortlist manually before making an intro.",
            },
          ].map((f) => (
            <div key={f.q} className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-6 shadow-none">
              <div className="text-sm font-semibold text-[#F9FAFB]">{f.q}</div>
              <div className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">{f.a}</div>
            </div>
          ))}
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}

async function getTrendingTools(): Promise<ToolCardModel[]> {
  const fallback: ToolCardModel[] = [
    { slug: "keka", name: "Keka", vendorName: "Keka", tagline: "Modern HRMS with payroll", categories: ["HRMS", "Payroll"] },
    {
      slug: "greythr",
      name: "greytHR",
      vendorName: "greytHR",
      tagline: "HRMS + payroll for Indian SMEs",
      categories: ["HRMS", "Payroll"],
    },
    {
      slug: "zoho-people",
      name: "Zoho People",
      vendorName: "Zoho",
      tagline: "HRMS with attendance/leave",
      categories: ["HRMS", "Attendance"],
    },
  ];

  if (!process.env.DATABASE_URL) return fallback;

  try {
    const rows = await prisma.tool.findMany({
      where: {
        status: "PUBLISHED",
        vendor: { registeredCountry: "IN", verifiedInIndia: true },
      },
      orderBy: { lastVerifiedAt: "desc" },
      include: { vendor: true, categories: { include: { category: true } } },
      take: 6,
    });

    return rows.map((t) => ({
      slug: t.slug,
      name: t.name,
      vendorName: t.vendor?.name ?? undefined,
      tagline: t.tagline ?? undefined,
      categories: t.categories.map((c) => c.category.name),
      verified: Boolean(t.lastVerifiedAt),
      lastCheckedAt: t.lastVerifiedAt ? t.lastVerifiedAt.toISOString() : null,
    }));
  } catch {
    return fallback;
  }
}
