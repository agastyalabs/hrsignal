export const dynamic = "force-dynamic";

import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ButtonLink } from "@/components/ui/Button";
import { HomeSection } from "@/components/marketing/HomeSection";

export default async function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      {/* 1) Hero + decision snapshot */}
      <HomeSection className="pt-10 sm:pt-14">
        <div className="rounded-[1.2rem] border border-[var(--border-soft)] bg-[var(--surface-1)]">
          <div className="grid grid-cols-1 gap-8 p-5 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
            <div className="lg:col-span-7">
              <h1 className="text-[length:var(--h1-size)] font-extrabold leading-[1.06] tracking-tight text-[var(--text)]">
                Make HR software decisions with clarity.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-muted)]">
                Structured shortlists for Indian payroll & HR — with explainable fit scores and compliance depth built in.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href="/recommend" size="lg" className="w-full justify-center sm:w-auto">
                  Get your shortlist
                </ButtonLink>
                <ButtonLink href="/vendors" variant="secondary" size="lg" className="w-full justify-center sm:w-auto">
                  Explore vendors
                </ButtonLink>
              </div>

              {/* Mobile: snapshot immediately after CTAs */}
              <div className="mt-6 lg:hidden">
                <DecisionSnapshotCard />
              </div>
            </div>

            <div className="hidden lg:col-span-5 lg:block">
              <DecisionSnapshotCard />
            </div>
          </div>
        </div>
      </HomeSection>

      {/* 2) Problem framing */}
      <HomeSection className="pt-0">
        <SectionTitle
          title="Buying HR software in India is not a feature comparison."
          subtitle="The hard parts are compliance depth, signal quality, and decision risk under incomplete information."
        />

        <div className="mt-6 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
          <InfoCard
            title="Compliance depth"
            body="Payroll breaks at the edges: state rules, exemptions, month-end controls, and multi-entity complexity."
          />
          <InfoCard
            title="Marketing noise"
            body="Most directories prioritize listings and claims. You still have to verify what is true for your setup."
          />
          <InfoCard
            title="Decision risk"
            body="Unknowns show up late: in implementation, month-end, audits, or escalations. You need risks visible early."
          />
        </div>
      </HomeSection>

      {/* 3) Structured evaluation layer */}
      <HomeSection className="bg-transparent">
        <SectionTitle title="A structured evaluation layer." subtitle="Define constraints, shortlist with reasons, then compare with risk visibility." />

        <div className="mt-6 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
          <StepCardV5
            icon="①"
            title="Define constraints"
            body="Company size, modules, multi-state context, integrations, and decision constraints (timelines, rollout, teams)."
          />
          <StepCardV5
            icon="②"
            title="Shortlist"
            body="Explainable fit scores and decision reasons so you can see what drove the match."
          />
          <StepCardV5
            icon="③"
            title="Compare with risks visible"
            body="A comparison view that highlights unknowns as “validate” so the demo focuses on decision risk." 
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink href="/recommend" size="md" className="w-full justify-center sm:w-auto">
            Get your shortlist
          </ButtonLink>
          <Link className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/compare">
            Compare tools →
          </Link>
        </div>
      </HomeSection>

      {/* 4) India compliance depth */}
      <HomeSection>
        <SectionTitle
          title="Built for Indian payroll realities."
          subtitle="We optimize for correctness under state complexity and month-end conditions." 
        />

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
              <div className="text-base font-medium text-[var(--text)]">What we score</div>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--text-muted)]">
                <li>• PF / ESI / PT coverage and month-end behavior</li>
                <li>• LWF applicability and state-specific rules</li>
                <li>• TDS workflows and audit readiness</li>
                <li>• Multi-state complexity (branches, PT, ESI locations, holidays)</li>
                <li>• Integration readiness (attendance sources, accounting exports)</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-5">
              <div className="text-base font-medium text-[var(--text)]">What you receive</div>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--text-muted)]">
                <li>• Shortlists aligned to payroll constraints</li>
                <li>• Decision reasons + what to validate in the demo</li>
                <li>• Clear “verified” vs “validate” labels</li>
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

      {/* 5) Methodology transparency */}
      <HomeSection className="bg-transparent">
        <SectionTitle
          title="Methodology transparency."
          subtitle="What “verified” means, how fit scores are interpreted, and how freshness is used." 
        />

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
              <div className="text-base font-medium text-[var(--text)]">Verified / validate</div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                Verified reflects evidence and review freshness. If something is not verified, it is labeled as “validate” so you can target it during the demo.
              </p>

              <div className="mt-6 text-base font-medium text-[var(--text)]">Fit score logic</div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                Fit scores summarize how well a tool matches constraints and coverage. Use them as a structured starting point, not as a replacement for validation.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-5">
              <div className="text-base font-medium text-[var(--text)]">Freshness</div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                Verification is time-sensitive. HRSignal surfaces freshness cues so you can prioritize what needs re-checking.
              </p>

              <div className="mt-5">
                <ButtonLink href="/vendors" variant="secondary" size="md" className="w-full justify-center">
                  Explore vendor profiles
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </HomeSection>

      {/* 6) Final CTA */}
      <HomeSection>
        <div className="rounded-[1.2rem] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-[length:var(--h2-size)] font-medium tracking-tight text-[var(--text)]">
                Start with a structured shortlist.
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
                Share constraints once. Get an explainable shortlist and a validation checklist.
              </p>
            </div>
            <ButtonLink href="/recommend" size="lg" className="w-full justify-center sm:w-auto">
              Get your shortlist
            </ButtonLink>
          </div>
        </div>
      </HomeSection>

      <SiteFooter />
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <div className="text-[length:var(--h2-size)] font-medium tracking-tight text-[var(--text)]">{title}</div>
      {subtitle ? <div className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">{subtitle}</div> : null}
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
      <div className="text-base font-medium text-[var(--text)]">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{body}</div>
    </div>
  );
}

function StepCardV5({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] text-sm text-[var(--text)]">
          {icon}
        </div>
        <div>
          <div className="text-base font-medium text-[var(--text)]">{title}</div>
          <div className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{body}</div>
        </div>
      </div>
      <div className="mt-auto" />
    </div>
  );
}

function DecisionSnapshotCard() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium tracking-wide text-[var(--text-muted)]">DECISION SNAPSHOT</div>
          <div className="mt-2 text-base font-medium text-[var(--text)]">Vendor: Keka</div>
        </div>
        <div className="text-3xl font-extrabold tracking-tight text-[var(--text)]">92</div>
      </div>

      <div className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--text-muted)]">
        <div>• Payroll controls aligned to month-end workflows</div>
        <div>• Multi-state compliance support cues are available</div>
        <div>• Integrations are listed (reduces unknowns)</div>
      </div>

      <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4 text-sm text-[var(--text-muted)]">
        What to validate: exact export formats (bank + accounting) and plan limits for SSO/SCIM/webhooks.
      </div>
    </div>
  );
}
