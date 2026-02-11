"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { ChecklistDownloadCard } from "@/components/lead/ChecklistDownloadCard";

type EmployeesRange = "1-49" | "50-200" | "201-1000" | "1001+";
type StatesRange = "1" | "2-5" | "6+";
type Frequency = "monthly" | "biweekly" | "weekly";
type YesNo = "yes" | "no";
type IndustryComplexity = "low" | "medium" | "high";

function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

function computeComplexityScore(args: {
  employees: EmployeesRange;
  states: StatesRange;
  frequency: Frequency;
  pfEsi: YesNo;
  contractors: YesNo;
  industryComplexity: IndustryComplexity;
}): number {
  // Deterministic weighted formula (0–100). No ML.
  // Multi-state + statutory + contractors drive most month-end risk.
  // weights: states 25, pfEsi 20, contractors 15, frequency 15, industry 15, employees 10.

  const employeesPts =
    args.employees === "1-49" ? 2 :
    args.employees === "50-200" ? 5 :
    args.employees === "201-1000" ? 8 :
    10;

  const statesPts = args.states === "1" ? 5 : args.states === "2-5" ? 18 : 25;
  const pfEsiPts = args.pfEsi === "yes" ? 20 : 6;
  const contractorsPts = args.contractors === "yes" ? 15 : 5;
  const freqPts = args.frequency === "monthly" ? 6 : args.frequency === "biweekly" ? 11 : 15;
  const industryPts = args.industryComplexity === "low" ? 6 : args.industryComplexity === "medium" ? 11 : 15;

  return clamp(Math.round(employeesPts + statesPts + pfEsiPts + contractorsPts + freqPts + industryPts));
}

function riskTier(score: number): { tier: "Low" | "Medium" | "High"; tone: string } {
  if (score >= 70) return { tier: "High", tone: "border-[rgba(244,63,94,0.35)] bg-[rgba(244,63,94,0.10)]" };
  if (score >= 40) return { tier: "Medium", tone: "border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.10)]" };
  return { tier: "Low", tone: "border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.10)]" };
}

function insights(args: {
  score: number;
  states: StatesRange;
  pfEsi: YesNo;
  contractors: YesNo;
  frequency: Frequency;
}): string[] {
  const out: string[] = [];

  if (args.states !== "1") out.push("Multi-state payroll increases statutory edge cases (PF/ESI/PT mapping, registers, exemptions).");
  if (args.pfEsi === "yes") out.push("PF/ESI applicability raises compliance output and reconciliation risk at month-end.");
  if (args.contractors === "yes") out.push("Contractor/vendor payouts require clear wage component handling and audit trails.");
  if (args.frequency !== "monthly") out.push("More frequent payroll cycles amplify cutoffs, arrears/reversals, and exception handling.");

  out.push(args.score >= 70 ? "Prioritize tools with strong verification depth + demo month-end scenarios." : "Validate evidence links and last-verified recency before committing.");

  return out.slice(0, 3);
}

export default function PayrollRiskScannerPage() {
  const router = useRouter();

  const [employees, setEmployees] = React.useState<EmployeesRange>("50-200");
  const [states, setStates] = React.useState<StatesRange>("1");
  const [frequency, setFrequency] = React.useState<Frequency>("monthly");
  const [pfEsi, setPfEsi] = React.useState<YesNo>("yes");
  const [contractors, setContractors] = React.useState<YesNo>("no");
  const [industryComplexity, setIndustryComplexity] = React.useState<IndustryComplexity>("medium");

  const score = computeComplexityScore({ employees, states, frequency, pfEsi, contractors, industryComplexity });
  const tier = riskTier(score);
  const bullets = insights({ score, states, pfEsi, contractors, frequency });

  const complexityTier = score >= 70 ? "high" : score >= 40 ? "medium" : "low";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      <main className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">India Payroll Risk Scanner</h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Answer 6 questions and get a deterministic complexity score (0–100) to focus your evaluation on month-end risk.
            </p>

            <div className="mt-6 space-y-4">
              <Card className="p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Number of employees</label>
                    <Select className="mt-1" value={employees} onChange={(e) => setEmployees(e.target.value as EmployeesRange)}>
                      <option value="1-49">1–49</option>
                      <option value="50-200">50–200</option>
                      <option value="201-1000">201–1000</option>
                      <option value="1001+">1001+</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Number of states</label>
                    <Select className="mt-1" value={states} onChange={(e) => setStates(e.target.value as StatesRange)}>
                      <option value="1">1</option>
                      <option value="2-5">2–5</option>
                      <option value="6+">6+</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Payroll frequency</label>
                    <Select className="mt-1" value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)}>
                      <option value="monthly">Monthly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="weekly">Weekly</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">PF/ESI applicable</label>
                    <Select className="mt-1" value={pfEsi} onChange={(e) => setPfEsi(e.target.value as YesNo)}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Contractors / vendors paid</label>
                    <Select className="mt-1" value={contractors} onChange={(e) => setContractors(e.target.value as YesNo)}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Industry compliance complexity</label>
                    <Select
                      className="mt-1"
                      value={industryComplexity}
                      onChange={(e) => setIndustryComplexity(e.target.value as IndustryComplexity)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)]">Result</div>
                    <div className="mt-1 text-sm text-[var(--text-muted)]">Deterministic complexity score for India payroll evaluation.</div>
                  </div>
                  <div className={`rounded-[var(--radius-md)] border px-3 py-2 text-sm ${tier.tone}`}>
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Risk tier</div>
                    <div className="mt-0.5 text-sm font-semibold text-[var(--text)]">{tier.tier}</div>
                  </div>
                </div>

                <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Complexity score</div>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <div className="text-3xl font-extrabold tracking-tight text-[var(--text)]">{score}</div>
                    <div className="text-xs font-semibold text-[var(--text-muted)]">/ 100</div>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-[rgba(255,255,255,0.08)]">
                    <div className="h-2 rounded-full bg-[var(--primary)]" style={{ width: `${score}%` }} />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Risk insights</div>
                  <ul className="mt-2 space-y-2 text-sm text-[var(--text-muted)]">
                    {bullets.map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      const qp = new URLSearchParams({
                        ct: complexityTier,
                        headcount: employees,
                        states,
                        freq: frequency,
                        pfesi: pfEsi === "yes" ? "both" : "neither",
                        contractors,
                        industry: industryComplexity,
                        src: "risk_scanner",
                      });
                      router.push(`/recommend?${qp.toString()}`);
                    }}
                  >
                    Find payroll-ready vendors
                  </Button>
                </div>
              </Card>

              <ChecklistDownloadCard sourcePage="scanner" />

              <div className="text-xs text-[var(--text-muted)]">
                Note: this scanner estimates evaluation complexity. Always validate evidence links, last-verified recency, and month-end edge cases.
              </div>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
