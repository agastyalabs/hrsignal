"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ToastViewport, type ToastModel } from "@/components/ui/Toast";

const CATEGORY_OPTIONS = [
  { slug: "hrms", label: "HRMS / Core HR" },
  { slug: "payroll", label: "Payroll & Compliance" },
  { slug: "attendance", label: "Attendance/Leave/Time" },
  { slug: "ats", label: "ATS / Hiring" },
  { slug: "performance", label: "Performance/OKR" },
] as const;

const INTEGRATION_OPTIONS = [
  { slug: "tally", label: "Tally" },
  { slug: "zoho-books", label: "Zoho Books" },
  { slug: "google-workspace", label: "Google Workspace" },
] as const;

type SizeBand = "EMP_20_200" | "EMP_50_500" | "EMP_100_1000";

type Mode = "recommend" | "stack-builder";

export default function RecommendInner({ mode }: { mode: Mode }) {
  const router = useRouter();
  const search = useSearchParams();
  const prefill = search.get("prefill");

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [sizeBand, setSizeBand] = useState<SizeBand>("EMP_20_200");
  const [states, setStates] = useState("");
  const [categories, setCategories] = useState<string[]>(["hrms", "payroll", "attendance"]);
  const [integrations, setIntegrations] = useState<string[]>(prefill ? [] : ["tally"]);
  const [budgetNote, setBudgetNote] = useState("");
  const [timelineNote, setTimelineNote] = useState("30 days");

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

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <ToastViewport toasts={toasts} dismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <main className="py-10 sm:py-14">
        <Container>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                {mode === "recommend" ? "Get recommendations" : "Build your HR stack"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                Answer a few questions. HRSignal will recommend 3–5 best-fit tools and explain why each fits.
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
                  setLoading(true);
                  try {
                    const payload = {
                      companyName,
                      buyerEmail: email,
                      buyerRole: role,
                      sizeBand,
                      states: states
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                      categoriesNeeded: categories.slice(0, 5),
                      mustHaveIntegrations: integrations,
                      budgetNote,
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

                    toast({ type: "success", title: "Shortlist ready", description: "Redirecting to your results…", durationMs: 1500 });
                    router.push(`/results/${data.resultId}`);
                  } catch (e2) {
                    const msg = e2 instanceof Error ? e2.message : "Something went wrong. Try again.";
                    setError(msg);
                    toast({ type: "error", title: "Network error", description: "Please try again in a moment." });
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <Field label="Company name">
                  <input className="input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Work email">
                    <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </Field>
                  <Field label="Your role (optional)">
                    <input
                      className="input"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Founder / HR / Ops"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Employee count band">
                    <select className="input" value={sizeBand} onChange={(e) => setSizeBand(e.target.value as SizeBand)}>
                      <option value="EMP_20_200">20–200</option>
                      <option value="EMP_50_500">50–500</option>
                      <option value="EMP_100_1000">100–1000</option>
                    </select>
                  </Field>
                  <Field label="States (optional, comma separated)">
                    <input className="input" value={states} onChange={(e) => setStates(e.target.value)} />
                  </Field>
                </div>

                <Field label="What do you need? (pick 1–5 categories)">
                  <MultiSelect options={CATEGORY_OPTIONS} value={categories} onChange={setCategories} max={5} min={1} />
                </Field>

                <Field label="Must-have integrations">
                  <MultiSelect options={INTEGRATION_OPTIONS} value={integrations} onChange={setIntegrations} max={3} />
                </Field>

                <Field label="Budget notes (optional)">
                  <input
                    className="input"
                    value={budgetNote}
                    onChange={(e) => setBudgetNote(e.target.value)}
                    placeholder="e.g., ₹50/employee/month"
                  />
                </Field>

                <Field label="Timeline (optional)">
                  <input
                    className="input"
                    value={timelineNote}
                    onChange={(e) => setTimelineNote(e.target.value)}
                    placeholder="e.g., 30 days"
                  />
                </Field>

                {error ? (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                    {error}
                  </div>
                ) : null}

                <Button className="w-full" disabled={loading}>
                  {loading ? "Getting your shortlist…" : "Get recommendations"}
                </Button>

                <p className="text-center text-xs leading-5 text-zinc-500">
                  Privacy-first: we don’t blast your details to vendors.
                </p>
              </form>
            </Card>
          </div>
        </Container>
      </main>

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
