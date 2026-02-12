import { Card } from "@/components/ui/Card";
import { Container } from "@/components/layout/Container";
import { ChecklistDownloadCard } from "@/components/lead/ChecklistDownloadCard";

export const metadata = {
  title: "Free India Payroll Risk Checklist (20–1000 Employees) | HRSignal",
  description:
    "Download a practical India payroll risk checklist for 20–1000 employee orgs. Validate PF/ESI/PT/TDS scope, month-end controls, and audit signals before you buy.",
};

export default function IndiaPayrollRiskChecklistLanding() {
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to use the India Payroll Risk Checklist",
    description: "A short process to download and use the checklist during payroll vendor evaluation.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        name: "Request the checklist",
        text: "Enter your work email and basic context to receive the download link.",
      },
      {
        "@type": "HowToStep",
        name: "Download the PDF",
        text: "Open the email and download the India Payroll Risk Checklist PDF.",
      },
      {
        "@type": "HowToStep",
        name: "Use it in demos",
        text: "Run month-end scenarios (arrears, reversals, cutoffs) and validate statutory outputs and audit trails.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <main className="py-10 sm:py-14">
        <Container className="max-w-3xl">
          <div className="text-xs font-semibold tracking-[0.12em] text-[var(--text-muted)]">HRSignal • India payroll decision intelligence</div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Free India Payroll Risk Checklist (For 20–1000 Employee Orgs)
          </h1>

          <p className="mt-3 max-w-[75ch] text-sm leading-7 text-[var(--text-muted)]">
            A clean, buyer-first checklist to catch multi-state compliance edge cases and month-end operational risk — before you commit to a
            payroll vendor.
          </p>

          <div className="mt-8 space-y-4">
            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <div className="text-base font-semibold text-[var(--text)]">Problem</div>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• Compliance scope looks fine on slides — then PF/ESI/PT/TDS edge cases show up at month-end.</li>
                <li>• Integrations and audit trails are unclear until implementation, when switching costs are highest.</li>
                <li>• Vendors vary on verification freshness; stale claims create hidden risk in multi-state payroll.</li>
              </ul>
            </Card>

            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <div className="text-base font-semibold text-[var(--text)]">What you get</div>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--text-muted)]">
                <li>• A demo-ready checklist for month-end scenarios (arrears, reversals, cutoffs, exceptions).</li>
                <li>• Verification prompts: evidence links, freshness signals, and what to treat as “validate”.</li>
                <li>• Compliance scope questions mapped to common India payroll failure modes.</li>
                <li>• A short scorecard to compare vendors consistently across teams.</li>
              </ul>
            </Card>

            <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
              <div className="text-base font-semibold text-[var(--text)]">Who it’s for</div>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                HR and Finance teams in 20–1000 employee Indian orgs evaluating HRMS + payroll, especially with multi-state compliance exposure or
                upcoming process maturity (approvals, audit trails, integrations).
              </p>
            </Card>

            <ChecklistDownloadCard sourcePage="checklist-landing" />
          </div>

          <footer className="mt-10 border-t border-[var(--border-soft)] pt-6 text-xs text-[var(--text-muted)]">
            © HRSignal. This checklist is educational; always validate statutory applicability and outputs with your advisors.
          </footer>
        </Container>
      </main>
    </div>
  );
}
