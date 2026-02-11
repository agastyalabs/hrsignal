export const dynamic = "force-dynamic";

import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { HomeSection } from "@/components/marketing/HomeSection";
import { MetricCard } from "@/components/marketing/MetricCard";
import { StepCard } from "@/components/marketing/StepCard";
import { CompareRow } from "@/components/marketing/CompareRow";
import { VendorLogoStrip } from "@/components/marketing/VendorLogoStrip";
import { TestimonialStrip } from "@/components/marketing/TestimonialStrip";
import { prisma } from "@/lib/db";

const CATEGORIES = [
  {
    slug: "hrms",
    name: "Core HRMS",
    description: "Employee lifecycle + org + docs",
    indiaReady: false,
  },
  {
    slug: "payroll",
    name: "Payroll + Compliance",
    description: "PF/ESI/PT/TDS + month-end",
    indiaReady: true,
  },
  {
    slug: "attendance",
    name: "Attendance / Leave",
    description: "Shifts + leave + time",
    indiaReady: true,
  },
  {
    slug: "ats",
    name: "ATS / Hiring",
    description: "Pipeline + interviews + offers",
    indiaReady: false,
  },
  {
    slug: "performance",
    name: "Performance / OKR",
    description: "Reviews + goals + feedback",
    indiaReady: false,
  },
] as const;

export default async function Home() {
  const metrics = await getHomepageMetrics();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      {/* 1) Hero + decision snapshot */}
      <HomeSection className="pt-10 sm:pt-14">
        <div className="rounded-[1.2rem] border border-[var(--border-soft)] bg-[var(--surface-1)]">
          <div className="grid grid-cols-1 gap-8 p-5 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
            <div className="lg:col-span-7">
              <div className="text-xs font-medium text-[var(--text-muted)]">
                India-first HR software discovery • Evidence-first shortlists
              </div>

              <h1 className="mt-4 text-[length:var(--h1-size)] font-extrabold leading-[1.06] tracking-tight text-[var(--text)]">
                Funded-level authority for HR software decisions.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-muted)]">
                Discover, compare, and shortlist HRMS + payroll tools for Indian SMEs — with explainable fit, verification freshness, and evidence links.
              </p>

              {/* Mobile-first: CTAs first */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href="/recommend" size="lg" className="w-full justify-center sm:w-auto">
                  Get recommendations
                </ButtonLink>
                <ButtonLink href="/tools" variant="secondary" size="lg" className="w-full justify-center sm:w-auto">
                  Browse directory
                </ButtonLink>
              </div>

              {/* Mobile-first: snapshot immediately after CTAs */}
              <div className="mt-6 lg:hidden">
                <DecisionSnapshotCard />
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

            <div className="hidden lg:col-span-5 lg:block">
              <DecisionSnapshotCard />
            </div>
          </div>
        </div>
      </HomeSection>

      {/* 2) Metrics strip (2x2) */}
      <HomeSection className="pt-0">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <MetricCard label="Tools" value={metrics.toolsLabel} description="Directory listings" />
          <MetricCard label="Categories" value={metrics.categoriesLabel} description="Modules you can browse" />
          <MetricCard label="Evidence" value={metrics.evidenceLabel} description="Docs, pricing, security" />
          <MetricCard label="Freshness" value={metrics.freshnessLabel} description="Verified recency cues" />
        </div>
      </HomeSection>

      {/* 3) How it works (3 steps) */}
      <HomeSection>
        <SectionHeading
          title="How it works"
          subtitle="A 3-step workflow: set constraints, get an explainable shortlist, then compare before pricing/demos."
        />
        <div className="mt-6 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3 lg:items-stretch">
          <StepCard
            icon="①"
            title="Set your constraints"
            description="Company size, modules, must-have integrations, and compliance context (multi-state, exemptions, shift patterns)."
          />
          <StepCard
            icon="②"
            title="Get an explainable shortlist"
            description="3–5 matches with ‘why shortlisted’, what’s verified, and what you should validate in the demo."
          />
          <StepCard
            icon="③"
            title="Compare + move to pricing"
            description="Side-by-side comparison to shortlist confidently, then request an intro/quote when you’re ready."
          />
        </div>
      </HomeSection>

      {/* 4) India compliance differentiation */}
      <HomeSection className="bg-transparent">
        <SectionHeading
          title="India compliance, not generic checklists"
          subtitle="Payroll decisions break at the edges. HRSignal is built around India-first realities."
        />

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
              <div className="text-base font-medium text-[var(--text)]">What we look for</div>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--text-muted)]">
                <li>• PF / ESI / PT coverage + correct month-end processing</li>
                <li>• LWF applicability and state-specific rules</li>
                <li>• TDS workflows, declarations, and Form 16 readiness</li>
                <li>• GST-ready invoicing or reporting where relevant (vendor/model dependent)</li>
                <li>• Multi-state complexity (branches, PT, ESI locations, holidays)</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-5">
              <div className="text-base font-medium text-[var(--text)]">What you get</div>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--text-muted)]">
                <li>• Shortlists biased toward India-ready evidence</li>
                <li>• A demo checklist that catches month-end failures early</li>
                <li>• Clear “validate” flags when info isn’t verified yet</li>
              </ul>
              <div className="mt-5">
                <ButtonLink href="/categories/payroll" variant="secondary" size="md" className="w-full justify-center">
                  Read the payroll decision guide
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </HomeSection>

      {/* 5) Category grid (2 columns) */}
      <HomeSection>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading title="Browse by category" subtitle="Start with a module. Each category is kept simple so browsing stays fast." />
          <Link className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/tools">
            View all tools →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.slug} slug={c.slug} name={c.name} description={c.description} indiaReady={c.indiaReady} />
          ))}
        </div>
      </HomeSection>

      {/* 6) Comparison grid */}
      <HomeSection className="bg-transparent">
        <SectionHeading
          title="HRSignal vs traditional directories"
          subtitle="Less scrolling. More decision clarity. Fewer unknowns."
        />
        <div className="mt-6 grid grid-cols-1 gap-3 sm:gap-4">
          <CompareRow
            title="Trust signals"
            left="Badges and rankings often reflect marketing, not verifiable proof."
            right="Verification freshness + evidence links so you can check claims quickly."
          />
          <CompareRow
            title="Decision speed"
            left="You scan dozens of pages and still don’t know what matters for your setup."
            right="Explainable fit + a demo checklist makes evaluation predictable."
          />
          <CompareRow
            title="India readiness"
            left="Generic global lists miss payroll edges (PF/ESI/PT, multi-state)."
            right="India compliance lens baked into categories and shortlist guidance."
          />
          <CompareRow
            title="Spam control"
            left="Requesting info can trigger a blast to multiple vendors."
            right="Privacy-first by default; you control when to request an intro."
          />
        </div>
      </HomeSection>

      {/* 7) Methodology / verification */}
      <HomeSection>
        <SectionHeading title="Methodology" subtitle="How we score, and what ‘verified’ actually means." />

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
              <div className="text-base font-medium text-[var(--text)]">How we score fit</div>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--text-muted)]">
                <li>• Category coverage: what modules are truly supported</li>
                <li>• Integration readiness: what’s listed + what to validate</li>
                <li>• India-first cues: compliance and operational reality checks</li>
                <li>• Decision risks: unknowns surfaced as “validate” (not hidden)</li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-5">
              <div className="text-base font-medium text-[var(--text)]">What “verified” means</div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                Verified badges represent evidence and freshness — typically based on documentation, published artefacts, and recency of review. When something isn’t verified, we label it explicitly as “validate”.
              </p>

              <div className="mt-5">
                <ButtonLink href="/vendors" variant="secondary" size="md" className="w-full justify-center">
                  Explore vendor profiles
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <VendorLogoStrip title="Popular vendors" subtitle="Commonly evaluated vendors in the India-first HR stack." />
        </div>
      </HomeSection>

      {/* 8) Final CTA */}
      <HomeSection className="bg-transparent">
        <div className="rounded-[1.2rem] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-[length:var(--h2-size)] font-semibold tracking-tight text-[var(--text)]">
                Ready for a guided shortlist?
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
                Get explainable recommendations based on company size, modules, integrations, and compliance needs.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <ButtonLink href="/recommend" size="lg" className="w-full justify-center sm:w-auto">
                Get recommendations
              </ButtonLink>
              <ButtonLink href="/resources" size="lg" variant="secondary" className="w-full justify-center sm:w-auto">
                Read decision guides
              </ButtonLink>
            </div>
          </div>

          <div className="mt-6">
            <TestimonialStrip />
          </div>
        </div>
      </HomeSection>

      <SiteFooter />
    </div>
  );
}

function DecisionSnapshotCard() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium tracking-wide text-[var(--text-muted)]">DECISION SNAPSHOT</div>
          <div className="mt-2 text-base font-medium text-[var(--text)]">Payroll & Compliance shortlist</div>
        </div>
        <div className="rounded-full border border-[rgba(39,211,188,0.35)] bg-[rgba(39,211,188,0.10)] px-2.5 py-1 text-xs font-medium text-[var(--text)]">
          Freshness-aware
        </div>
      </div>

      <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-[var(--text-muted)]">Top pick</div>
            <div className="mt-2 text-sm font-medium text-[var(--text)]">Keka</div>
            <div className="mt-1 text-xs text-[var(--text-muted)]">PF/ESI/PT + month-end controls</div>
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-[var(--text)]">92</div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          {["Matches your multi-state complexity", "Evidence-backed compliance cues", "Demo checklist to validate edge cases"].map((x) => (
            <div key={x} className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
              <span className="mt-[2px] inline-flex h-4 w-4 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text)]">
                ✓
              </span>
              <span>{x}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["PEPM", "India-ready", "Evidence links"].map((x) => (
            <span key={x} className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-medium text-[var(--text)]">
              {x}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <ButtonLink href="/recommend" size="md" className="w-full justify-center">
          Get recommendations
        </ButtonLink>
        <ButtonLink href="/compare" size="md" variant="secondary" className="w-full justify-center">
          Compare tools
        </ButtonLink>
      </div>

      <div className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">
        Privacy-first: we don’t blast your details to multiple vendors.
      </div>
    </div>
  );
}

async function getHomepageMetrics(): Promise<{
  toolsLabel: string;
  categoriesLabel: string;
  evidenceLabel: string;
  freshnessLabel: string;
}> {
  const fallback = {
    toolsLabel: "200+",
    categoriesLabel: "10+",
    evidenceLabel: "Evidence links",
    freshnessLabel: "Verified",
  };

  if (!process.env.DATABASE_URL) return fallback;

  try {
    const [tools, categories] = await Promise.all([
      prisma.tool.count({ where: { status: "PUBLISHED" } }),
      prisma.category.count(),
    ]);

    return {
      toolsLabel: tools >= 200 ? `${tools}+` : String(tools),
      categoriesLabel: categories ? String(categories) : "—",
      evidenceLabel: "Evidence links",
      freshnessLabel: "Recency",
    };
  } catch {
    return fallback;
  }
}
