"use client";

import * as React from "react";
import { track } from "@vercel/analytics";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";

type SizeBand = "20-50" | "51-200" | "201-500" | "501-1000";
type Role = "HR" | "Finance" | "Founder";

type SourcePage = "homepage" | "payroll-india" | "scanner" | "checklist-landing";

export function ChecklistDownloadCard({
  title = "India Payroll Risk Checklist (PDF)",
  description = "Get a practical checklist to validate PF/ESI/PT/TDS scope, month-end controls, and audit readiness.",
  sourcePage,
}: {
  title?: string;
  description?: string;
  sourcePage: SourcePage;
}) {
  const [email, setEmail] = React.useState("");
  const [size, setSize] = React.useState<SizeBand>("51-200");
  const [role, setRole] = React.useState<Role>("HR");
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-base font-semibold text-[var(--text)]">{title}</div>
          <div className="mt-1 max-w-[68ch] text-sm leading-7 text-[var(--text-muted)]">{description}</div>
        </div>
      </div>

      {!submitted ? (
        <form
          className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            try {
              const res = await fetch("/api/leads/submit", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  email,
                  companySize: size,
                  role,
                  source: `checklist:${sourcePage}`,
                  tool: "india_payroll_risk_checklist",
                }),
              });

              const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
              if (!res.ok || !data?.ok) {
                setError(data?.error || "Something went wrong. Please try again.");
                return;
              }

              setSubmitted(true);
            } catch (e2) {
              const msg = e2 instanceof Error ? e2.message : "Network error";
              setError(msg);
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="lg:col-span-6">
            <label className="text-xs font-semibold text-[var(--text-muted)]">Work email</label>
            <Input
              className="mt-1"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-[var(--text-muted)]">Company size</label>
            <Select className="mt-1" value={size} onChange={(e) => setSize(e.target.value as SizeBand)}>
              <option value="20-50">20–50</option>
              <option value="51-200">51–200</option>
              <option value="201-500">201–500</option>
              <option value="501-1000">501–1000</option>
            </Select>
          </div>

          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-[var(--text-muted)]">Role</label>
            <Select className="mt-1" value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Founder">Founder</option>
            </Select>
          </div>

          <div className="lg:col-span-12">
            {error ? <div className="text-sm text-red-300">{error}</div> : null}

            <Button type="submit" variant="primary" className="w-full justify-center sm:w-auto" disabled={loading}>
              {loading ? "Sending…" : "Email me the checklist"}
            </Button>
            <div className="mt-2 text-xs text-[var(--text-muted)]">No spam. No paid ranking. Unsubscribe anytime.</div>
          </div>
        </form>
      ) : (
        <div className="mt-5 rounded-[var(--radius-lg)] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] p-5">
          <div className="flex items-start gap-3">
            <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Request received</div>
              <div className="mt-1 text-sm text-[var(--text-muted)]">Your checklist link is ready.</div>
              <div className="mt-3">
                <a
                  href="#"
                  onClick={() => {
                    track("checklist_download", { sourcePage });
                  }}
                  className="text-sm font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 hover:text-violet-100 hover:decoration-[rgba(124,77,255,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  Download PDF (placeholder) →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
