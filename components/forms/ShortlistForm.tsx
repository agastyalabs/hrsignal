"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PrimaryNeed = "payroll" | "hrms" | "attendance" | "all";

type Timeline = "asap" | "1month" | "later";

type Integrations = {
  accounting: boolean;
  biometric: boolean;
};

type FormState = {
  email: string;
  companySize: string; // keep as string for input; validate to number
  primaryNeed: PrimaryNeed | "";
  isMultiState: "yes" | "no" | "";
  stateCount: string;
  integrations: Integrations;
  timeline: Timeline | "";
  updatedAt: number;
};

const STORAGE_KEY = "hrsignal.shortlistForm.v1";

const DEFAULT_STATE: FormState = {
  email: "",
  companySize: "",
  primaryNeed: "",
  isMultiState: "",
  stateCount: "",
  integrations: { accounting: false, biometric: false },
  timeline: "",
  updatedAt: Date.now(),
};

function safeParseJSON<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

function isValidEmail(email: string) {
  // Simple but practical regex; avoids overly strict RFC traps.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function parseCompanySize(v: string): number | null {
  const n = Number(String(v).trim());
  if (!Number.isFinite(n)) return null;
  if (!Number.isInteger(n)) return null;
  if (n <= 0) return null;
  if (n > 200000) return null;
  return n;
}

function clampStep(s: number) {
  return Math.max(1, Math.min(5, s));
}

const stepVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function WhyWeAsk({ text }: { text: string }) {
  return (
    <span className="relative inline-flex items-center">
      <span className="group inline-flex items-center gap-2">
        <span className="text-xs font-semibold text-[var(--text-muted)]">Why we ask</span>
        <span
          className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] text-[10px] font-extrabold text-[var(--text)]"
          aria-hidden="true"
        >
          i
        </span>
        <span className="sr-only">Why we ask: {text}</span>

        {/* tooltip */}
        <span className="pointer-events-none absolute left-0 top-7 z-10 hidden w-[min(340px,80vw)] rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-3 text-xs leading-relaxed text-[var(--text-muted)] shadow-[0_16px_60px_rgba(0,0,0,0.45)] group-hover:block group-focus-within:block">
          {text}
        </span>
      </span>
    </span>
  );
}

export function ShortlistForm({
  onComplete,
  className = "",
}: {
  onComplete?: (data: {
    email: string;
    companySize: number;
    primaryNeed: PrimaryNeed;
    isMultiState: boolean;
    stateCount: number;
    integrations: Integrations;
    timeline: Timeline;
  }) => void;
  className?: string;
}) {
  const didMount = useRef(false);

  const [state, setState] = useState<FormState>(() => {
    if (typeof window === "undefined") return DEFAULT_STATE;
    const saved = safeParseJSON<FormState>(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...saved, updatedAt: Date.now() };
  });

  const [step, setStep] = useState(() => {
    if (typeof window === "undefined") return 1;
    const saved = safeParseJSON<FormState>(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return 1;
    // Infer step from completeness.
    const inferred = saved.timeline ? 5 : saved.integrations ? 4 : saved.isMultiState ? 3 : saved.primaryNeed ? 2 : 1;
    return clampStep(inferred);
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Avoid rewriting localStorage on the very first mount when we already hydrated from it.
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, updatedAt: Date.now() }));
  }, [state]);

  const progress = useMemo(() => {
    return Math.round((clampStep(step) / 5) * 100);
  }, [step]);

  function next() {
    setStep((s) => clampStep(s + 1));
  }

  function back() {
    setStep((s) => clampStep(s - 1));
  }

  function validateCurrentStep(): boolean {
    setError(null);

    if (step === 1) {
      if (!isValidEmail(state.email)) {
        setError("Please enter a valid work email.");
        return false;
      }
      const n = parseCompanySize(state.companySize);
      if (n === null) {
        setError("Company size must be a whole number (e.g., 120).");
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!state.primaryNeed) {
        setError("Pick your primary need.");
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!state.isMultiState) {
        setError("Select yes/no for multi-state complexity.");
        return false;
      }
      const n = parseCompanySize(state.stateCount);
      if (state.isMultiState === "yes") {
        if (n === null) {
          setError("State count must be a whole number.");
          return false;
        }
        if (n < 2) {
          setError("If multi-state is yes, state count should be 2 or more.");
          return false;
        }
      } else {
        // allow empty or 1
        if (state.stateCount.trim()) {
          if (n === null) {
            setError("State count must be a whole number.");
            return false;
          }
          if (n !== 1) {
            setError("If multi-state is no, state count should be 1.");
            return false;
          }
        }
      }
      return true;
    }

    if (step === 4) {
      // integrations optional
      return true;
    }

    if (step === 5) {
      if (!state.timeline) {
        setError("Select your timeline.");
        return false;
      }
      return true;
    }

    return true;
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    if (step < 5) next();
  }

  function handleSubmit() {
    if (!validateCurrentStep()) return;

    const companySize = parseCompanySize(state.companySize);
    const stateCountParsed = parseCompanySize(state.stateCount);
    if (companySize === null) {
      setError("Company size must be a whole number.");
      return;
    }

    const primaryNeed = state.primaryNeed as PrimaryNeed;
    const timeline = state.timeline as Timeline;
    const isMultiState = state.isMultiState === "yes";

    const finalStateCount = isMultiState ? (stateCountParsed ?? 2) : 1;

    onComplete?.({
      email: state.email.trim(),
      companySize,
      primaryNeed,
      isMultiState,
      stateCount: finalStateCount,
      integrations: state.integrations,
      timeline,
    });
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_STATE);
    setStep(1);
    setError(null);
  }

  return (
    <div className={`rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 sm:p-6 ${className}`}>
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-[var(--text)]">Get your shortlist</div>
          <div className="mt-1 text-sm text-[var(--text-muted)]">Progressive disclosure (5 steps). Saved automatically.</div>
        </div>
        <button
          type="button"
          onClick={reset}
          className="text-xs font-semibold text-[var(--text-muted)] underline decoration-[rgba(255,255,255,0.2)] underline-offset-4 hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          Reset
        </button>
      </div>

      {/* progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>
            Step <span className="font-semibold text-[var(--text)]">{step}</span> / 5
          </span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)]">
          <div
            className="h-full rounded-full bg-[rgba(111,66,193,0.75)] transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* steps */}
      <div className="mt-5">
        <AnimatePresence mode="popLayout" initial={false}>
          {step === 1 ? (
            <motion.div key="s1" variants={stepVariants} initial="hidden" animate="show" exit="exit" transition={{ duration: 0.22 }}>
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-[var(--text)]">Step 1 — Quick capture</div>
                <WhyWeAsk text="We use email to deliver your shortlist and company size to filter out tools that won’t fit your payroll complexity." />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Work email</label>
                  <input
                    className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={state.email}
                    onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Company size</label>
                  <input
                    className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    placeholder="e.g., 120"
                    value={state.companySize}
                    onChange={(e) => setState((s) => ({ ...s, companySize: e.target.value }))}
                    required
                  />
                  <div className="mt-1 text-xs text-[var(--text-muted)]">Number of employees (headcount)</div>
                </div>
              </div>
            </motion.div>
          ) : null}

          {step === 2 ? (
            <motion.div key="s2" variants={stepVariants} initial="hidden" animate="show" exit="exit" transition={{ duration: 0.22 }}>
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-[var(--text)]">Step 2 — Primary need</div>
                <WhyWeAsk text="We start with your primary module so the shortlist focuses on what actually drives value and risk (especially payroll vs HRMS-first)." />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(
                  [
                    { k: "payroll", t: "Payroll", d: "Compliance + month-end" },
                    { k: "hrms", t: "HRMS", d: "Core HR + workflows" },
                    { k: "attendance", t: "Attendance", d: "Devices + shifts" },
                    { k: "all", t: "All", d: "Payroll + HRMS + attendance" },
                  ] as const
                ).map((x) => {
                  const active = state.primaryNeed === x.k;
                  return (
                    <button
                      key={x.k}
                      type="button"
                      onClick={() => setState((s) => ({ ...s, primaryNeed: x.k }))}
                      className={`rounded-[var(--radius-md)] border p-4 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
                        active
                          ? "border-[rgba(111,66,193,0.45)] bg-[rgba(111,66,193,0.18)]"
                          : "border-[var(--border-soft)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)]"
                      }`}
                      aria-pressed={active}
                    >
                      <div className="text-sm font-semibold text-[var(--text)]">{x.t}</div>
                      <div className="mt-1 text-xs text-[var(--text-muted)]">{x.d}</div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : null}

          {step === 3 ? (
            <motion.div key="s3" variants={stepVariants} initial="hidden" animate="show" exit="exit" transition={{ duration: 0.22 }}>
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-[var(--text)]">Step 3 — Multi-state complexity</div>
                <WhyWeAsk text="Multi-state payroll affects PT/LWF rules, attendance policies, and month-end edge cases—this is a key risk driver." />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {([
                  { k: "no", t: "No", d: "Single state" },
                  { k: "yes", t: "Yes", d: "2+ states" },
                ] as const).map((x) => {
                  const active = state.isMultiState === x.k;
                  return (
                    <button
                      key={x.k}
                      type="button"
                      onClick={() =>
                        setState((s) => ({
                          ...s,
                          isMultiState: x.k,
                          stateCount: x.k === "no" ? "1" : s.stateCount,
                        }))
                      }
                      className={`rounded-[var(--radius-md)] border p-4 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
                        active
                          ? "border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.12)]"
                          : "border-[var(--border-soft)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)]"
                      }`}
                      aria-pressed={active}
                    >
                      <div className="text-sm font-semibold text-[var(--text)]">{x.t}</div>
                      <div className="mt-1 text-xs text-[var(--text-muted)]">{x.d}</div>
                    </button>
                  );
                })}

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">How many states?</label>
                  <input
                    className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    placeholder={state.isMultiState === "yes" ? "e.g., 6" : "1"}
                    value={state.stateCount}
                    onChange={(e) => setState((s) => ({ ...s, stateCount: e.target.value }))}
                  />
                </div>
              </div>
            </motion.div>
          ) : null}

          {step === 4 ? (
            <motion.div key="s4" variants={stepVariants} initial="hidden" animate="show" exit="exit" transition={{ duration: 0.22 }}>
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-[var(--text)]">Step 4 — Integrations</div>
                <WhyWeAsk text="Integrations often decide implementation effort (accounting exports, biometric devices). We use this to remove bad fits early." />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text)]">
                  <input
                    type="checkbox"
                    checked={state.integrations.accounting}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        integrations: { ...s.integrations, accounting: e.target.checked },
                      }))
                    }
                  />
                  <div>
                    <div className="font-semibold">Accounting integration</div>
                    <div className="mt-1 text-xs text-[var(--text-muted)]">Tally / Zoho Books exports, journal entries</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text)]">
                  <input
                    type="checkbox"
                    checked={state.integrations.biometric}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        integrations: { ...s.integrations, biometric: e.target.checked },
                      }))
                    }
                  />
                  <div>
                    <div className="font-semibold">Biometric integration</div>
                    <div className="mt-1 text-xs text-[var(--text-muted)]">Device sync, shift/overtime rules</div>
                  </div>
                </label>

                <div className="sm:col-span-2 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-muted)]">
                  We’ll treat missing info as “validate” and flag it in your shortlist.
                </div>
              </div>
            </motion.div>
          ) : null}

          {step === 5 ? (
            <motion.div key="s5" variants={stepVariants} initial="hidden" animate="show" exit="exit" transition={{ duration: 0.22 }}>
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-[var(--text)]">Step 5 — Timeline</div>
                <WhyWeAsk text="Timeline changes what’s realistic (implementation, data migration, parallel runs). We bias recommendations to proven rollout paths." />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {([
                  { k: "asap", t: "ASAP", d: "0–2 weeks" },
                  { k: "1month", t: "1 month", d: "~30 days" },
                  { k: "later", t: "Later", d: "60+ days" },
                ] as const).map((x) => {
                  const active = state.timeline === x.k;
                  return (
                    <button
                      key={x.k}
                      type="button"
                      onClick={() => setState((s) => ({ ...s, timeline: x.k }))}
                      className={`rounded-[var(--radius-md)] border p-4 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
                        active
                          ? "border-[rgba(111,66,193,0.45)] bg-[rgba(111,66,193,0.18)]"
                          : "border-[var(--border-soft)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)]"
                      }`}
                      aria-pressed={active}
                    >
                      <div className="text-sm font-semibold text-[var(--text)]">{x.t}</div>
                      <div className="mt-1 text-xs text-[var(--text-muted)]">{x.d}</div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-muted)]">
                Next: we can either route you to the full evaluation flow, or generate a quick shortlist preview.
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* error */}
        {error ? (
          <div className="mt-4 rounded-[var(--radius-md)] border border-[rgba(244,63,94,0.35)] bg-[rgba(244,63,94,0.10)] px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {/* nav */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={back}
            disabled={step === 1}
            className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 text-sm font-semibold text-[var(--text)] transition-all duration-200 hover:bg-[var(--surface-3)] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto"
          >
            Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary)] px-5 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(111,66,193,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(111,66,193,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary)] px-5 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(111,66,193,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(111,66,193,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto"
            >
              Finish
            </button>
          )}
        </div>

        <div className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">
          Saved locally in this browser. (We don’t send partial data until you submit.)
        </div>
      </div>
    </div>
  );
}

export default ShortlistForm;
