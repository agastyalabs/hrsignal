export const dynamic = "force-dynamic";

import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ButtonLink } from "@/components/ui/Button";
import { HomeSection } from "@/components/marketing/HomeSection";
import { TalkToPayrollSpecialistSection } from "@/components/conversion/TalkToPayrollSpecialistSection";
import { CategoryCard } from "@/components/catalog/CategoryCard";

export default async function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      {/* 1) Hero + decision snapshot */}
      <HomeSection className="pt-10 sm:pt-14">
        <div className="rounded-[1.2rem] border border-[var(--border-soft)] bg-[var(--surface-1)]">
          <div className="grid grid-cols-1 gap-8 p-5 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
            <div className="lg:col-span-7">
              <h1 className="text-4xl font-extrabold leading-[1.04] tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
                Shortlist India-ready HRMS & Payroll — without month-end surprises.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-muted)]">
                Get 3–5 best-fit tools based on headcount, modules, integrations, and multi-state compliance — with fit scores, evidence links, and a demo checklist that catches PF/ESI/PT/TDS edge cases.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-col gap-2">
                  <ButtonLink href="/recommend" size="lg" className="w-full justify-center sm:w-auto">
                    Get my India-ready shortlist
                  </ButtonLink>
                  <div className="text-xs text-[var(--text-muted)]">Takes 60 seconds · No vendor spam · No paid ranking</div>
                </div>

                <Link
                  href="/tools?category=payroll"
                  className="text-sm font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 hover:text-violet-100 hover:decoration-[rgba(124,77,255,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  Browse HRMS & payroll tools →
                </Link>
              </div>

              <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-muted)]">
                Used by HR leaders evaluating multi-state payroll in India.
              </div>

            </div>

            <div className="lg:col-span-5">
              <DecisionSnapshotCard />
            </div>
          </div>
        </div>
      </HomeSection>

      {/* 2) HRSignal Coverage Snapshot */}
      <HomeSection className="pt-0">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
          <div className="text-sm font-semibold text-[var(--text)]">HRSignal Coverage Snapshot</div>
          <div className="mt-1 text-sm text-[var(--text-muted)]">Static snapshot of marketplace coverage (v1).</div>

          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
            {[
              { label: "Payroll vendors", value: "12+" },
              { label: "India-verified listings", value: "25+" },
              { label: "Evidence links tracked", value: "120+" },
              { label: "Categories", value: "8" },
              { label: "Freshness signals", value: "Last verified" },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4"
              >
                <div className="text-lg font-semibold text-[var(--text)]">{m.value}</div>
                <div className="mt-1 text-xs font-semibold text-[var(--text-muted)]">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </HomeSection>

      {/* 3) Authority + specialist CTA */}
      <HomeSection className="pt-0">
        <TalkToPayrollSpecialistSection href="/recommend" />
      </HomeSection>

      {/* 3) Browse by category */}
      <HomeSection className="pt-0">
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

      {/* 4) Trust & proof strip */}
      <HomeSection className="pt-0">
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
            href="/categories/payroll"
            linkLabel="Payroll category →"
          />
          <TrustTile
            label="Demo checklist for edge cases"
            desc="We surface what to validate (arrears, reversals, cutoffs, exports) so demos focus on risk."
            href="/recommend"
            linkLabel="Get shortlist →"
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
        <Link className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]" href={href}>
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
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-5">
      <div className="text-xs font-medium tracking-wide text-[var(--text-muted)]">
        Decision snapshot · India payroll context
      </div>
      <div className="mt-2 text-base font-medium text-[var(--text)]">Payroll &amp; Compliance shortlist preview</div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="text-sm font-medium text-[var(--text-muted)]">Fit score</div>
        <div className="text-3xl font-extrabold tracking-tight text-[var(--text)]">92 / 100</div>
      </div>

      <div className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--text-muted)]">
        <div>• Matches multi-state payroll + branch complexity</div>
        <div>• Covers PF / ESI / PT / TDS workflows</div>
        <div>• Claims backed by evidence links (docs + pricing)</div>
        <div>• Demo checklist flags edge cases (arrears, reversals, cutoffs)</div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-[var(--text-muted)]">
        <span className="rounded-[999px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1">PEPM</span>
        <span className="rounded-[999px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1">India-ready</span>
        <span className="rounded-[999px] border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1">Freshness verified</span>
      </div>

      <div className="mt-4 text-sm text-[var(--text-muted)]">Privacy-first. No automatic vendor sharing.</div>
    </div>
  );
}
