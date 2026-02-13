"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ToastViewport, type ToastModel } from "@/components/ui/Toast";
import { trackEvent } from "@/components/analytics/track";

const CATEGORY_OPTIONS = [
  { slug: "hrms", label: "HRMS / Core HR" },
  { slug: "payroll", label: "Payroll & Compliance" },
  { slug: "attendance", label: "Attendance/Leave/Time" },
  { slug: "ats", label: "ATS / Hiring" },
  { slug: "performance", label: "Performance/OKR" },
] as const;

const PAYROLL_COMPLIANCE_OPTIONS = [
  { slug: "PF", label: "PF" },
  { slug: "ESI", label: "ESI" },
  { slug: "PT", label: "PT" },
  { slug: "LWF", label: "LWF" },
  { slug: "TDS", label: "TDS" },
  { slug: "Form16", label: "Form 16" },
  { slug: "24Q", label: "24Q" },
] as const;

const SUPPORT_CHANNEL_OPTIONS = [
  { slug: "whatsapp", label: "WhatsApp" },
  { slug: "phone", label: "Phone" },
  { slug: "ticket", label: "Ticket" },
  { slug: "email", label: "Email" },
] as const;

const INTEGRATION_OPTIONS = [
  { slug: "tally", label: "Tally" },
  { slug: "zoho-books", label: "Zoho Books" },
  { slug: "google-workspace", label: "Google Workspace" },
] as const;

type SizeBand = "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1001-5000" | "5001-10000" | "10000+";

type Mode = "recommend" | "stack-builder";

export default function RecommendInner({
  mode,
  embedded = false,
}: {
  mode: Mode;
  embedded?: boolean;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const prefill = search.get("prefill");

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [sizeBand, setSizeBand] = useState<SizeBand>("11-50");
  const [industry, setIndustry] = useState("");
  const [deployment] = useState<"cloud" | "on-prem" | "hybrid" | "">("");
  const [budgetBand, setBudgetBand] = useState<"lt_50" | "50_100" | "100_200" | "quote" | "unknown" | "">("");

  const [states, setStates] = useState("");
  const [categories, setCategories] = useState<string[]>(["payroll"]);
  const [integrations, setIntegrations] = useState<string[]>([]);
  const [budgetNote, setBudgetNote] = useState("");
  const [timelineNote, setTimelineNote] = useState("30 days");

  // Payroll decision inputs (stored in notes for now; recommendations API unchanged)
  const [statutoryComplexity, setStatutoryComplexity] = useState<"basic" | "multi-state" | "multi-entity">("basic");
  const [payrollCompliance, setPayrollCompliance] = useState<string[]>(["PF", "ESI", "PT", "TDS"]);
  const [attendanceSource, setAttendanceSource] = useState<"built-in" | "biometric" | "third-party" | "manual">("third-party");
  const [edgeCases, setEdgeCases] = useState<string[]>(["arrears", "reversals"]);
  const [makerCheckerRequired, setMakerCheckerRequired] = useState(false);

  const [gstRequired, setGstRequired] = useState<"yes" | "no" | "unsure">("unsure");
  const [dataResidency, setDataResidency] = useState<"india-required" | "india-preferred" | "not-required">("india-preferred");
  const [supportChannels, setSupportChannels] = useState<string[]>(["whatsapp", "ticket"]);

  const [step, setStep] = useState(1);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastModel[]>([]);

  function toast(t: Omit<ToastModel, "id">) {
    setToasts((prev) => [{ id: crypto.randomUUID(), ...t }, ...prev].slice(0, 3));
  }

  const prefillHint = useMemo(() => {
    if (!prefill) return null;
    return `You came from tool: ${prefill}`;
  }, [prefill]);

  // Start shortlist tracking
  useEffect(() => {
    trackEvent("start_shortlist", { mode, prefill: prefill ?? "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = (
    <>
      <ToastViewport toasts={toasts} dismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <main className={embedded ? "" : "py-10 sm:py-14"}>
        <Container>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#F9FAFB]">
                {mode === "recommend" ? "Find my payroll-ready vendor" : "Build your HR stack"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#CBD5E1]">
                Answer a few questions. HRSignal will shortlist 3–5 payroll-ready tools and explain why each fits.
              </p>
              {prefillHint ? <p className="mt-2 text-sm text-zinc-500">{prefillHint}</p> : null}
            </div>
            <div>
              <Link className="text-sm font-medium text-indigo-700 hover:underline" href="/tools">
                Browse tools
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <Card className="p-0 shadow-sm">
              <form
                className="space-y-5 p-6 sm:p-8"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError(null);

                  // Client-side step guard (V1 payroll decision wizard)
                  const FINAL_STEP = mode === "recommend" ? 7 : 3;
                  if (step !== FINAL_STEP) {
                    setStep((s) => Math.min(FINAL_STEP, s + 1));
                    return;
                  }

                  setLoading(true);
                  try {
                    const payrollNotes = [
                      `Category: Payroll & Compliance`,
                      `Statutory complexity: ${statutoryComplexity}`,
                      `Compliance needed: ${payrollCompliance.join(", ") || "-"}`,
                      `Attendance source: ${attendanceSource}`,
                      `Edge cases: ${edgeCases.join(", ") || "-"}`,
                      `Maker-checker required: ${makerCheckerRequired ? "yes" : "no"}`,
                      `GST invoicing required: ${gstRequired}`,
                      `Data residency: ${dataResidency}`,
                      `Preferred support: ${supportChannels.join(", ") || "-"}`,
                    ].join("\n");

                    const payload = {
                      companyName,
                      buyerEmail: email,
                      buyerRole: role,
                      sizeBand,
                      industry: industry || null,
                      deployment: deployment || null,
                      budgetBand: budgetBand || null,
                      states: states
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                      // Scope strictly to Payroll & Compliance for V1 lead magnet.
                      categoriesNeeded: mode === "recommend" ? ["payroll"] : categories.slice(0, 5),
                      mustHaveIntegrations: integrations,
                      budgetNote: [budgetNote?.trim(), payrollNotes].filter(Boolean).join("\n\n"),
                      timelineNote,
                    };

                    const res = await fetch("/api/recommendations", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify(payload),
                    });

                    const data = await res.json().catch(() => null);
                    if (!res.ok) {
                      const msg = data?.error || "Please check the form and try again.";
                      setError(msg);
                      toast({ type: "error", title: "Couldn’t generate recommendations", description: msg });
                      return;
                    }

                    if (!data?.resultId) {
                      const msg = "Missing resultId from server response.";
                      setError(msg);
                      toast({ type: "error", title: "Unexpected server response", description: msg });
                      return;
                    }

                    trackEvent("submit_shortlist", {
                      mode,
                      resultId: data.resultId,
                      categories: categories.join(","),
                      integrations: integrations.join(","),
                      sizeBand,
                    });

                    toast({ type: "success", title: "Shortlist ready", description: "Redirecting to your results…", durationMs: 1500 });
                    router.push(`/results/${data.resultId}`);
                  } catch (e2) {
                    const msg = e2 instanceof Error ? e2.message : "Something went wrong. Try again.";
                    setError(msg);
                    toast({ type: "error", title: "Network error", description: msg });
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {(() => {
                  const total = mode === "recommend" ? 7 : 3;
                  return (
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs font-semibold text-zinc-500">Step {step} of {total}</div>
                      <div className="h-2 w-full max-w-[260px] overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className="h-full bg-indigo-600 transition-[width] motion-reduce:transition-none"
                          style={{ width: `${(step / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}

                {step === 1 ? (
                  <>
                    <Field label="Company name">
                      <input className="input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                    </Field>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Work email">
                        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </Field>
                      <Field label="Your role (optional)">
                        <input className="input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Founder / HR / Finance" />
                      </Field>
                    </div>

                    {mode === "recommend" ? (
                      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text-muted)]">
                        <div className="font-semibold text-[var(--text)]">Scope</div>
                        <div className="mt-1">This V1 decision flow is focused on <b>Payroll & Compliance</b>.</div>
                      </div>
                    ) : null}
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Employee count band">
                        <select className="input" value={sizeBand} onChange={(e) => setSizeBand(e.target.value as SizeBand)}>
                          <option value="1-10">1–10</option>
                          <option value="11-50">11–50</option>
                          <option value="51-200">51–200</option>
                          <option value="201-500">201–500</option>
                          <option value="501-1000">501–1000</option>
                          <option value="1001-5000">1001–5000</option>
                          <option value="5001-10000">5001–10,000</option>
                          <option value="10000+">10,000+</option>
                        </select>
                      </Field>
                      <Field label="Industry (optional)">
                        <input className="input" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g., Manufacturing, Services, Retail" />
                      </Field>
                    </div>

                    <Field label="States of operation (optional, comma separated)">
                      <input className="input" value={states} onChange={(e) => setStates(e.target.value)} placeholder="e.g., KA, MH, DL" />
                    </Field>

                    {mode !== "recommend" ? (
                      <>
                        <Field label="What do you need? (pick 1–5 categories)">
                          <MultiSelect options={CATEGORY_OPTIONS} value={categories} onChange={setCategories} max={5} min={1} />
                        </Field>
                      </>
                    ) : null}
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    <Field label="Statutory complexity">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {([
                          { k: "basic", t: "Basic", d: "Single state, minimal edge cases" },
                          { k: "multi-state", t: "Multi-state", d: "PT/LWF variance" },
                          { k: "multi-entity", t: "Multi-entity", d: "Higher compliance" },
                        ] as const).map((x) => (
                          <button
                            key={x.k}
                            type="button"
                            className={`rounded-xl border p-4 text-left text-sm ${
                              statutoryComplexity === x.k
                                ? "border-[var(--primary)] bg-[rgba(111,66,193,0.12)] text-[var(--text)]"
                                : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)]"
                            }`}
                            onClick={() => setStatutoryComplexity(x.k)}
                          >
                            <div className="font-semibold text-[var(--text)]">{x.t}</div>
                            <div className="mt-1 text-xs leading-relaxed">{x.d}</div>
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field label="Compliance you need (select all that apply)">
                      <MultiSelect options={PAYROLL_COMPLIANCE_OPTIONS} value={payrollCompliance} onChange={setPayrollCompliance} max={7} min={1} />
                    </Field>
                  </>
                ) : null}

                {step === 4 ? (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Attendance source">
                        <select
                          className="input"
                          value={attendanceSource}
                          onChange={(e) =>
                            setAttendanceSource(e.target.value as "built-in" | "biometric" | "third-party" | "manual")
                          }
                        >
                          <option value="built-in">Built-in</option>
                          <option value="biometric">Biometric integration</option>
                          <option value="third-party">Third-party system</option>
                          <option value="manual">Manual / spreadsheets</option>
                        </select>
                      </Field>
                      <Field label="Controls">
                        <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                          <input
                            type="checkbox"
                            checked={makerCheckerRequired}
                            onChange={(e) => setMakerCheckerRequired(e.target.checked)}
                          />
                          Maker-checker required
                        </label>
                      </Field>
                    </div>

                    <Field label="Edge cases to demo">
                      <MultiSelect
                        options={[
                          { slug: "arrears", label: "Arrears" },
                          { slug: "reversals", label: "Reversals" },
                          { slug: "fnf", label: "FnF" },
                          { slug: "transfers", label: "Transfers" },
                          { slug: "multi-structures", label: "Multiple salary structures" },
                        ]}
                        value={edgeCases}
                        onChange={setEdgeCases}
                        max={5}
                      />
                    </Field>
                  </>
                ) : null}

                {step === 5 ? (
                  <>
                    <Field label="Must-have integrations">
                      <MultiSelect options={INTEGRATION_OPTIONS} value={integrations} onChange={setIntegrations} max={3} />
                    </Field>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Budget band (optional)">
                        <select className="input" value={budgetBand} onChange={(e) => setBudgetBand(e.target.value as typeof budgetBand)}>
                          <option value="">Not sure</option>
                          <option value="lt_50">&lt; ₹50/employee/month</option>
                          <option value="50_100">₹50–₹100/employee/month</option>
                          <option value="100_200">₹100–₹200/employee/month</option>
                          <option value="quote">Quote-based</option>
                          <option value="unknown">Unknown</option>
                        </select>
                      </Field>
                      <Field label="Timeline (optional)">
                        <input className="input" value={timelineNote} onChange={(e) => setTimelineNote(e.target.value)} placeholder="e.g., 30 days" />
                      </Field>
                    </div>

                    <Field label="Notes (optional)">
                      <input className="input" value={budgetNote} onChange={(e) => setBudgetNote(e.target.value)} placeholder="e.g., multi-state payroll + attendance integration" />
                    </Field>
                  </>
                ) : null}

                {step === 6 ? (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="GST invoicing required?">
                        <select
                          className="input"
                          value={gstRequired}
                          onChange={(e) => setGstRequired(e.target.value as "yes" | "no" | "unsure")}
                        >
                          <option value="unsure">Not sure</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </Field>
                      <Field label="Data residency">
                        <select
                          className="input"
                          value={dataResidency}
                          onChange={(e) =>
                            setDataResidency(e.target.value as "india-required" | "india-preferred" | "not-required")
                          }
                        >
                          <option value="india-preferred">India preferred</option>
                          <option value="india-required">India required</option>
                          <option value="not-required">Not required</option>
                        </select>
                      </Field>
                    </div>

                    <Field label="Preferred support channels (optional)">
                      <MultiSelect options={SUPPORT_CHANNEL_OPTIONS} value={supportChannels} onChange={setSupportChannels} max={4} />
                    </Field>

                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text-muted)]">
                      <div className="font-semibold text-[var(--text)]">Trust & evidence</div>
                      <div className="mt-1">We prioritize verified listings with sources and recent checks. Unknown fields will be flagged for validation.</div>
                    </div>
                  </>
                ) : null}

                {step === 7 ? (
                  <>
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
                      <div className="text-sm font-semibold text-[var(--text)]">Review</div>
                      <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-[var(--text-muted)] sm:grid-cols-2">
                        <KV label="Category" value="Payroll & Compliance" />
                        <KV label="Company size" value={sizeBand} />
                        <KV label="States" value={states || "—"} />
                        <KV label="Complexity" value={statutoryComplexity} />
                        <KV label="Compliance" value={payrollCompliance.join(", ") || "—"} />
                        <KV label="Integrations" value={integrations.join(", ") || "—"} />
                      </div>
                    </div>

                    <div className="text-xs text-[var(--text-muted)]">
                      By continuing, you’ll get an explainable shortlist. We won’t blast your details to multiple vendors.
                    </div>
                  </>
                ) : null}

                {error ? (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                    {error}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    className="h-10 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-50"
                    disabled={loading || step === 1}
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                  >
                    Back
                  </button>

                  <Button className="w-full" disabled={loading}>
                    {(() => {
                      const finalStep = mode === "recommend" ? 7 : 3;
                      if (loading) return "Getting your shortlist…";
                      if (step === finalStep) return "Generate shortlist";
                      return "Next";
                    })()}
                  </Button>
                </div>

                <p className="text-center text-xs leading-5 text-zinc-500">
                  Privacy-first: we don’t blast your details to vendors.
                </p>
              </form>
            </Card>
          </div>
        </Container>
      </main>
    </>
  );

  if (embedded) return <div className="bg-transparent">{content}</div>;

  return (
    <div className="min-h-screen bg-[#0B0E23]">
      <SiteHeader />
      {content}
      <SiteFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-800">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2">
      <div className="text-xs font-semibold text-[var(--text-muted)]">{label}</div>
      <div className="text-sm font-semibold text-[var(--text)]">{value}</div>
    </div>
  );
}

function MultiSelect({
  options,
  value,
  onChange,
  max,
  min,
}: {
  options: ReadonlyArray<{ slug: string; label: string }>;
  value: string[];
  onChange: (v: string[]) => void;
  max: number;
  min?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o.slug);
        const minCount = min ?? 0;
        const atMin = minCount > 0 && active && value.length <= minCount;
        const atMax = !active && value.length >= max;
        return (
          <button
            key={o.slug}
            type="button"
            disabled={atMin || atMax}
            className={`rounded-full border px-3 py-1 text-sm disabled:opacity-50 ${
              active ? "border-black bg-black text-white" : "border-zinc-200 bg-white text-zinc-800"
            }`}
            onClick={() => {
              if (active) onChange(value.filter((x) => x !== o.slug));
              else onChange([...value, o.slug]);
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
