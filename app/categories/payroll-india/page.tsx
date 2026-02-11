import Link from "next/link";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { ChecklistDownloadCard } from "@/components/lead/ChecklistDownloadCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "India Payroll Software (2026) — Complexity, Compliance & Shortlisting | HRSignal",
  description:
    "Understand India payroll complexity (multi-state compliance, PF/ESI/PT/TDS) and compare top payroll vendors. Get a deterministic shortlist with HRSignal Readiness Score™.",
  alternates: { canonical: "https://hrsignal.vercel.app/categories/payroll-india" },
};

const TOP_VENDORS = [
  {
    name: "Keka",
    slug: "keka",
    readiness: 82,
    bestFor: "SMB–Mid teams that want HRMS + payroll with strong India context.",
    watch: "Validate multi-state edge cases and exports for your accounting workflow.",
  },
  {
    name: "greytHR",
    slug: "greythr",
    readiness: 78,
    bestFor: "SMB payroll + statutory basics with wide adoption.",
    watch: "Confirm integration method (API vs files) and month-end controls.",
  },
  {
    name: "Freshteam (Freshworks)",
    slug: "freshteam",
    readiness: 66,
    bestFor: "Hiring + core HR workflows; payroll suitability depends on your statutory scope.",
    watch: "Don’t confuse with Freshservice; validate payroll/compliance scope explicitly.",
  },
] as const;

function RiskChecklist() {
  const items = [
    "Run arrears + reversals + cutoffs with real employee scenarios (not happy-path demos).",
    "Confirm PF/ESI/PT/TDS scope and state-wise mapping (registrations, exemptions, and outputs).",
    "Verify statutory outputs and reconciliation exports (challans/returns/registers where applicable).",
    "Ask for audit trail evidence: role-based access, approvals/maker-checker, and edit history.",
    "Validate integrations: attendance inputs + accounting exports (API/webhooks vs file/manual).",
    "Clarify implementation plan: data migration, parallel run, and post go-live support SLA.",
  ];

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-5">
      <div className="text-sm font-semibold text-[var(--text)]">India payroll risk checklist</div>
      <div className="mt-1 text-sm text-[var(--text-muted)]">
        Use this to keep your evaluation focused on month-end risk — where payroll tools usually fail.
      </div>
      <ul className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
        {items.map((x) => (
          <li key={x}>• {x}</li>
        ))}
      </ul>
    </div>
  );
}

function Faq() {
  const faqs = [
    {
      q: "What makes India payroll more complex than a feature checklist?",
      a: "Because compliance is contextual: state-wise rules, exemptions, registrations, month-end controls, and statutory outputs matter more than generic modules.",
    },
    {
      q: "How do multi-state teams get burned during implementation?",
      a: "Teams often discover gaps late: incorrect state mapping, register output mismatches, weak arrears/reversal handling, or reconciliation issues with accounting exports.",
    },
    {
      q: "Is PF/ESI/PT/TDS supported by most payroll tools?",
      a: "Many tools claim coverage, but the risk is in edge cases and evidence. Always validate outputs, audit trail, and month-end workflows against your scenarios.",
    },
    {
      q: "Why does deterministic scoring matter for buyers?",
      a: "Deterministic scoring is explainable. You can see which signals (compliance tags, evidence links, integrations, freshness) drive a score and what needs validation.",
    },
    {
      q: "How should I shortlist vendors quickly?",
      a: "Start with a clear complexity context (states, PF/ESI applicability, contractors, frequency), then compare vendors on evidence depth and verification freshness — not marketing claims.",
    },
  ];

  return (
    <div className="space-y-3">
      {faqs.map((f) => (
        <details key={f.q} className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-5 py-4">
          <summary className="cursor-pointer select-none text-sm font-semibold text-[var(--text)]">{f.q}</summary>
          <div className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{f.a}</div>
        </details>
      ))}
    </div>
  );
}

export default function PayrollIndiaPillarPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      <main className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">Payroll in India: complexity, compliance, and how to shortlist vendors</h1>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                India payroll software is not a feature comparison. Real risk shows up at month-end: multi-state statutory mapping, arrears and
                reversals, and the quality of outputs you can reconcile.
              </p>

              <div className="mt-5">
                <ButtonLink href="/recommend" size="lg" className="w-full justify-center sm:w-auto">
                  Get my India payroll shortlist
                </ButtonLink>
              </div>

              <div className="mt-4 text-xs text-[var(--text-muted)]">
                Built for buyers evaluating PF/ESI/PT/TDS scope, state complexity, and verification signal quality.
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[var(--text)]">What is India payroll complexity?</h2>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  “Payroll complexity” in India usually means the gap between a clean demo and your real month-end. Most tools can compute a
                  salary slip for a straightforward scenario. The hard parts are the exceptions: employees moving across states, changing wage
                  components, retroactive LOP updates, arrears, mid-cycle corrections, multiple entities, and how statutory outputs reconcile.
                </p>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  Buyers also face a second kind of complexity: signal quality. Two vendors may claim the same statutory coverage, but differ
                  drastically in evidence depth, freshness of verification, integration visibility, and audit readiness. If your team is small,
                  a vendor with incomplete signals becomes a hidden implementation cost.
                </p>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  HRSignal treats India payroll as a decision-risk problem, not a checklist. That’s why we show evidence links, verification
                  depth, and freshness signals — and use deterministic scoring so you can understand exactly what drives a ranking.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[var(--text)]">Multi-state compliance issues (and why they matter)</h2>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  Multi-state payroll is where most “it works” assumptions break. State-wise mappings impact PF/ESI/PT applicability, exemptions,
                  registration details, and the outputs you produce for audits and filings. Even if your headcount is modest, multi-state rules
                  create edge-case risk because exceptions multiply: branches, transfers, remote hires, contractors, and different wage structures.
                </p>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  In practice, multi-state success depends on whether a vendor can demonstrate correct outputs for your scenario — not whether they
                  have a generic “multi-state” checkbox. The evaluation should include: a month-end run with real components, a statutory output
                  walk-through, and reconciliation exports your finance team can verify.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[var(--text)]">PF/ESI/PT/TDS risks to validate</h2>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  Statutory scope is often presented as “supported” — but buyers should treat it as a workflow and evidence question. PF and ESI
                  complexity comes from wage component inclusion/exclusion, limits, employee eligibility, and retroactive changes. PT varies by
                  state and can have slabs and rule nuances. TDS brings its own reporting and reconciliation expectations.
                </p>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  The biggest risk is not that a vendor lacks a feature — it’s that outputs don’t match expectations during audits, corrections,
                  or month-end exceptions. If your payroll process has arrears/reversals, maker-checker approvals, or data imports from attendance
                  systems, validate those with evidence and scenarios.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[var(--text)]">Why deterministic scoring matters</h2>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  Buyers don’t just need a “top vendor” list — they need a trustworthy way to reason about tradeoffs. Deterministic scoring is
                  valuable because it is explainable and repeatable. If a vendor ranks higher, you can see which signals drove it (evidence depth,
                  integration visibility, compliance tags, freshness). And if a vendor ranks lower, you can see what needs validation rather than
                  assuming the vendor is “bad.”
                </p>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  This is especially important in India payroll because the cost of a wrong decision is not just switching software — it’s month-end
                  fire drills, audit risk, and operational drag. A score that hides its logic is a marketing artifact; a score that explains itself
                  is a decision tool.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[var(--text)]">Static comparison: top payroll vendors (India)</h2>
                <p className="text-sm text-[var(--text-muted)]">
                  A lightweight, static summary to start your evaluation. Always validate evidence and month-end scenarios.
                </p>

                <Card className="overflow-x-auto p-0">
                  <table className="min-w-[820px] w-full text-sm">
                    <thead className="bg-[var(--surface-1)]">
                      <tr className="border-b border-[var(--border-soft)]">
                        <th className="p-4 text-left text-xs font-semibold text-[var(--text-muted)]">Vendor</th>
                        <th className="p-4 text-left text-xs font-semibold text-[var(--text-muted)]">HRSignal Readiness Score™</th>
                        <th className="p-4 text-left text-xs font-semibold text-[var(--text-muted)]">Best for</th>
                        <th className="p-4 text-left text-xs font-semibold text-[var(--text-muted)]">Watch-outs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TOP_VENDORS.map((v) => (
                        <tr key={v.slug} className="border-b border-[var(--border-soft)] last:border-0 align-top">
                          <td className="p-4">
                            <Link
                              href={`/vendors/${v.slug}`}
                              className="font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 hover:text-violet-100"
                            >
                              {v.name}
                            </Link>
                          </td>
                          <td className="p-4">
                            <span className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
                              {v.readiness}/100
                            </span>
                          </td>
                          <td className="p-4 text-sm text-[var(--text-muted)]">{v.bestFor}</td>
                          <td className="p-4 text-sm text-[var(--text-muted)]">{v.watch}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>

                <div className="mt-4 text-xs text-[var(--text-muted)]">
                  Internal links: {TOP_VENDORS.map((v, idx) => (
                    <span key={v.slug}>
                      <Link
                        href={`/vendors/${v.slug}`}
                        className="font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 hover:text-violet-100"
                      >
                        {v.name}
                      </Link>
                      {idx < TOP_VENDORS.length - 1 ? " • " : ""}
                    </span>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[var(--text)]">Methodology: HRSignal Readiness Score™</h2>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  HRSignal Readiness Score™ is deterministic and explainable. It prioritizes India payroll signal quality: compliance depth, evidence
                  links, integration visibility, and freshness/verification indicators.
                </p>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  Read the full breakdown here: <Link href="/methodology" className="font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 hover:text-violet-100">How scoring works</Link>.
                </p>
              </section>

              <section className="space-y-3">
                <ChecklistDownloadCard sourcePage="payroll-india" />
              </section>

              <section className="space-y-3">
                <RiskChecklist />
              </section>

              <section className="space-y-3">
                <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
                  <div className="text-sm font-semibold text-[var(--text)]">Get my India payroll shortlist</div>
                  <div className="mt-1 text-sm text-[var(--text-muted)]">
                    Answer a few questions. We’ll shortlist 3–5 payroll-ready vendors with deterministic reasons and validation checkpoints.
                  </div>
                  <div className="mt-4">
                    <ButtonLink href="/recommend" size="md" className="w-full justify-center sm:w-auto">
                      Get my India payroll shortlist
                    </ButtonLink>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[var(--text)]">FAQ</h2>
                <Faq />
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[var(--text)]">Explore vendor profiles</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {TOP_VENDORS.map((v) => (
                    <Link
                      key={v.slug}
                      href={`/vendors/${v.slug}`}
                      className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 text-sm hover:bg-[var(--surface-2)]"
                    >
                      <div className="font-semibold text-[var(--text)]">{v.name}</div>
                      <div className="mt-1 text-sm text-[var(--text-muted)]">Readiness score context + verification signals.</div>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="text-xs text-[var(--text-muted)]">
                Disclaimer: This pillar page is educational and uses a static summary table. Always validate compliance scope, outputs, and evidence.
              </section>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
