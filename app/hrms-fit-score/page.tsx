"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";

type Employees = "20-50" | "51-200" | "201-500" | "501-1000";
type Locations = "1" | "2-5" | "6+";
type YesNo = "yes" | "no";
type Industry = "services" | "manufacturing" | "retail" | "it" | "healthcare" | "other";

function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

function computeFitScore(args: {
  employees: Employees;
  locations: Locations;
  ats: YesNo;
  attendance: YesNo;
  performance: YesNo;
  industry: Industry;
}): number {
  // Deterministic scoring (0–100). No ML.
  // Interprets "fit" as how much a structured HRMS (vs spreadsheets) pays off,
  // and how complex the implementation is likely to be.

  const employeesPts =
    args.employees === "20-50" ? 12 :
    args.employees === "51-200" ? 22 :
    args.employees === "201-500" ? 28 :
    32;

  const locationsPts = args.locations === "1" ? 10 : args.locations === "2-5" ? 18 : 24;

  const modulePts =
    (args.ats === "yes" ? 12 : 0) +
    (args.attendance === "yes" ? 14 : 0) +
    (args.performance === "yes" ? 10 : 0);

  const industryPts =
    args.industry === "manufacturing" ? 14 :
    args.industry === "retail" ? 12 :
    args.industry === "healthcare" ? 12 :
    args.industry === "services" ? 10 :
    args.industry === "it" ? 8 :
    9;

  // Slight penalty for low complexity (small + single location + no modules):
  // HRMS still helps, but ROI is lower.
  const lowComplexPenalty =
    args.employees === "20-50" && args.locations === "1" && modulePts === 0 ? -8 : 0;

  return clamp(Math.round(employeesPts + locationsPts + modulePts + industryPts + lowComplexPenalty));
}

function tier(score: number): "Low" | "Medium" | "High" {
  if (score >= 75) return "High";
  if (score >= 45) return "Medium";
  return "Low";
}

function bullets(score: number, locations: Locations, attendance: YesNo): string[] {
  const t = tier(score);

  if (t === "High") {
    return [
      "High fit: a structured HRMS will reduce operational overhead and improve auditability.",
      locations !== "1" ? "Multi-location complexity: prioritize policy controls, approvals, and geo-aware attendance." : "Single location: focus on clean core HR + workflows first.",
      attendance === "yes" ? "Attendance is in-scope: validate device/app integrations and exception handling in demos." : "Attendance not needed: consider a lighter HRMS setup to reduce implementation load.",
    ];
  }

  if (t === "Medium") {
    return [
      "Medium fit: HRMS helps, but pick a tool that’s easy to implement and doesn’t overcomplicate workflows.",
      locations === "6+" ? "Many locations: validate role permissions, approvals, and reporting before committing." : "Moderate footprint: keep your first rollout to a minimal set of modules.",
      "Treat missing data as ‘validate’: integrations, evidence links, and verification freshness.",
    ];
  }

  return [
    "Low fit (for now): you may be early — start with core employee records + basic workflows.",
    "Avoid heavy customization in v1; optimize for speed-to-live and clean data capture.",
    "If you still need payroll compliance, use the India Payroll Risk Scanner to assess month-end complexity.",
  ];
}

export default function HrmsFitScorePage() {
  const router = useRouter();

  const [employees, setEmployees] = React.useState<Employees>("51-200");
  const [locations, setLocations] = React.useState<Locations>("1");
  const [ats, setAts] = React.useState<YesNo>("no");
  const [attendance, setAttendance] = React.useState<YesNo>("yes");
  const [performance, setPerformance] = React.useState<YesNo>("no");
  const [industry, setIndustry] = React.useState<Industry>("services");

  const score = computeFitScore({ employees, locations, ats, attendance, performance, industry });
  const t = tier(score);
  const insights = bullets(score, locations, attendance);

  const tone =
    t === "High"
      ? "border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.10)]"
      : t === "Medium"
        ? "border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.10)]"
        : "border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.10)]";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      <main className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">HRMS Fit Score</h1>
            <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
              A lightweight, deterministic score (0–100) to estimate how much an HRMS rollout will help — and how complex it’s likely to be.
            </p>

            <div className="mt-6 space-y-4">
              <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-none">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Employees</label>
                    <Select className="mt-1" value={employees} onChange={(e) => setEmployees(e.target.value as Employees)}>
                      <option value="20-50">20–50</option>
                      <option value="51-200">51–200</option>
                      <option value="201-500">201–500</option>
                      <option value="501-1000">501–1000</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Locations</label>
                    <Select className="mt-1" value={locations} onChange={(e) => setLocations(e.target.value as Locations)}>
                      <option value="1">1</option>
                      <option value="2-5">2–5</option>
                      <option value="6+">6+</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Need ATS?</label>
                    <Select className="mt-1" value={ats} onChange={(e) => setAts(e.target.value as YesNo)}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Need attendance?</label>
                    <Select className="mt-1" value={attendance} onChange={(e) => setAttendance(e.target.value as YesNo)}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Need performance?</label>
                    <Select className="mt-1" value={performance} onChange={(e) => setPerformance(e.target.value as YesNo)}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Industry type</label>
                    <Select className="mt-1" value={industry} onChange={(e) => setIndustry(e.target.value as Industry)}>
                      <option value="services">Services</option>
                      <option value="it">IT / SaaS</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="other">Other</option>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-none">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)]">Result</div>
                    <div className="mt-1 text-sm text-[var(--text-muted)]">Deterministic fit score (0–100) and interpretation.</div>
                  </div>
                  <div className={`rounded-[var(--radius-md)] border px-3 py-2 text-sm ${tone}`}>
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Fit tier</div>
                    <div className="mt-0.5 text-sm font-semibold text-[var(--text)]">{t}</div>
                  </div>
                </div>

                <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Fit score</div>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <div className="text-3xl font-extrabold tracking-tight text-[var(--text)]">{score}</div>
                    <div className="text-xs font-semibold text-[var(--text-muted)]">/ 100</div>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-[rgba(255,255,255,0.08)]">
                    <div className="h-2 rounded-full bg-[var(--primary)]" style={{ width: `${score}%` }} />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Interpretation</div>
                  <ul className="mt-2 space-y-2 text-sm text-[var(--text-muted)]">
                    {insights.map((b) => (
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
                      router.push("/recommend");
                    }}
                  >
                    See HRMS vendors that fit
                  </Button>
                </div>
              </Card>

              <div className="text-xs text-[var(--text-muted)]">
                Note: This tool is a quick fit estimate. Always validate implementation scope, integrations, and month-end workflows in demos.
              </div>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
