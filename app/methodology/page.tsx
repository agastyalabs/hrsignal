import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      <main className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">How India Payroll Readiness Index™ works</h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              This score is deterministic (no ML). It is designed for India payroll buyers where the biggest risks show up at month-end and in statutory outputs.
            </p>

            <div className="mt-6 space-y-4">
              <Card className="p-6">
                <div className="text-sm font-semibold text-[var(--text)]">Scoring weights</div>
                <div className="mt-2 text-sm text-[var(--text-muted)]">
                  Vendor score =
                  <ul className="mt-2 space-y-1">
                    <li>• Compliance depth: <span className="font-semibold text-[var(--text)]">30%</span></li>
                    <li>• Evidence depth (source links): <span className="font-semibold text-[var(--text)]">25%</span></li>
                    <li>• Freshness (verification recency): <span className="font-semibold text-[var(--text)]">20%</span></li>
                    <li>• Integration depth (integrations listed): <span className="font-semibold text-[var(--text)]">15%</span></li>
                    <li>• Missing data penalty: <span className="font-semibold text-[var(--text)]">10%</span> (subtracted)</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-sm font-semibold text-[var(--text)]">Freshness logic</div>
                <div className="mt-2 space-y-2 text-sm text-[var(--text-muted)]">
                  <p>
                    Freshness is driven by the newest <span className="font-mono">lastVerifiedAt</span> date on the vendor’s published tools.
                    If no verification date is present, freshness is treated as “needs validation”.
                  </p>
                  <p>
                    Source-updated timestamps (from vendor briefs) are informational only — they do not automatically improve rankings.
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-sm font-semibold text-[var(--text)]">No vendor bias</div>
                <div className="mt-2 space-y-2 text-sm text-[var(--text-muted)]">
                  <p>
                    HRSignal does not accept payments to change rankings. The score uses only the signals listed above.
                  </p>
                  <p>
                    If a vendor has missing evidence/integration/compliance signals, we explicitly penalize missing data to reduce decision risk.
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-sm font-semibold text-[var(--text)]">India payroll context (why these signals)</div>
                <div className="mt-2 space-y-2 text-sm text-[var(--text-muted)]">
                  <p>
                    India payroll failures often come from edge cases: arrears/reversals, cutoffs, state-wise statutory rules, contract workers, and audit trails.
                    The India Payroll Readiness Index™ prioritizes signal quality that helps you validate these risks early.
                  </p>
                </div>
              </Card>

              <div className="pt-2">
                <Link
                  href="/recommend"
                  className="text-sm font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 hover:text-violet-100 hover:decoration-[rgba(124,77,255,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  Back to recommendations →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
