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
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted?: (payload: StructuredLeadPayloadV1) => void;
}) {
  const [headcountRange, setHeadcountRange] = React.useState("20-200");
  const [statesCount, setStatesCount] = React.useState("1");
  const [payrollFrequency, setPayrollFrequency] = React.useState("monthly");
  const [pfEsiApplicability, setPfEsiApplicability] = React.useState("both");
  const [contractWorkers, setContractWorkers] = React.useState<"yes" | "no">("no");
  const [timeline, setTimeline] = React.useState("30d");

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (!open) return;
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

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
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Shortlist request"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Card className="w-full max-w-lg p-0 shadow-none">
        <div className="border-b border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
          <div className="text-base font-semibold text-[var(--text)]">Shortlist / get intro</div>
          <div className="mt-1 text-sm text-[var(--text-muted)]">Share a few constraints so we can tailor the shortlist for India payroll complexity.</div>
        </div>

        <form
          className="space-y-4 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            // Temporary stub: log structured payload only (no routing/vendor sharing yet).
            console.log("HRSignal structured lead v1", payload);
            onSubmitted?.(payload);
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
            <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={onClose}>
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
      </Card>
    </div>
  );
}
