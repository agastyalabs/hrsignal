"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { TrackedButtonLink } from "@/components/analytics/TrackedButtonLink";

type QuickModule = "payroll" | "hrms" | "attendance" | "ats" | "performance";

type SizeChoice = "1-50" | "51-200" | "201-500" | "501-1000" | "1000+";

type TimelineChoice = "0-30" | "30-60" | "60-90" | "90+";

const MODULE_OPTIONS: Array<{ value: QuickModule; label: string; helper: string }> = [
  { value: "payroll", label: "Payroll & Compliance", helper: "PF/ESI/PT/TDS, month-end controls" },
  { value: "hrms", label: "Core HRMS", helper: "Employee master, approvals, docs" },
  { value: "attendance", label: "Attendance / Leave", helper: "Shifts, overtime, devices" },
  { value: "ats", label: "ATS / Hiring", helper: "Pipeline, interviews, offers" },
  { value: "performance", label: "Performance / OKR", helper: "Goals, reviews, check-ins" },
];

function mapSizeToBuyerBand(size: SizeChoice): "EMP_20_200" | "EMP_50_500" | "EMP_100_1000" {
  // BuyerSizeBand (DB) is coarse; map user choice deterministically.
  if (size === "1-50") return "EMP_20_200";
  if (size === "51-200") return "EMP_20_200";
  if (size === "201-500") return "EMP_50_500";
  if (size === "501-1000") return "EMP_100_1000";
  return "EMP_100_1000";
}

function mapTimelineLabel(t: TimelineChoice) {
  if (t === "0-30") return "0–30 days";
  if (t === "30-60") return "30–60 days";
  if (t === "60-90") return "60–90 days";
  return "90+ days";
}

const container = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function DualPathHero() {
  const [path, setPath] = useState<"quick" | "detailed">("quick");

  // Quick Match inputs
  const [email, setEmail] = useState("");
  const [companySize, setCompanySize] = useState<SizeChoice>("51-200");
  const [primaryModule, setPrimaryModule] = useState<QuickModule>("payroll");
  const [timeline, setTimeline] = useState<TimelineChoice>("0-30");

  // Detailed Evaluation inputs
  const [dEmail, setDEmail] = useState("");
  const [dCompanySize, setDCompanySize] = useState<SizeChoice>("51-200");
  const [dModules, setDModules] = useState<QuickModule[]>(["payroll"]);
  const [dComplexity, setDComplexity] = useState<"basic" | "multi-state" | "multi-entity">("multi-state");
  const [dStates, setDStates] = useState("");
  const [dIntegrations, setDIntegrations] = useState<string[]>(["tally"]);
  const [dMakerChecker, setDMakerChecker] = useState(true);
  const [dTimeline, setDTimeline] = useState<TimelineChoice>("30-60");

  const quickAction = useMemo(() => {
    const qs = new URLSearchParams({
      mode: "quick",
      source: "hero_quick",
    });
    return `/recommend?${qs.toString()}`;
  }, []);

  const detailedAction = useMemo(() => {
    const qs = new URLSearchParams({
      mode: "detailed",
      source: "hero_detailed",
    });
    return `/recommend?${qs.toString()}`;
  }, []);

  return (
    <div className="rounded-[1.2rem] border border-[var(--border-soft)] bg-[linear-gradient(to_bottom,#000000,#0f172a)]">
      <div className="grid grid-cols-1 gap-8 p-5 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
        {/* Left */}
        <motion.div
          className="lg:col-span-7"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="mx-auto text-center text-xs font-semibold tracking-[0.12em] text-[var(--text-muted)] lg:text-left"
            variants={item}
          >
            DECISION INTELLIGENCE FOR INDIA HR SOFTWARE
          </motion.div>

          <motion.h1
            className="mx-auto mt-3 max-w-5xl text-center text-5xl font-extrabold leading-[1.02] tracking-[-0.03em] text-[var(--text)] sm:text-6xl lg:text-left lg:text-7xl"
            variants={item}
          >
            Shortlist India-ready HRMS & Payroll — without month-end surprises.
          </motion.h1>

          <motion.p
            className="mx-auto mt-4 max-w-5xl text-center text-base leading-7 text-[var(--text-muted)] lg:text-left"
            variants={item}
          >
            Get 3–5 best-fit tools based on headcount, modules, integrations, and multi-state compliance — with fit scores, evidence links, and a demo checklist that catches PF/ESI/PT/TDS edge cases.
          </motion.p>

          {/* Social proof bar */}
          <motion.div
            className="mx-auto mt-6 max-w-5xl rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-3 text-center text-sm leading-6 text-[var(--text-muted)] lg:text-left"
            variants={item}
          >
            <span className="font-semibold text-[var(--text)]">Trusted by 200+ HR leaders</span> evaluating multi-state payroll complexity.
          </motion.div>

          {/* Path switch */}
          <motion.div className="mt-6" variants={item}>
            <div className="inline-flex w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-1 sm:w-auto">
              <button
                type="button"
                onClick={() => setPath("quick")}
                className={`h-10 flex-1 rounded-[calc(var(--radius-md)-4px)] px-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:flex-none ${
                  path === "quick"
                    ? "bg-[rgba(111,66,193,0.25)] text-[var(--text)] shadow-[0_10px_30px_rgba(111,66,193,0.25)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
                aria-pressed={path === "quick"}
              >
                Quick Match (2 min)
              </button>
              <button
                type="button"
                onClick={() => setPath("detailed")}
                className={`h-10 flex-1 rounded-[calc(var(--radius-md)-4px)] px-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:flex-none ${
                  path === "detailed"
                    ? "bg-[rgba(111,66,193,0.25)] text-[var(--text)] shadow-[0_10px_30px_rgba(111,66,193,0.25)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
                aria-pressed={path === "detailed"}
              >
                Detailed Evaluation
              </button>
            </div>
          </motion.div>

          {/* Forms */}
          <motion.div className="mt-5" variants={item}>
            {path === "quick" ? (
              <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-5">
                <div className="text-sm font-semibold text-[var(--text)]">Quick Match</div>
                <div className="mt-1 text-sm text-[var(--text-muted)]">4 fields → generates a shortlist preview.</div>

                <form
                  className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
                  action="/recommend/submit"
                  method="post"
                >
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Work email</label>
                    <input
                      className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      type="email"
                      name="buyerEmail"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Company size</label>
                    <select
                      className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 text-sm text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      name="sizeBand"
                      value={mapSizeToBuyerBand(companySize)}
                      onChange={(e) => {
                        const v = e.target.value as "EMP_20_200" | "EMP_50_500" | "EMP_100_1000";
                        if (v === "EMP_20_200") setCompanySize("51-200");
                        if (v === "EMP_50_500") setCompanySize("201-500");
                        if (v === "EMP_100_1000") setCompanySize("501-1000");
                      }}
                    >
                      <option value="EMP_20_200">1–200 employees</option>
                      <option value="EMP_50_500">201–500 employees</option>
                      <option value="EMP_100_1000">501–1000+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Primary module</label>
                    <select
                      className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 text-sm text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      name="primaryModule"
                      value={primaryModule}
                      onChange={(e) => setPrimaryModule(e.target.value as QuickModule)}
                    >
                      {MODULE_OPTIONS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Timeline</label>
                    <select
                      className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 text-sm text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      name="timelineNote"
                      value={mapTimelineLabel(timeline)}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v.startsWith("0–")) setTimeline("0-30");
                        else if (v.startsWith("30–")) setTimeline("30-60");
                        else if (v.startsWith("60–")) setTimeline("60-90");
                        else setTimeline("90+");
                      }}
                    >
                      <option value="0–30 days">0–30 days</option>
                      <option value="30–60 days">30–60 days</option>
                      <option value="60–90 days">60–90 days</option>
                      <option value="90+ days">90+ days</option>
                    </select>
                  </div>

                  {/* Hidden minimal fields to keep /recommend/submit compatible */}
                  <input type="hidden" name="companyName" value="" />
                  <input type="hidden" name="buyerRole" value="" />

                  <div className="sm:col-span-2 mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <TrackedButtonLink
                      event="primary_cta_click"
                      href={quickAction}
                      size="md"
                      variant="secondary"
                      className="w-full justify-center sm:w-auto"
                    >
                      Or open full flow →
                    </TrackedButtonLink>

                    <button
                      type="submit"
                      className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary)] px-5 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(111,66,193,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(111,66,193,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto"
                    >
                      Get my shortlist preview
                    </button>
                  </div>

                  <div className="sm:col-span-2 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                    <span className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1">No vendor spam</span>
                    <span className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1">No paid ranking</span>
                    <span className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1">SOC 2</span>
                    <span className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1">GDPR-ready</span>
                  </div>
                </form>
              </div>
            ) : (
              <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-5">
                <div className="text-sm font-semibold text-[var(--text)]">Detailed Evaluation</div>
                <div className="mt-1 text-sm text-[var(--text-muted)]">
                  Multi-state compliance + integrations + controls. We’ll capture constraints and route you into the full evaluation.
                </div>

                <form
                  className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    // Lead capture best-effort, then route to /recommend detailed.
                    try {
                      await fetch("/api/leads", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({
                          type: "shortlist",
                          email: dEmail,
                          metadata: {
                            source: "hero_detailed",
                            companySize: dCompanySize,
                            modules: dModules,
                            statutoryComplexity: dComplexity,
                            states: dStates,
                            integrations: dIntegrations,
                            makerChecker: dMakerChecker,
                            timeline: mapTimelineLabel(dTimeline),
                          },
                        }),
                      });
                    } catch {
                      // non-blocking
                    }
                    window.location.href = detailedAction;
                  }}
                >
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Work email</label>
                    <input
                      className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={dEmail}
                      onChange={(e) => setDEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Company size</label>
                    <select
                      className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 text-sm text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      value={dCompanySize}
                      onChange={(e) => setDCompanySize(e.target.value as SizeChoice)}
                    >
                      <option value="1-50">1–50</option>
                      <option value="51-200">51–200</option>
                      <option value="201-500">201–500</option>
                      <option value="501-1000">501–1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Statutory complexity</label>
                    <select
                      className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 text-sm text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      value={dComplexity}
                      onChange={(e) => setDComplexity(e.target.value as typeof dComplexity)}
                    >
                      <option value="basic">Basic</option>
                      <option value="multi-state">Multi-state</option>
                      <option value="multi-entity">Multi-entity</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Modules needed</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {MODULE_OPTIONS.map((m) => {
                        const active = dModules.includes(m.value);
                        return (
                          <button
                            key={m.value}
                            type="button"
                            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
                              active
                                ? "border-[rgba(111,66,193,0.45)] bg-[rgba(111,66,193,0.22)] text-[var(--text)]"
                                : "border-[var(--border-soft)] bg-[var(--surface-1)] text-[var(--text-muted)] hover:text-[var(--text)]"
                            }`}
                            onClick={() => {
                              if (active) setDModules((prev) => prev.filter((x) => x !== m.value));
                              else setDModules((prev) => [...prev, m.value]);
                            }}
                            aria-pressed={active}
                          >
                            {m.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-2 text-xs text-[var(--text-muted)]">Tip: payroll + attendance is the common India setup.</div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[var(--text-muted)]">States of operation (comma-separated)</label>
                    <input
                      className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      value={dStates}
                      onChange={(e) => setDStates(e.target.value)}
                      placeholder="KA, MH, DL"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Must-have integrations</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["tally", "zoho-books", "google-workspace"].map((x) => {
                        const active = dIntegrations.includes(x);
                        return (
                          <button
                            key={x}
                            type="button"
                            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
                              active
                                ? "border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.14)] text-emerald-200"
                                : "border-[var(--border-soft)] bg-[var(--surface-1)] text-[var(--text-muted)] hover:text-[var(--text)]"
                            }`}
                            onClick={() => {
                              if (active) setDIntegrations((prev) => prev.filter((v) => v !== x));
                              else setDIntegrations((prev) => [...prev, x]);
                            }}
                            aria-pressed={active}
                          >
                            {x}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-[var(--text)]">Maker-checker control</div>
                      <div className="text-xs text-[var(--text-muted)]">Recommended for payroll audit readiness</div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <input
                        type="checkbox"
                        checked={dMakerChecker}
                        onChange={(e) => setDMakerChecker(e.target.checked)}
                      />
                      Required
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Timeline</label>
                    <select
                      className="mt-1 h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 text-sm text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      value={dTimeline}
                      onChange={(e) => setDTimeline(e.target.value as TimelineChoice)}
                    >
                      <option value="0-30">0–30 days</option>
                      <option value="30-60">30–60 days</option>
                      <option value="60-90">60–90 days</option>
                      <option value="90+">90+ days</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href={detailedAction}
                      className="w-full text-center text-sm font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 transition-all duration-200 hover:text-violet-100 hover:decoration-[rgba(124,77,255,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto"
                    >
                      Or skip to full evaluation →
                    </Link>

                    <button
                      type="submit"
                      className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary)] px-5 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(111,66,193,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(111,66,193,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto"
                    >
                      Continue to detailed evaluation
                    </button>
                  </div>

                  <div className="sm:col-span-2 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                    <span className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1">Evidence links included</span>
                    <span className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1">Risk flags highlighted</span>
                    <span className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1">SOC 2</span>
                    <span className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1">GDPR-ready</span>
                  </div>
                </form>
              </div>
            )}
          </motion.div>

          <motion.div className="mt-5" variants={item}>
            <Link
              href="/tools?category=payroll"
              className="pt-1 text-center text-sm font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 transition-all duration-200 hover:text-violet-100 hover:decoration-[rgba(124,77,255,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:text-left"
            >
              Browse HRMS & payroll tools →
            </Link>
          </motion.div>
        </motion.div>

        {/* Right: animated preview */}
        <motion.div
          className="lg:col-span-5"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <motion.div variants={item}>
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-6">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[rgba(111,66,193,0.22)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[rgba(34,197,94,0.14)] blur-3xl" />

        <div className="relative">
          <div className="text-xs font-medium tracking-wide text-[var(--text-muted)]">Preview · sample output</div>
          <div className="mt-2 text-base font-semibold text-[var(--text)]">Fit scores + vendor cards</div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <MetricCard label="Fit score" value="92/100" tone="good" />
            <MetricCard label="Risk flags" value="3" tone="warn" />
            <MetricCard label="Evidence links" value="12" tone="neutral" />
            <MetricCard label="Integrations" value="Tally, SSO" tone="neutral" small />
          </div>

          <div className="mt-5 space-y-3">
            <VendorMiniCard name="Keka" score={91} note="Strong payroll + attendance coverage" />
            <VendorMiniCard name="greytHR" score={86} note="Good compliance depth, validate integrations" />
            <VendorMiniCard name="Zoho People" score={79} note="HRMS-first; payroll fit depends on scope" />
          </div>

          <motion.div
            className="mt-5 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-muted)]"
            animate={{ boxShadow: [
              "0 0 0 rgba(111,66,193,0)",
              "0 0 0 10px rgba(111,66,193,0.05)",
              "0 0 0 rgba(111,66,193,0)",
            ] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Explainable reasons + demo checklist for PF/ESI/PT/TDS edge cases.
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({
  label,
  value,
  tone,
  small,
}: {
  label: string;
  value: string;
  tone: "good" | "warn" | "neutral";
  small?: boolean;
}) {
  const toneClass =
    tone === "good"
      ? "border-[rgba(34,197,94,0.28)] bg-[rgba(34,197,94,0.10)]"
      : tone === "warn"
        ? "border-[rgba(245,158,11,0.30)] bg-[rgba(245,158,11,0.10)]"
        : "border-[var(--border-soft)] bg-[var(--surface-1)]";

  return (
    <div className={`rounded-[var(--radius-md)] border ${toneClass} px-4 py-3`}>
      <div className="text-[11px] font-semibold text-[var(--text-muted)]">{label}</div>
      <div className={`mt-1 font-extrabold tracking-tight text-[var(--text)] ${small ? "text-sm" : "text-2xl"}`}>{value}</div>
    </div>
  );
}

function VendorMiniCard({ name, score, note }: { name: string; score: number; note: string }) {
  return (
    <motion.div
      className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-[var(--text)]">{name}</div>
          <div className="mt-1 text-xs text-[var(--text-muted)]">{note}</div>
        </div>
        <div className="shrink-0 rounded-full border border-[rgba(111,66,193,0.35)] bg-[rgba(111,66,193,0.18)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
          {score}
        </div>
      </div>

      <motion.div
        className="mt-3 h-2 overflow-hidden rounded-full bg-[rgba(148,163,184,0.16)]"
        aria-hidden="true"
      >
        <motion.div
          className="h-full rounded-full bg-[rgba(111,66,193,0.75)]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(5, Math.min(100, score))}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>
    </motion.div>
  );
}
