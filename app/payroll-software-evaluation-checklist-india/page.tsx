import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { ChecklistDownloadCard } from "@/components/lead/ChecklistDownloadCard";

export const metadata: Metadata = {
  title: "Payroll Software Evaluation Checklist (India) — Compliance, Multi‑State Risk & Pricing | HRSignal",
  description:
    "A buyer-first payroll software evaluation checklist for India: PF/ESI/PT/TDS compliance, multi-state risk controls, pricing traps, and a vendor comparison framework.",
  alternates: { canonical: "https://hrsignal.vercel.app/payroll-software-evaluation-checklist-india" },
};

export default function PayrollEvaluationChecklistIndiaPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Payroll Software Evaluation Checklist (India)",
    description:
      "A buyer-first payroll software evaluation checklist for India: PF/ESI/PT/TDS compliance, multi-state risk controls, pricing traps, and a vendor comparison framework.",
    author: { "@type": "Organization", name: "HRSignal" },
    publisher: {
      "@type": "Organization",
      name: "HRSignal",
      logo: { "@type": "ImageObject", url: "https://hrsignal.vercel.app/brand/hrsignal-logo.svg" },
    },
    mainEntityOfPage: "https://hrsignal.vercel.app/payroll-software-evaluation-checklist-india",
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <SiteHeader />

      <main className="py-10 sm:py-14">
        <Container className="max-w-4xl">
          <header className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
              Payroll software evaluation checklist (India)
            </h1>
            <p className="mt-3 max-w-[80ch] text-sm leading-7 text-[var(--text-muted)]">
              India payroll buying rarely fails because a vendor can’t “run payroll”. It fails because your month-end reality doesn’t match the demo:
              state-wise statutory mapping, arrears and reversals, audit trails, integration inputs, and reconciliation outputs. This long-form guide
              gives you a practical checklist and a comparison framework you can use across HR and Finance.
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
              <ButtonLink href="/recommend" size="lg" className="w-full justify-center sm:w-auto">
                Get my India-ready shortlist
              </ButtonLink>
              <Link
                href="/categories/payroll-india"
                className="inline-flex h-12 w-full items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto"
              >
                Read the Payroll India guide
              </Link>
            </div>

            <div className="mt-4 text-xs text-[var(--text-muted)]">
              Internal links: <Link className="underline" href="/vendors">Vendors</Link> •{" "}
              <Link className="underline" href="/india-payroll-risk-checklist">Free risk checklist PDF</Link>
            </div>
          </header>

          <div className="mt-8 space-y-6">
            {/* 1) Why payroll software evaluation fails in India */}
            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">
                1) Why payroll software evaluation fails in India
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                Most buyers evaluate payroll like a feature list: salary processing, leave integration, “PF/ESI supported”, “TDS supported”. That’s
                necessary, but it’s not sufficient. The failure modes in India are mostly operational and evidentiary:
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• <span className="font-semibold text-[var(--text)]">Edge cases</span> (arrears, reversals, cutoffs, transfers) aren’t tested in the demo.</li>
                <li>• <span className="font-semibold text-[var(--text)]">Statutory outputs</span> are not inspected (registers/challans/returns/reconciliation exports).</li>
                <li>• <span className="font-semibold text-[var(--text)]">Audit trails</span> and maker-checker workflows are assumed, not verified.</li>
                <li>• <span className="font-semibold text-[var(--text)]">Integrations</span> are oversimplified — “we integrate” often means CSV import and manual exceptions.</li>
                <li>• <span className="font-semibold text-[var(--text)]">Pricing</span> is compared on the wrong unit (PEPM vs bundles vs setup/support add-ons).</li>
              </ul>
              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
                The right approach is to evaluate payroll software as a month-end risk system. You want evidence, repeatable controls, and a vendor
                that can demonstrate outputs for your scenario.
              </p>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Practical rule</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                If a vendor can’t run one realistic month-end scenario end-to-end during evaluation (inputs → approvals → payroll run → statutory
                outputs → reconciliation export), treat the gap as a risk that will surface after you’ve already committed.
              </p>
            </Card>

            {/* 2) Compliance checklist */}
            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">
                2) Compliance checklist (PF/ESI/PT/TDS)
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                “Supported” is not a compliance answer. Compliance is a workflow and output question: what inputs does the system need, what rules
                does it apply, and what artifacts does it produce that your team can reconcile and defend.
              </p>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">PF (Provident Fund)</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• Can you model wage component inclusion/exclusion rules and caps for your salary structures?</li>
                <li>• Does the tool handle retroactive changes (arrears) without breaking contributions?</li>
                <li>• Show the PF registers/export path used at month-end (not screenshots).</li>
              </ul>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">ESI</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• Validate eligibility threshold logic and how exceptions are handled during transfers/LOP changes.</li>
                <li>• Ask for evidence: what ESI outputs can be exported and how does reconciliation work?</li>
              </ul>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">PT (Professional Tax)</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• PT varies by state — confirm state-wise slab handling and multi-location mappings.</li>
                <li>• Ask: what happens when an employee moves states mid-month?</li>
              </ul>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">TDS</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• Confirm proof collection workflow (if included) and audit logs for edits.</li>
                <li>• Validate reporting exports and how year-end adjustments are handled.</li>
              </ul>

              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
                For a deeper buyer-oriented walkthrough, see the <Link className="underline" href="/categories/payroll-india">Payroll India category guide</Link>.
              </p>
            </Card>

            {/* Embed checklist lead magnet mid-page */}
            <ChecklistDownloadCard sourcePage="payroll-india" />

            {/* 3) Multi-state risk controls */}
            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">3) Multi-state risk controls</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                Multi-state payroll is the fastest way to turn “works in demo” into month-end chaos. Your evaluation should include controls that
                reduce exception handling and improve traceability.
              </p>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Controls to validate</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• State-wise rule configuration is explicit (not hidden behind support tickets).</li>
                <li>• Transfers and location changes have a visible audit trail.</li>
                <li>• Maker-checker approvals exist for changes that affect statutory outputs.</li>
                <li>• Reconciliation exports are available for Finance (not just payslips).</li>
              </ul>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Demo scenario (use this verbatim)</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                Pick one employee who transfers from State A to State B and has an arrears adjustment in the same month. Ask the vendor to run:
                attendance import → salary change → payroll run → statutory outputs → reconciliation export. If any step is “we’ll handle it later”,
                log it as a risk item.
              </p>
            </Card>

            {/* 4) Pricing traps */}
            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">4) Pricing traps (PEPM vs bundled)</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                Pricing looks simple until implementation begins. In India payroll, “pricing” often splits across PEPM, bundles, add-ons, setup
                fees, and support tiers. Evaluations fail when buyers compare only the visible number.
              </p>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Common traps</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• PEPM excluding payroll compliance add-ons (TDS workflows, contractor payouts, statutory reporting).</li>
                <li>• Bundled pricing that hides future step-ups when you add modules or locations.</li>
                <li>• One-time setup that is actually multiple phases (migration + parallel run + policy setup).</li>
                <li>• Support SLA tiers that change response times during month-end.</li>
              </ul>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">What to request</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                Ask for a one-page commercial summary: unit price, minimums, setup fees, add-ons, support SLA, and the exact definition of
                “employee” and “active” for billing. If you can’t get this during evaluation, assume it will be worse later.
              </p>
            </Card>

            {/* 5) Vendor comparison framework */}
            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">5) Vendor comparison framework</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                A good comparison framework makes evaluation repeatable across stakeholders. The goal isn’t to find a “perfect” vendor — it’s to
                reduce unknowns and choose the vendor with the best evidence for your risk profile.
              </p>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Scoreboard (simple)</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• Compliance evidence: outputs demonstrated and exported for your scenario</li>
                <li>• Audit readiness: approvals, logs, roles, traceability</li>
                <li>• Integration clarity: attendance inputs, accounting exports, APIs vs file flows</li>
                <li>• Freshness: last verified signals and sources you can cite</li>
                <li>• Commercial clarity: unit pricing, add-ons, setup/support scope</li>
              </ul>

              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
                If you’re shortlisting across vendors, browse the directory at <Link className="underline" href="/vendors">/vendors</Link> and use
                <Link className="underline" href="/recommend"> /recommend</Link> to generate an explainable shortlist.
              </p>
            </Card>

            {/* 6) CTA + internal links */}
            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">6) What to do next</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                Use this checklist to narrow to 2–3 vendors, then run a realistic month-end scenario in demos. For a faster path, HRSignal can
                generate a deterministic shortlist based on your complexity context.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <ButtonLink href="/recommend" size="md" className="w-full justify-center sm:w-auto">
                  Get my India-ready shortlist
                </ButtonLink>
                <Link
                  href="/india-payroll-risk-checklist"
                  className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto"
                >
                  Download the free PDF checklist
                </Link>
              </div>
            </Card>

            <div className="border-t border-[var(--border-soft)] pt-6 text-xs text-[var(--text-muted)]">
              Disclaimer: This guide is educational. Always validate statutory applicability, outputs, and audit evidence with your advisors.
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
