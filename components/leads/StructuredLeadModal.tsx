"use client";

import * as React from "react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";

export type StructuredLeadPayloadV1 = {
  headcountRange: string;
  statesCount: string;
  payrollFrequency: string;
  pfEsiApplicability: string;
  contractWorkers: "yes" | "no";
  timeline: string;
  createdAtIso: string;
  source: "sticky_cta";
};

export function StructuredLeadModal({
  open,
  onClose,
  redirectHref = "/recommend",
}: {
  open: boolean;
  onClose: () => void;
  redirectHref?: string;
}) {
  const [headcountRange, setHeadcountRange] = React.useState("20-200");
  const [statesCount, setStatesCount] = React.useState("1");
  const [payrollFrequency, setPayrollFrequency] = React.useState("monthly");
  const [pfEsiApplicability, setPfEsiApplicability] = React.useState("both");
  const [contractWorkers, setContractWorkers] = React.useState<"yes" | "no">("no");
  const [timeline, setTimeline] = React.useState("30d");

  const [stage, setStage] = React.useState<"form" | "success">("form");

  // Premium mount/unmount with symmetric animation.
  const [present, setPresent] = React.useState(false);
  const [shown, setShown] = React.useState(false);

  function requestClose() {
    setShown(false);
    window.setTimeout(() => onClose(), 100);
  }

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") requestClose();
    }
    if (!open) return;
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    if (open) {
      setPresent(true);
      setStage("form");
      requestAnimationFrame(() => setShown(true));
      return;
    }

    setShown(false);
    const t = window.setTimeout(() => setPresent(false), 110);
    return () => window.clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    if (!present) return;

    // Lock body scroll + prevent scrollbar layout shift.
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarW > 0) body.style.paddingRight = `${scrollbarW}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [present]);

  if (!present) return null;

  const payload: StructuredLeadPayloadV1 = {
    headcountRange,
    statesCount,
    payrollFrequency,
    pfEsiApplicability,
    contractWorkers,
    timeline,
    createdAtIso: new Date().toISOString(),
    source: "sticky_cta",
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center ${
        shown ? "opacity-100" : "opacity-0"
      } transition-opacity ${shown ? "duration-[120ms] ease-out" : "duration-[100ms] ease-in"} bg-black/25 backdrop-blur-sm`}
      role="dialog"
      aria-modal="true"
      aria-label="Shortlist request"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div
        className={`w-full max-w-lg ${
          shown ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
        } transition-[opacity,transform] ${shown ? "duration-[120ms] ease-out" : "duration-[100ms] ease-in"}`}
      >
        <Card className="w-full p-0 shadow-none">
          <div className="border-b border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
            <div className="text-base font-semibold text-[var(--text)]">Shortlist / get intro</div>
            <div className="mt-1 text-sm text-[var(--text-muted)]">
              Share a few constraints so we can tailor for India payroll complexity.
            </div>
          </div>

          {stage === "form" ? (
            <form
              className="space-y-4 p-5"
              onSubmit={(e) => {
                e.preventDefault();
                // Temporary stub: log structured payload only (no routing/vendor sharing yet).
                console.log("HRSignal structured lead v1", payload);

                setStage("success");

                // Auto-close after inline confirmation; keep the existing routing intent.
                window.setTimeout(() => {
                  requestClose();
                  window.setTimeout(() => {
                    window.location.assign(redirectHref);
                  }, 120);
                }, 1500);
              }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Headcount range</label>
                  <Select className="mt-1" value={headcountRange} onChange={(e) => setHeadcountRange(e.target.value)}>
                    <option value="1-19">1–19</option>
                    <option value="20-200">20–200</option>
                    <option value="201-1000">201–1000</option>
                    <option value="1001+">1001+</option>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Number of states</label>
                  <Select className="mt-1" value={statesCount} onChange={(e) => setStatesCount(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2-3">2–3</option>
                    <option value="4-10">4–10</option>
                    <option value="10+">10+</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Payroll frequency</label>
                  <Select className="mt-1" value={payrollFrequency} onChange={(e) => setPayrollFrequency(e.target.value)}>
                    <option value="monthly">Monthly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="weekly">Weekly</option>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">PF / ESI applicability</label>
                  <Select className="mt-1" value={pfEsiApplicability} onChange={(e) => setPfEsiApplicability(e.target.value)}>
                    <option value="both">PF + ESI</option>
                    <option value="pf">PF only</option>
                    <option value="esi">ESI only</option>
                    <option value="neither">Neither</option>
                    <option value="not_sure">Not sure</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Contract workers</label>
                  <Select
                    className="mt-1"
                    value={contractWorkers}
                    onChange={(e) => setContractWorkers(e.target.value === "yes" ? "yes" : "no")}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Timeline</label>
                  <Select className="mt-1" value={timeline} onChange={(e) => setTimeline(e.target.value)}>
                    <option value="0-14d">0–14 days</option>
                    <option value="30d">~1 month</option>
                    <option value="60-90d">2–3 months</option>
                    <option value="90d+">3+ months</option>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
                <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={requestClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="w-full sm:w-auto">
                  Submit
                </Button>
              </div>

              <div className="text-xs text-[var(--text-muted)]">
                Privacy-first. This only logs a structured payload for now — no automatic vendor sharing.
              </div>
            </form>
          ) : (
            <div className="p-5">
              <div className="transition-opacity duration-200 ease-out">
                <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] p-4">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)]">Request received.</div>
                    <div className="mt-1 text-sm text-[var(--text-muted)]">We will share one best-fit vendor shortly.</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-[var(--text-muted)]">Closing…</div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
