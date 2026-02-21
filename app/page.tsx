export const dynamic = "force-dynamic";

import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ButtonLink } from "@/components/ui/Button";
import { TrackedButtonLink } from "@/components/analytics/TrackedButtonLink";
import { HomeSection } from "@/components/marketing/HomeSection";
import { MotionFadeIn } from "@/components/marketing/MotionFadeIn";
import { StatsBar } from "@/components/marketing/StatsBar";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { TestimonialCard } from "@/components/marketing/TestimonialCard";
import { TalkToPayrollSpecialistSection } from "@/components/conversion/TalkToPayrollSpecialistSection";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { Card } from "@/components/ui/Card";
import { ChecklistDownloadCard } from "@/components/lead/ChecklistDownloadCard";
import { COMPLIANCE_GUIDES } from "@/lib/compliance/guides";
import HomeMiddleSection from "@/app/components/HomeMiddleSection";

export default async function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)]">
      <SiteHeader />

      {/* 1) Hero + decision snapshot */}
      <HomeSection className="pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden">
        <div className="bg-blob-blue" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide">
                <span className="w-2 h-2 bg-[var(--primary-blue)] rounded-full animate-pulse" />
                Curated for Indian teams
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
                Stop Guessing. <span className="text-[var(--primary-blue)]">Discover HR Tools That Actually Work in India.</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Curated &amp; battle-tested by 300+ Indian HR leaders
              </p>

              <div className="max-w-md relative group">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity" />
                <form action="/recommend" method="get" className="relative bg-white p-2 rounded-full shadow-soft flex items-center border border-slate-100">
                  <input type="hidden" name="source" value="hero_email" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="work_email@company.com"
                    autoComplete="email"
                    aria-label="Work email"
                    className="flex-1 bg-transparent border-none outline-none px-6 text-slate-700 placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all"
                  >
                    Analyze Fit
                  </button>
                </form>
              </div>

              <div className="flex items-center gap-6 text-xs font-semibold text-slate-500 pt-2">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Takes 60 Seconds
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No Vendor Spam
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Unbiased
                </span>
              </div>
            </div>

            <div className="relative h-[600px] w-full flex items-center justify-center">
              <DecisionSnapshotCard />
            </div>
          </div>
        </div>
      </HomeSection>

      {/* Premium hydration-safe middle section */}
      <HomeMiddleSection />

      {/* 2.6) Compliance guides */}
      <HomeSection className="pt-0 border-t border-[var(--border-soft)]">
        <div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text)] sm:text-2xl">Compliance Guides</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">PF, ESI, PT multi-state, and TDS — with demo validation checklists.</p>
            </div>
            <Link
              href="/compliance"
              className="text-sm font-semibold text-[var(--primary-blue)] underline decoration-[rgba(37,99,235,0.28)] underline-offset-4 hover:text-[var(--primary-dark)] hover:decoration-[rgba(37,99,235,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              View all guides →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMPLIANCE_GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/compliance/${g.slug}`}
                className="group rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                <div className="text-sm font-semibold text-[var(--text)]">{g.title}</div>
                <div className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{g.description}</div>
                <div className="mt-4 text-sm font-semibold text-[var(--primary-blue)] transition-colors duration-200 group-hover:text-[var(--primary-dark)]">Read →</div>
              </Link>
            ))}
          </div>
        </div>
      </HomeSection>

      {/* 3) Who HRSignal is built for */}
      <HomeSection className="pt-0 border-t border-[var(--border-soft)]">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text)] sm:text-2xl">Who HRSignal is built for</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Teams evaluating India payroll with multi-state complexity.</p>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {[
              {
                title: "Multi-state payroll teams (20–1000 employees)",
                desc: "Handling PF / ESI / PT / TDS across states and entities.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-[var(--text-muted)]" aria-hidden="true">
                    <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                title: "HR leaders in growing Indian orgs",
                desc: "Scaling from 20 to 500+ employees without compliance surprises.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-[var(--text-muted)]" aria-hidden="true">
                    <path d="M7 14c1.2 1.2 2.8 2 5 2s3.8-.8 5-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M12 3a6 6 0 016 6v2a6 6 0 11-12 0V9a6 6 0 016-6z" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                ),
              },
              {
                title: "Finance & founders reviewing payroll risk",
                desc: "Needing audit-ready outputs and implementation clarity.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-[var(--text-muted)]" aria-hidden="true">
                    <path d="M7 7h10v14H7z" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M9 11h6M9 15h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M9 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                ),
              },
            ].map((c) => (
              <div
                key={c.title}
                className="h-full rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-8"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)]">
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-[var(--text)]">{c.title}</div>
                    <div className="mt-2 max-w-[52ch] text-sm leading-7 text-[var(--text-muted)]">{c.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </HomeSection>

      {/* 4) How HRSignal Readiness Score Works */}
      <HomeSection className="pt-0 border-t border-[var(--border-soft)]">
        <div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Left */}
            <div className="lg:col-span-6">
              <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
                <h2 className="text-xl font-semibold tracking-tight text-[var(--text)] sm:text-2xl">
                  How HRSignal Readiness Score Works
                </h2>
                <p className="mt-2 max-w-[68ch] text-sm leading-7 text-[var(--text-muted)]">
                  A deterministic scoring model for India payroll buyers — designed to highlight what’s verified vs what you should validate.
                </p>

                <ul className="mt-5 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                  <li>• Compliance scope verification</li>
                  <li>• Evidence link depth</li>
                  <li>• Integration visibility</li>
                  <li>• Freshness signals</li>
                </ul>
              </Card>
            </div>

            {/* Right */}
            <div className="lg:col-span-6">
              <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
                <div className="text-sm font-semibold text-[var(--text)]">Model (structured)</div>
                <div className="mt-1 text-sm text-[var(--text-muted)]">No ML hype — just explainable inputs and weights.</div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Inputs</div>
                    <div className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                      Compliance tags • Evidence links • Integrations listed • Verification freshness
                    </div>
                  </div>

                  <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Weighted deterministic scoring</div>
                    <div className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                      Weights prioritize India payroll verification signals. Missing data is treated as “validate”.
                    </div>
                  </div>

                  <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Output</div>
                    <div className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                      0–100 scale, with transparent reasons you can use in demos and internal review.
                    </div>
                  </div>

                  <div className="text-sm">
                    <Link
                      href="/methodology"
                      className="font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 hover:text-violet-100 hover:decoration-[rgba(124,77,255,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    >
                      View full methodology →
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-6">
            <ChecklistDownloadCard sourcePage="homepage" />
          </div>

          <div className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-[var(--text)] sm:text-2xl">Decision Guides</h2>
                <p className="mt-2 max-w-[68ch] text-sm leading-7 text-[var(--text-muted)]">
                  Buyer-first checklists and timelines to help you evaluate and implement with fewer month-end surprises.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {[
                {
                  title: "Payroll evaluation checklist (India)",
                  desc: "Compliance scope, multi-state risk controls, pricing traps, and a comparison framework.",
                  href: "/payroll-software-evaluation-checklist-india",
                },
                {
                  title: "HRMS implementation timeline (India)",
                  desc: "Phases, data migration risks, payroll cutover timing, and multi-location rollout strategy.",
                  href: "/hrms-implementation-timeline-india",
                },
                {
                  title: "India payroll guide",
                  desc: "Complexity context + what to validate before buying payroll software.",
                  href: "/categories/payroll-india",
                },
              ].map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="group rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  <div className="text-base font-semibold text-[var(--text)]">{g.title}</div>
                  <div className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{g.desc}</div>
                  <div className="mt-4 text-sm font-semibold text-[var(--link)] group-hover:text-[var(--link-hover)]">
                    Read →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </HomeSection>

      {/* 5) Authority + specialist CTA */}
      <HomeSection className="pt-0 border-t border-[var(--border-soft)]">
        <TalkToPayrollSpecialistSection href="/recommend" />
      </HomeSection>

      {/* 5) Browse by category */}
      <HomeSection className="pt-0 border-t border-[var(--border-soft)]">
        <SectionTitle title="Browse by category" subtitle="Start with the module you need — then shortlist vendors with deterministic reasons." />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[ 
            { slug: "payroll", name: "Payroll & Compliance", desc: "PF/ESI/PT/TDS workflows and month-end controls" },
            { slug: "hrms", name: "Core HRMS", desc: "Employee master, org, docs, approvals" },
            { slug: "attendance", name: "Attendance / Leave", desc: "Shifts, overtime, biometric/device flows" },
            { slug: "ats", name: "ATS / Hiring", desc: "Pipeline, interviews, offers" },
            { slug: "performance", name: "Performance / OKR", desc: "Goals, check-ins, reviews" },
            { slug: "payroll-india", name: "Payroll India (Guide)", desc: "India payroll complexity + shortlisting guide" },
          ].map((c) => (
            <CategoryCard key={c.slug} slug={c.slug} name={c.name} description={c.desc} />
          ))}
        </div>

        <div className="mt-6">
          <ButtonLink href="/categories" variant="secondary" size="md" className="w-full justify-center sm:w-auto">
            View all categories
          </ButtonLink>
        </div>
      </HomeSection>

      {/* 6) Trust & proof strip */}
      <HomeSection className="pt-0 border-t border-[var(--border-soft)]">
        <SectionTitle
          title="Why trust HRSignal?"
          subtitle="Evidence-backed shortlists for India payroll—freshness, compliance depth, and demo edge cases made explicit."
        />

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <TrustTile
            label="Evidence links included"
            desc="Key claims are tied to source links (docs, pricing pages, compliance notes) so you can verify fast."
            href="/tools"
            linkLabel="Browse tools →"
          />
          <TrustTile
            label="Freshness is visible"
            desc="Listings show “verified/updated” recency so you can spot what needs re-checking before month‑end."
            href="/vendors"
            linkLabel="Browse vendors →"
          />
          <TrustTile
            label="India payroll context"
            desc="Shortlists consider PF / ESI / PT / TDS scope and multi‑state complexity—not just feature checkboxes."
            href="/categories/payroll-india"
            linkLabel="Payroll category →"
          />
          <TrustTile
            label="Demo checklist for edge cases"
            desc="We surface what to validate (arrears, reversals, cutoffs, exports) so demos focus on risk."
            href="/recommend"
            linkLabel="Get my shortlist →"
          />
        </div>

        <div className="mt-4 text-sm text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text)]">Verified</span> = key metadata checked against evidence links + freshness date shown.
        </div>
      </HomeSection>

      {/* 3) Problem framing */}
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
          <Link className="text-sm font-medium text-[var(--link)] hover:text-[var(--link-hover)]" href="/compare">
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
                <ButtonLink href="/categories/payroll-india" variant="secondary" size="md" className="w-full justify-center">
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

function TrustTile({
  label,
  desc,
  href,
  linkLabel,
}: {
  label: string;
  desc: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
      <div className="text-sm font-semibold text-[var(--text)]">{label}</div>
      <div className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{desc}</div>
      <div className="mt-3">
        <Link className="text-sm font-medium text-[var(--link)] hover:text-[var(--link-hover)]" href={href}>
          {linkLabel}
        </Link>
      </div>
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
    <>
      {/* Fit card */}
      <div className="absolute bg-white p-8 radius-card shadow-float w-80 z-20 animate-float border border-slate-100 left-10 top-20">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Keka HR</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Enterprise Plan</p>
          </div>
          <div className="w-8 h-8 rounded-full shadow-sm bg-[#FF9933] flex items-center justify-center text-white text-[10px] font-bold">
            IN
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-extrabold text-slate-900 tracking-tighter">92</span>
            <span className="text-sm font-semibold text-slate-400 mb-2">/100 Fit</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: "92%" }} />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Payroll Compl.</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md text-xs">Full Match</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Budget</span>
            <span className="text-slate-900 font-bold">₹120/emp</span>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Link href="/tools" className="flex-1 bg-slate-900 text-white text-xs font-bold py-3 rounded-xl hover:bg-slate-800 transition text-center">
            View Details
          </Link>
          <button type="button" className="bg-slate-100 text-slate-600 p-3 rounded-xl hover:bg-slate-200 transition" aria-label="More">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Compliance card */}
      <div className="absolute bg-slate-900 p-8 radius-card shadow-2xl w-80 z-10 animate-float-delay right-0 bottom-20 opacity-95">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-white text-lg">Compliance Check</h3>
          <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
        </div>

        <div className="space-y-4">
          {[
            "PF Calculation",
            "Form-16 Auto",
            "ESI + PT",
          ].map((label) => (
            <div key={label} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex items-center justify-between">
              <span className="text-slate-300 text-sm">{label}</span>
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ))}
        </div>

        <div className="mt-6 text-xs text-slate-400">Evidence-backed checks (PF/ESI/PT/TDS) — verify during demos.</div>
      </div>
    </>
  );
}
