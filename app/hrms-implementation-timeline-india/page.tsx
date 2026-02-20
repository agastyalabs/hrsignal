import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { ChecklistDownloadCard } from "@/components/lead/ChecklistDownloadCard";

export const metadata: Metadata = {
  title: "HRMS Implementation Timeline (India) — Phases, Payroll Cutover, Multi‑Location Rollout | HR Signal",
  description:
    "A practical, India-context guide to HRMS implementation timelines: phases, data migration risks, payroll cutover timing, multi-location rollout, common delays, and budget planning.",
  alternates: { canonical: "https://hrsignal.vercel.app/hrms-implementation-timeline-india" },
};

export default function HrmsImplementationTimelineIndiaPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "HRMS Implementation Timeline (India)",
    description:
      "A practical, India-context guide to HRMS implementation timelines: phases, data migration risks, payroll cutover timing, multi-location rollout, common delays, and budget planning.",
    author: { "@type": "Organization", name: "HRSignal" },
    publisher: {
      "@type": "Organization",
      name: "HRSignal",
      logo: { "@type": "ImageObject", url: "https://hrsignal.vercel.app/brand/hrsignal-logo.svg" },
    },
    mainEntityOfPage: "https://hrsignal.vercel.app/hrms-implementation-timeline-india",
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <SiteHeader />

      <main className="py-10 sm:py-14">
        <Container className="max-w-4xl">
          <header className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
              HRMS implementation timeline (India): a buyer-first guide
            </h1>
            <p className="mt-3 max-w-[80ch] text-sm leading-7 text-[var(--text-muted)]">
              HRMS implementations fail less because of “features” and more because of sequencing: data migration quality, payroll cutover timing,
              statutory scope validation, and multi-location process adoption. This guide breaks down a realistic India-first implementation
              timeline, where delays happen, and how to avoid month-end surprises.
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
              <ButtonLink href="/recommend" size="lg" className="w-full justify-center sm:w-auto">
                Get my shortlist
              </ButtonLink>
              <Link
                href="/categories/hrms"
                className="inline-flex h-12 w-full items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto"
              >
                Browse HRMS category
              </Link>
            </div>

            <div className="mt-4 text-xs text-[var(--text-muted)]">
              Internal links: <Link className="underline" href="/vendors">Vendors</Link> •{" "}
              <Link className="underline" href="/india-payroll-risk-checklist">Payroll risk checklist PDF</Link> •{" "}
              <Link className="underline" href="/payroll-software-evaluation-checklist-india">Payroll evaluation checklist</Link>
            </div>
          </header>

          <div className="mt-8 space-y-6">
            {/* 1) Typical HRMS implementation phases */}
            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">
                1) Typical HRMS implementation phases (India context)
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                A realistic HRMS implementation is not “turn on the system and invite users.” It’s a staged process where each phase reduces risk.
                India context adds two major dimensions: statutory compliance (especially if payroll is included) and multi-location policy
                variation. The best implementations treat HRMS as an operating system: clear data ownership, repeatable workflows, and auditable
                outputs.
              </p>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Phase A: Discovery + scope freeze (Week 0–1)</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• Define modules in v1 (Core HR, Attendance, Payroll, ATS, Performance).</li>
                <li>• Freeze policies you will implement now vs later (avoid boiling the ocean).</li>
                <li>• List integrations and define the “source of truth” for each dataset.</li>
              </ul>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Phase B: Data model + migrations (Week 1–3)</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• Design employee master fields, org structure, roles, and document templates.</li>
                <li>• Clean and map legacy data (Excel, older HRMS, payroll provider).</li>
                <li>• Run at least one dry-run migration and reconcile counts and critical fields.</li>
              </ul>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Phase C: Workflow setup + approvals (Week 2–4)</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• Configure leave policies, attendance rules, approval chains, and access control.</li>
                <li>• Validate audit trails, maker-checker (if used), and change logs.</li>
              </ul>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Phase D: Payroll build + parallel run (Week 3–6)</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                If payroll is part of the scope, treat it as a cutover project. The safest approach is a parallel run: process payroll in the new
                system in shadow mode while continuing your production payroll in the old system/provider for one cycle. The objective isn’t to
                get identical payslips; it’s to identify where rules, inputs, and outputs differ.
              </p>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Phase E: Go-live + stabilization (Week 6–8)</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• Roll out to employees and managers with clear workflows (requests, approvals, self-serve).</li>
                <li>• Stabilize month-end operations: exceptions, exports, statutory outputs, and reconciliation.</li>
                <li>• Lock down “change control” so policy edits don’t break payroll outputs unexpectedly.</li>
              </ul>
            </Card>

            {/* 2) Data migration risks */}
            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">2) Data migration risks</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                Data migration is where timelines silently die. Most teams underestimate how messy employee records are: inconsistent identifiers,
                missing dates, policy exceptions living in email threads, and salary structures that evolved over time. A fast migration that
                creates wrong data is worse than a slow migration that creates correct data.
              </p>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">High-risk datasets (treat as critical)</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• Employee identifiers, joining dates, PF/ESI applicability flags, and location mappings.</li>
                <li>• Salary structures (components, inclusions/exclusions), arrears history, and outstanding adjustments.</li>
                <li>• Attendance and leave balances (especially if you have multiple locations/shifts).</li>
                <li>• Approver mappings and role permissions (security incidents come from wrong permissions).</li>
              </ul>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Migration controls that prevent rework</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• One canonical spreadsheet template with validation rules (not 12 versions).</li>
                <li>• A reconciliation checklist: headcount, PF/ESI applicability counts, location counts, and sample payslip checks.</li>
                <li>• A “data freeze window” before go-live so changes don’t keep moving the target.</li>
              </ul>
            </Card>

            {/* Embed checklist lead magnet mid-page */}
            <ChecklistDownloadCard sourcePage="payroll-india" />

            {/* 3) Payroll cutover + compliance timing */}
            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">3) Payroll cutover + compliance timing</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                Payroll cutover is not just a date. It’s the moment your team becomes accountable for statutory outputs, reconciliation, and
                exception handling in the new system. The biggest timeline mistake is cutting over right before a high-stakes period (year-end
                adjustments, major policy changes, or large hiring waves).
              </p>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Recommended timing (practical)</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• Do a parallel run for at least one cycle before go-live.</li>
                <li>• Cut over when your team can support exceptions (avoid holiday-heavy windows).</li>
                <li>• Validate PF/ESI/PT/TDS outputs using a real scenario, not a sample dataset.</li>
              </ul>

              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
                If you’re still selecting vendors, use the <Link className="underline" href="/payroll-software-evaluation-checklist-india">payroll software evaluation checklist</Link> to standardize your demo and output validation.
                For India payroll complexity context and vendor shortlisting, also read the <Link className="underline" href="/categories/payroll-india">Payroll India guide</Link>.
              </p>
            </Card>

            {/* 4) Multi-location rollout strategy */}
            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">4) Multi-location rollout strategy</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                Multi-location rollouts fail when teams try to launch everything everywhere at once. Locations differ in attendance practices,
                shift rules, managers’ comfort with approvals, and even device connectivity. A staged rollout keeps adoption high and exceptions
                manageable.
              </p>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">A rollout pattern that works</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• Start with HQ + one representative site (not the easiest site).</li>
                <li>• Stabilize attendance inputs first, then payroll outputs.</li>
                <li>• Expand in waves, using a checklist-driven onboarding for each location.</li>
              </ul>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Where tools differ</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                Some HRMS vendors support per-location policies, shift rules, and device integrations natively. Others require manual workarounds.
                The right evaluation question is: how many “special cases” will your team be managing after go-live?
              </p>
            </Card>

            {/* 5) Common delays */}
            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">5) Common delays (and how to avoid them)</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                Most implementation delays are predictable. The premium move is to design around them: clarify ownership, standardize inputs, and
                reduce cross-team ambiguity.
              </p>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Delay 1: Scope creep</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                HRMS is tempting to customize. Resist that in v1. Each new policy variant and workflow branch adds testing burden and extends
                stabilization time.
              </p>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Delay 2: Data readiness</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                If HR and Finance are not aligned on identifiers, salary structures, and location mapping, payroll cutover will slip. Fix the data
                model before you argue about UI.
              </p>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Delay 3: Integration unknowns</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                “Integration” often means file-based import/export. Validate whether APIs/webhooks exist, what the failure modes are, and who owns
                ongoing maintenance.
              </p>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">Delay 4: Training and adoption</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                Managers drive approvals; employees drive data quality (attendance, documents). If you don’t train them, the HRMS becomes a data
                sink, not a system.
              </p>
            </Card>

            {/* 6) Budget planning */}
            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">6) Budget planning (PEPM vs one-time)</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                Budget planning fails when buyers treat PEPM as the full cost. Your total cost includes setup, migration, training, support, and
                operational time spent handling exceptions. On-prem or hybrid deployments add their own one-time and AMC-like costs.
              </p>

              <h3 className="mt-5 text-base font-semibold text-[var(--text)]">A simple budget model</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• Subscription (PEPM or bundled) + minimums</li>
                <li>• One-time setup/migration (and what is included)</li>
                <li>• Add-ons (modules, integrations, compliance features)</li>
                <li>• Support SLA tier (month-end response times)</li>
              </ul>

              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
                If payroll is in-scope, download the <Link className="underline" href="/india-payroll-risk-checklist">free payroll risk checklist PDF</Link> and use it to validate what you’re paying for.
              </p>
            </Card>

            {/* 7) Next steps + internal links */}
            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">7) What to do next</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                Use this timeline to pressure-test vendor promises. Ask vendors to commit to a realistic sequencing plan: data → workflows →
                parallel run → cutover → stabilization. Then pick 2–3 vendors and compare based on evidence and verification signals.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <ButtonLink href="/recommend" size="md" className="w-full justify-center sm:w-auto">
                  Get my shortlist
                </ButtonLink>
                <Link
                  href="/vendors"
                  className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto"
                >
                  Browse vendors
                </Link>
              </div>
              <div className="mt-3 text-xs text-[var(--text-muted)]">
                Related: <Link className="underline" href="/payroll-software-evaluation-checklist-india">Payroll evaluation checklist</Link> •{" "}
                <Link className="underline" href="/categories/hrms">HRMS category</Link>
              </div>
            </Card>

            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <div className="text-sm font-semibold text-[var(--text)]">Related decision guides</div>
              <div className="mt-1 text-sm text-[var(--text-muted)]">Continue through the cluster to plan evaluation and rollout together.</div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                  href="/categories/payroll-india"
                  className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4 text-sm hover:bg-[var(--surface-3)]"
                >
                  <div className="font-semibold text-[var(--text)]">Payroll India guide</div>
                  <div className="mt-1 text-sm text-[var(--text-muted)]">India payroll complexity and what to validate before buying.</div>
                </Link>
                <Link
                  href="/payroll-software-evaluation-checklist-india"
                  className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4 text-sm hover:bg-[var(--surface-3)]"
                >
                  <div className="font-semibold text-[var(--text)]">Payroll evaluation checklist (India)</div>
                  <div className="mt-1 text-sm text-[var(--text-muted)]">Compliance, multi-state risk controls, pricing traps, and comparison framework.</div>
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
