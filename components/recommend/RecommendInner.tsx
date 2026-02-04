"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

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

  const prefillHint = useMemo(() => {
    if (!prefill) return null;
    return `You came from tool: ${prefill}`;
  }, [prefill]);

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold">{mode === "recommend" ? "Get recommendations" : "Build your HR stack"}</h1>
          <Link className="text-sm font-medium text-indigo-700" href="/tools">
            Browse tools
          </Link>
        </div>
        <p className="mt-2 text-zinc-600">
          Answer a few questions. HRSignal will recommend 3–5 best-fit tools and explain why each fits.
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
                  categoriesNeeded: categories.slice(0, 5),
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
            <Field label="Your role (optional)">
              <input className="input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Founder / HR / Ops" />
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
            <input className="input" value={budgetNote} onChange={(e) => setBudgetNote(e.target.value)} placeholder="e.g., ₹50/employee/month" />
          </Field>

          <Field label="Timeline (optional)">
            <input className="input" value={timelineNote} onChange={(e) => setTimelineNote(e.target.value)} placeholder="e.g., 30 days" />
          </Field>

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
