"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

const CATEGORY_OPTIONS = [
  { slug: "hrms", label: "HRMS / Core HR" },
  { slug: "payroll", label: "Payroll & Compliance" },
  { slug: "ats", label: "Recruitment / ATS" },
  { slug: "bgv", label: "Background Verification (BGV)" },
  { slug: "performance", label: "Performance & OKRs" },
  { slug: "engagement", label: "Engagement & Surveys" },
  { slug: "lms", label: "LMS / Training" },
  { slug: "attendance", label: "Time & Attendance" },
];

const INTEGRATION_OPTIONS = [
  { slug: "tally", label: "Tally" },
  { slug: "zoho-books", label: "Zoho Books" },
  { slug: "google-workspace", label: "Google Workspace" },
];

export default function StackBuilderPage() {
  return (
    <Suspense>
      <StackBuilderInner />
    </Suspense>
  );
}

function StackBuilderInner() {
  const router = useRouter();
  const search = useSearchParams();
  const prefill = search.get("prefill");

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [sizeBand, setSizeBand] = useState<"EMP_20_200" | "EMP_50_500" | "EMP_100_1000">("EMP_20_200");
  const [states, setStates] = useState("Karnataka");
  const [categories, setCategories] = useState<string[]>(["hrms", "payroll"]);
  const [integrations, setIntegrations] = useState<string[]>(prefill ? [] : ["tally"]);
  const [budgetNote, setBudgetNote] = useState("");
  const [timelineNote, setTimelineNote] = useState("30 days");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const prefillHint = useMemo(() => {
    if (!prefill) return null;
    return `You came from tool: ${prefill}`;
  }, [prefill]);

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold">Build your HR stack</h1>
          <a className="text-sm underline" href="/tools">
            Browse tools
          </a>
        </div>
        <p className="mt-2 text-zinc-600">
          Answer a few questions. HRSignal will shortlist best-fit tools across HRMS, payroll, hiring, and more.
        </p>
        {prefillHint ? <p className="mt-2 text-sm text-zinc-500">{prefillHint}</p> : null}

        <form
          className="mt-6 space-y-4 rounded-xl bg-white p-6 shadow"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            try {
              const res = await fetch("/api/recommendations", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  companyName,
                  buyerEmail: email,
                  buyerRole: role,
                  sizeBand,
                  states: states
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  categoriesNeeded: categories,
                  mustHaveIntegrations: integrations,
                  budgetNote,
                  timelineNote,
                }),
              });
              if (!res.ok) throw new Error("Failed");
              const json = (await res.json()) as { resultId: string };
              router.push(`/results/${json.resultId}`);
            } catch {
              setError("Something went wrong. Try again.");
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
            <Field label="Your role">
              <input className="input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Founder / HR / Ops" />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Employee count band">
              <select className="input" value={sizeBand} onChange={(e) => setSizeBand(e.target.value as any)}>
                <option value="EMP_20_200">20–200</option>
                <option value="EMP_50_500">50–500</option>
                <option value="EMP_100_1000">100–1000</option>
              </select>
            </Field>
            <Field label="States (comma separated)">
              <input className="input" value={states} onChange={(e) => setStates(e.target.value)} />
            </Field>
          </div>

          <Field label="What do you need? (pick categories)">
            <MultiSelect options={CATEGORY_OPTIONS} value={categories} onChange={setCategories} />
          </Field>

          <Field label="Must-have integrations">
            <MultiSelect options={INTEGRATION_OPTIONS} value={integrations} onChange={setIntegrations} />
          </Field>

          <Field label="Budget notes (optional)">
            <input className="input" value={budgetNote} onChange={(e) => setBudgetNote(e.target.value)} placeholder="e.g., ₹50/employee/month" />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Timeline">
              <input className="input" value={timelineNote} onChange={(e) => setTimelineNote(e.target.value)} placeholder="e.g., 30 days" />
            </Field>
            <div />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button className="w-full rounded-md bg-black px-4 py-2 font-medium text-white disabled:opacity-60" disabled={loading}>
            {loading ? "Getting your shortlist…" : "Get recommendations"}
          </button>
        </form>
      </div>
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
}: {
  options: { slug: string; label: string }[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o.slug);
        return (
          <button
            key={o.slug}
            type="button"
            className={`rounded-full border px-3 py-1 text-sm ${
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
