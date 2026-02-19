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

export default async function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      {/* 1) Hero + decision snapshot */}
      <HomeSection className="pt-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.6rem] border border-[rgba(148,163,184,0.20)] bg-[radial-gradient(980px_560px_at_50%_-14%,rgba(16,185,129,0.20),transparent_66%),radial-gradient(980px_560px_at_12%_10%,rgba(29,78,216,0.12),transparent_64%),linear-gradient(to_bottom,#0b1226,#020617)] shadow-[0_28px_140px_rgba(0,0,0,0.46)] ring-1 ring-white/10">
          <div className="pointer-events-none absolute inset-0 opacity-50 mix-blend-screen">
            <div className="absolute inset-0 bg-neural-dots" />
            <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
          </div>

          <div className="relative grid grid-cols-1 gap-10 p-7 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14">
            <div className="lg:col-span-7">
              <MotionFadeIn delay={0.02}>
                <div className="mx-auto text-center text-xs font-semibold tracking-[0.14em] text-[rgba(226,232,240,0.78)]">
                  DECISION INTELLIGENCE FOR INDIA HR SOFTWARE
                </div>
              </MotionFadeIn>

              <MotionFadeIn delay={0.06}>
                <h1 className="mx-auto mt-4 max-w-5xl text-center text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-[var(--text)] sm:text-6xl">
                  Shortlist India-ready HRMS & Payroll — without month-end surprises.
                </h1>
              </MotionFadeIn>

              <MotionFadeIn delay={0.10}>
                <p className="mx-auto mt-5 max-w-4xl text-center text-lg leading-8 text-[rgba(226,232,240,0.86)] sm:text-xl">
                  Get 3–5 best-fit tools based on headcount, modules, integrations, and multi-state compliance — with fit scores, evidence links, and a demo checklist that catches PF/ESI/PT/TDS edge cases.
                </p>
              </MotionFadeIn>

              <MotionFadeIn delay={0.14}>
                <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start">
                <div className="flex w-full flex-col gap-3 sm:w-auto">
                  {/* Above-fold inline email CTA */}
                  <form action="/recommend" method="get" className="flex w-full flex-col gap-3 sm:flex-row">
                    <input type="hidden" name="source" value="hero_email" />
                    <input
                      className="h-14 w-full rounded-[var(--radius-sm)] border border-[rgba(16,185,129,0.35)] bg-[rgba(2,6,23,0.38)] px-5 text-base text-[var(--text)] placeholder:text-[rgba(148,163,184,0.95)] shadow-[0_18px_60px_rgba(16,185,129,0.10)] backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(16,185,129,0.55)] sm:min-w-[360px]"
                      type="email"
                      name="email"
                      required
                      placeholder="Work email (we'll send the shortlist)"
                      autoComplete="email"
                      aria-label="Work email"
                    />
                    <button
                      type="submit"
                      className="inline-flex h-14 w-full items-center justify-center rounded-[var(--radius-sm)] bg-gradient-to-b from-emerald-400 to-emerald-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_14px_46px_rgba(16,185,129,0.18)] transition-all duration-200 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.28),0_0_22px_rgba(16,185,129,0.42),0_18px_60px_rgba(16,185,129,0.18)] hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:w-auto"
                    >
                      Get my shortlist
                    </button>
                  </form>

                  <TrackedButtonLink
                    event="secondary_cta_click"
                    href="/tools"
                    variant="secondary"
                    size="lg"
                    className="w-full justify-center"
                  >
                    Explore tools
                  </TrackedButtonLink>

                  <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-[rgba(226,232,240,0.74)]">
                    <span>Takes 60 seconds</span>
                    <span className="text-[var(--text-muted)]">•</span>
                    <span>No vendor spam</span>
                    <span className="text-[var(--text-muted)]">•</span>
                    <span>No paid ranking</span>
                  </div>
                </div>

                <Link
                  href="/tools?category=payroll"
                  className="pt-1 text-center text-sm font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 transition-all duration-200 hover:text-violet-100 hover:decoration-[rgba(124,77,255,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:text-left"
                >
                  Browse HRMS & payroll tools →
                </Link>
              </div>
              </MotionFadeIn>

              <MotionFadeIn delay={0.18}>
                <div className="u-glass-strong mx-auto mt-7 max-w-4xl rounded-[var(--radius-md)] border border-[rgba(148,163,184,0.20)] px-5 py-4 text-center text-sm leading-6 text-[rgba(226,232,240,0.76)]">
                  Trusted by HR leaders in 20–1000 employee Indian orgs evaluating multi-state compliance risk.
                </div>
              </MotionFadeIn>

            </div>

            <div className="lg:col-span-5">
              <MotionFadeIn delay={0.16} className="mx-auto max-w-md">
                <DecisionSnapshotCard />
              </MotionFadeIn>
            </div>
          </div>
        </div>
      </HomeSection>

      {/* 2) HRSignal Coverage Snapshot */}
      <HomeSection className="pt-0 border-t border-[var(--border-soft)]">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
          <div className="text-base font-semibold text-[var(--text)]">HRSignal Coverage Snapshot</div>
          <div className="mt-1 text-sm text-[var(--text-muted)]">Static snapshot of marketplace coverage (v1).</div>

          {/* 2x2 grid + last full-width freshness card */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[
              { label: "Payroll vendors", value: "12+" },
              { label: "India-verified listings", value: "25+" },
              { label: "Evidence links tracked", value: "120+" },
              { label: "Categories", value: "8" },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-5"
              >
                <div className="text-5xl font-extrabold tracking-tight text-emerald-200 sm:text-6xl" style={{ textShadow: "0 0 16px rgba(16,185,129,0.25)" }}>{m.value}</div>
                <div className="mt-2 text-xs font-semibold text-[var(--text-muted)]">{m.label}</div>
              </div>
            ))}

            <div className="col-span-2 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-5xl font-extrabold tracking-tight text-[var(--text)] sm:text-6xl">Last verified</div>
                  <div className="mt-2 text-xs font-semibold text-[var(--text-muted)]">Freshness signal</div>
                </div>
                <div className="text-sm text-[var(--text-muted)]">We show verification recency so you can spot what needs re-checking.</div>
              </div>
            </div>
          </div>
        </div>
      </HomeSection>

      {/* 2.5) Trust signals + social proof */}
      <HomeSection className="pt-0 border-t border-[var(--border-soft)]">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <StatsBar
              items={[
                { label: "HR leaders", value: 200, suffix: "+", detail: "Using HRSignal checklists + scoring" },
                { label: "Evidence links", value: 120, suffix: "+", detail: "Docs, pricing pages, compliance notes" },
                { label: "India-ready listings", value: 25, suffix: "+", detail: "Verified/updated recency shown" },
                { label: "Categories", value: 8, detail: "Payroll, HRMS, ATS, more" },
              ]}
              title="Trusted by 200+ HR leaders"
              subtitle="Social proof + verification signals (v1)."
            />
          </div>
          <div className="lg:col-span-5">
            <TrustBadges
              badges={[
                { title: "SOC 2", subtitle: "Security posture", tone: "security" },
                { title: "GDPR-ready", subtitle: "Privacy-by-design", tone: "privacy" },
                { title: "Evidence links", subtitle: "Verify claims", tone: "process" },
                { title: "No paid ranking", subtitle: "Buyer-first", tone: "neutral" },
              ]}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <TestimonialCard
            t={{
              quote: "The shortlist reasons + demo checklist helped us catch PT/PT slab edge cases early.",
              name: "HR Ops Lead",
              title: "Payroll transformation",
              company: "India mid-market",
            }}
          />
          <TestimonialCard
            t={{
              quote: "The ‘verified vs validate’ framing made vendor demos way more productive.",
              name: "Head of HR",
              title: "People & compliance",
              company: "Multi-state services",
            }}
          />
          <TestimonialCard
            t={{
              quote: "Finally a directory that shows evidence links instead of just marketing copy.",
              name: "Founder",
              title: "Ops",
              company: "Growing startup",
            }}
          />
        </div>
      </HomeSection>

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
              className="text-sm font-semibold text-emerald-200 underline decoration-[rgba(16,185,129,0.30)] underline-offset-4 hover:text-emerald-100 hover:decoration-[rgba(16,185,129,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
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
                <div className="mt-4 text-sm font-semibold text-emerald-200 transition-all duration-200 group-hover:text-emerald-100 group-hover:[text-shadow:0_0_18px_rgba(16,185,129,0.35)]">Read →</div>
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
    <div className="u-glass-strong u-card-hover rounded-[var(--radius-lg)] border border-[var(--border-soft)] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.34)]">
      <div className="text-xs font-semibold tracking-wide text-[rgba(226,232,240,0.68)]">
        Decision snapshot · India payroll context
      </div>
      <div className="mt-2 text-base font-semibold text-[var(--text)]">Payroll &amp; Compliance shortlist preview</div>

      <div className="mt-5 rounded-[var(--radius-md)] border border-[rgba(148,163,184,0.18)] bg-[rgba(2,6,23,0.35)] p-4">
        <div className="flex items-end justify-between gap-3">
          <div className="text-xs font-semibold text-[rgba(226,232,240,0.66)]">Fit score</div>
          <div
            className="text-5xl font-extrabold tracking-tight text-emerald-300 sm:text-6xl"
            style={{ textShadow: "0 0 18px rgba(16,185,129,0.38)" }}
          >
            92 / 100
          </div>
        </div>
        <div className="mt-2 text-xs leading-5 text-[rgba(226,232,240,0.62)]">
          Based on compliance depth + integration coverage + support signals.
        </div>
      </div>

      <div className="mt-5 space-y-3 text-sm leading-7 text-[rgba(226,232,240,0.70)]">
        <div>• Matches multi-state payroll + branch complexity</div>
        <div>• Covers PF / ESI / PT / TDS workflows</div>
        <div>• Claims backed by evidence links (docs + pricing)</div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-[rgba(226,232,240,0.60)]">
        <span>PEPM</span>
        <span className="h-1 w-1 rounded-full bg-[rgba(148,163,184,0.40)]" aria-hidden="true" />
        <span>India-ready</span>
        <span className="h-1 w-1 rounded-full bg-[rgba(148,163,184,0.40)]" aria-hidden="true" />
        <span>Evidence-backed</span>
      </div>

      <div className="mt-5 text-sm leading-7 text-[rgba(226,232,240,0.66)]">Privacy-first. No automatic vendor sharing.</div>
    </div>
  );
}
