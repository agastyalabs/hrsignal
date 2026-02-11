export const dynamic = "force-dynamic";

import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
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
  const metrics = await getHomepageMetrics();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      {/* Hero */}
      <Section className="pt-10 sm:pt-14">
        <div className="relative overflow-hidden rounded-[1.2rem] border border-[var(--border-soft)] bg-[var(--surface-1)]/65">
          <div className="pointer-events-none absolute inset-0 opacity-90">
            <div className="absolute -top-40 right-[-180px] h-[520px] w-[520px] rounded-full bg-[color:var(--primary)]/11 blur-3xl" />
            <div className="absolute -bottom-44 left-[-200px] h-[560px] w-[560px] rounded-full bg-[color:var(--accent)]/7 blur-3xl" />
          </div>

          <div className="relative grid grid-cols-1 gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
                India-first HR software discovery
                <span className="h-1 w-1 rounded-full bg-[rgba(255,255,255,0.16)]" />
                Evidence-first shortlists
              </div>

              <h1 className="mt-5 text-[length:var(--h1-size)] font-extrabold leading-[1.06] tracking-tight text-[var(--text)]">
                Shortlist HRMS, payroll & compliance tools with proof — not hype.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-muted)]">
                HRSignal helps Indian SMEs make faster HR software decisions with explainable recommendations, verification freshness, and evidence links — so you know what to trust and what to validate.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/recommend" size="lg">
                  Get a shortlist
                </ButtonLink>
                <ButtonLink href="/tools" variant="secondary" size="lg">
                  Browse 200+ tools
                </ButtonLink>
              </div>

              <div className="mt-6 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {["Explainable fit (why shortlisted)", "Verification freshness (recency)", "India compliance reality checks", "No vendor spam by default"].map((x) => (
                  <div key={x} className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-4 text-sm font-medium text-[var(--text-muted)]">
                    {x}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/tools?category=${encodeURIComponent(c.slug)}`}
                    className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-1 text-sm font-medium text-[var(--text-muted)] transition-colors hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--text)]"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

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
                    {["Matches your state complexity", "Supports payroll edge cases", "Evidence-backed compliance claims"].map((x) => (
                      <div key={x} className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
                        <span className="mt-[2px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(124,77,255,0.18)] text-[var(--text)]">
                          ✓
                        </span>
                        <span>{x}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["PEPM", "India-ready", "Evidence links"].map((x) => (
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
                  <ButtonLink href="/compare" variant="secondary" size="md" className="w-full justify-center">
                    Compare tools
                  </ButtonLink>
                </div>

                <div className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">
                  Privacy-first: we don’t blast your details to multiple vendors.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics strip */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { k: "Tools", v: metrics.toolsLabel, sub: "Directory listings" },
            { k: "Categories", v: metrics.categoriesLabel, sub: "Modules you can browse" },
            { k: "Evidence", v: metrics.evidenceLabel, sub: "Links + verification cues" },
          ].map((m) => (
            <div key={m.k} className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-1)]/60 p-4">
              <div className="text-xs font-semibold text-[var(--text-muted)]">{m.k}</div>
              <div className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--text)]">{m.v}</div>
              <div className="mt-1 text-sm text-[var(--text-muted)]">{m.sub}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works (3 steps) */}
      <Section>
        <SectionHeading title="How it works" subtitle="A simple 3-step workflow to go from browsing to a confident shortlist." />
        <div className="mt-6">
          <FeatureGrid
            features={[
              {
                title: "1) Tell us what you’re buying",
                description: "Pick the module(s), company size, must-have integrations, and India compliance needs.",
              },
              {
                title: "2) Get an explainable shortlist",
                description: "See why each tool fits, what’s verified, and what you should validate in a demo.",
              },
              {
                title: "3) Compare + move to pricing",
                description: "Compare options side-by-side, then request an intro/quote when you’re ready.",
              },
            ]}
          />
        </div>
      </Section>

      {/* Why trust */}
      <Section className="bg-transparent">
        <SectionHeading title="Why trust HRSignal" subtitle="Authority built on evidence, freshness, and decision clarity." />
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[
            {
              k: "Evidence links",
              v: "We surface docs, security pages, pricing notes, and case studies so claims are checkable.",
            },
            {
              k: "Verification freshness",
              v: "Badges reflect what was verified recently — and we show what’s unknown (validate).",
            },
            {
              k: "Explainable fit",
              v: "Every pick includes ‘why shortlisted’ plus a next-step checklist for demos.",
            },
            {
              k: "No vendor spam",
              v: "We don’t blast your details to multiple vendors. You stay in control.",
            },
          ].map((x) => (
            <div key={x.k} className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)]/70 p-5">
              <div className="text-sm font-semibold text-[var(--text)]">{x.k}</div>
              <div className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{x.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <VendorLogoStrip title="Popular vendors" subtitle="A few commonly evaluated vendors in the India-first HR stack." />
        </div>
      </Section>

      {/* Product features (4 blocks) */}
      <Section>
        <SectionHeading title="Product highlights" subtitle="Built for scannability: fast decisions with fewer unknowns." />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              k: "Recommendations with reasons",
              v: "Shortlists are explainable: category fit, constraints, and what drove the pick.",
              href: "/recommend",
              cta: "Get a shortlist →",
            },
            {
              k: "Side-by-side comparisons",
              v: "Compare tools quickly without losing context (pricing model, trust signals, coverage).",
              href: "/compare",
              cta: "Compare tools →",
            },
            {
              k: "Vendor profiles with evidence",
              v: "Each vendor page highlights what’s known, evidence links, and decision snapshot pros/risks.",
              href: "/vendors",
              cta: "Browse vendors →",
            },
            {
              k: "India-first compliance lens",
              v: "Payroll and compliance evaluations prioritize PF/ESI/PT/TDS and month-end reality checks.",
              href: "/categories/payroll",
              cta: "See payroll decision guide →",
            },
          ].map((f) => (
            <div key={f.k} className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
              <div className="text-base font-semibold text-[var(--text)]">{f.k}</div>
              <div className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{f.v}</div>
              <div className="mt-4">
                <Link className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]" href={f.href}>
                  {f.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Categories */}
      <Section>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading title="Browse by category" subtitle="Start with the module you need. We keep categories simple in v1 so browsing stays fast." />
          <Link className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/tools">
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

      {/* Bottom CTA */}
      <Section className="bg-transparent">
        <div className="rounded-[1.2rem] border border-[var(--border-soft)] bg-[var(--surface-1)]/70 p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-xl font-semibold text-[var(--text)]">Ready for a guided shortlist?</div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
                Get explainable recommendations based on company size, modules, integrations, and compliance needs.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ButtonLink href="/recommend" size="lg">
                Get a shortlist
              </ButtonLink>
              <ButtonLink href="/resources" size="lg" variant="secondary">
                Read decision guides
              </ButtonLink>
            </div>
          </div>

          <div className="mt-6">
            <TestimonialStrip />
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
              <div className="text-sm font-semibold text-[var(--text)]">{f.q}</div>
              <div className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{f.a}</div>
            </div>
          ))}
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}

async function getHomepageMetrics(): Promise<{ toolsLabel: string; categoriesLabel: string; evidenceLabel: string }> {
  const fallback = { toolsLabel: "200+", categoriesLabel: "10+", evidenceLabel: "Evidence-first" };
  if (!process.env.DATABASE_URL) return fallback;

  try {
    const [tools, categories] = await Promise.all([prisma.tool.count({ where: { status: "PUBLISHED" } }), prisma.category.count()]);
    return {
      toolsLabel: tools >= 200 ? `${tools}+` : String(tools),
      categoriesLabel: categories ? String(categories) : "—",
      evidenceLabel: "Evidence links",
    };
  } catch {
    return fallback;
  }
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
