"use client";

import type { BuyerSizeBand } from "@prisma/client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ToastViewport, type ToastModel } from "@/components/ui/Toast";

type Submission = {
  id: string;
  companyName: string | null;
  buyerEmail: string | null;
  buyerRole: string | null;
  sizeBand: BuyerSizeBand | null;
  states: string[];
  categoriesNeeded: string[];
  mustHaveIntegrations: string[];
  budgetNote: string | null;
  timelineNote: string | null;
};

type RecommendationResult = {
  version: number;
  criteria: {
    sizeBand: string;
    categoriesNeeded: string[];
    mustHaveIntegrations: string[];
  };
  tools: Array<{
    tool: {
      slug: string;
      name: string;
      tagline?: string | null;
      vendorName?: string | null;
    };
    score: number;
    matchedCategories: string[];
    why: string[];
  }>;
};

type ToolMeta = {
  slug: string;
  lastVerifiedAt: string | null;
  vendorName: string | null;
};

type PayrollDecisionInputs = {
  statutoryComplexity: string | null;
  complianceNeeded: string[];
  gstRequired: string | null;
  dataResidency: string | null;
};

export default function ResultsClient({
  runId,
  submission,
  result,
}: {
  runId: string;
  submission: Submission;
  result: RecommendationResult;
}) {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState(submission.buyerEmail ?? "");
  const [contactPhone, setContactPhone] = useState("");
  const [useCase, setUseCase] = useState(() => {
    const parts: string[] = [];
    if (submission.categoriesNeeded?.length) parts.push(`Need: ${submission.categoriesNeeded.map(prettyCategory).join(", ")}`);
    if (submission.mustHaveIntegrations?.length) parts.push(`Integrations: ${submission.mustHaveIntegrations.join(", ")}`);
    if (submission.states?.length) parts.push(`States: ${submission.states.join(", ")}`);
    if (submission.budgetNote) parts.push(`Budget: ${submission.budgetNote}`);
    if (submission.timelineNote) parts.push(`Timeline: ${submission.timelineNote}`);
    return parts.join("\n");
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastModel[]>([]);

  function toast(t: Omit<ToastModel, "id">) {
    setToasts((prev) => [{ id: crypto.randomUUID(), ...t }, ...prev].slice(0, 3));
  }

  const picks = useMemo(() => result?.tools ?? [], [result]);
  const primaryPick = picks[0] ?? null;
  const alternatives = picks.slice(1);

  const compareHref = useMemo(() => {
    const slugs = (result?.tools ?? []).map((t) => t.tool.slug).filter(Boolean).slice(0, 4);
    if (slugs.length < 2) return null;
    return `/compare?tools=${encodeURIComponent(slugs.join(","))}`;
  }, [result]);

  const decisionInputs = useMemo(() => extractPayrollDecisionInputs(submission.budgetNote || ""), [submission.budgetNote]);

  const [toolMeta, setToolMeta] = useState<Record<string, ToolMeta>>({});

  useEffect(() => {
    const slugs = picks.map((p) => p.tool.slug).filter(Boolean);
    if (!slugs.length) return;

    let cancelled = false;
    (async () => {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slugs: slugs.slice(0, 5) }),
      }).catch(() => null);

      const data = await res?.json().catch(() => null);
      if (!res?.ok || !data?.ok || !Array.isArray(data.tools)) return;

      const next: Record<string, ToolMeta> = {};
      for (const t of data.tools as Array<{ slug: string; lastVerifiedAt: string | null; vendorName: string | null }>) {
        next[t.slug] = { slug: t.slug, lastVerifiedAt: t.lastVerifiedAt, vendorName: t.vendorName };
      }

      if (!cancelled) setToolMeta(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [picks]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />
      <ToastViewport toasts={toasts} dismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <main className="py-8 sm:py-12">
        <Container className="max-w-5xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">Your shortlist</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                We picked 3–5 best-fit tools and surfaced trust signals (verification freshness) so you can move forward with confidence.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {compareHref ? (
                <Link className="text-sm font-medium text-indigo-700 hover:underline" href={compareHref}>
                  Compare
                </Link>
              ) : null}
              <Link className="text-sm font-medium text-indigo-700 hover:underline" href="/recommend">
                Edit answers
              </Link>
            </div>
          </div>

          <div className="mt-4 h-px w-full bg-[var(--border-soft)]" />

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MomentumStep step={2} title="Shortlist" desc="Explainable picks" active />
            <MomentumStep step={3} title="Next" desc="Request intro" />
            <MomentumStep step={4} title="Decide" desc="Compare + demo" />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {submission.categoriesNeeded.slice(0, 5).map((c) => (
                <span key={c} className="rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
                  {prettyCategory(c)}
                </span>
              ))}
              {submission.mustHaveIntegrations.length ? (
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
                  Integrations: {submission.mustHaveIntegrations.join(", ")}
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href="#intro"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-700 px-4 text-sm font-semibold text-white hover:bg-indigo-800"
              >
                Request pricing & intro
              </a>
              {primaryPick ? (
                <Link
                  href={`/tools/${primaryPick.tool.slug}`}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-1)] px-4 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
                >
                  View top pick
                </Link>
              ) : null}
            </div>
          </div>

        {decisionInputs ? (
          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-[var(--text)]">Payroll decision context</div>
                <div className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                  This is what we’ll optimize for. If a tool’s evidence is missing or stale, we’ll call it out.
                </div>
              </div>
              <div className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
                Trust: evidence + recency
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-[var(--text)] sm:grid-cols-2">
              <Chip label="Compliance" value={decisionInputs.complianceNeeded.join(", ") || "—"} />
              <Chip label="Complexity" value={decisionInputs.statutoryComplexity || "—"} />
              <Chip label="GST invoicing" value={decisionInputs.gstRequired || "—"} />
              <Chip label="Data residency" value={decisionInputs.dataResidency || "—"} />
            </div>
          </div>
        ) : null}

        <div className="mt-8 space-y-4">
          {picks.length === 0 ? (
            <Card className="shadow-sm">
              <div className="text-base font-semibold text-[var(--text)]">No matches yet</div>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                We couldn’t find published tools that match your selected categories/integrations. Try removing an integration requirement, or
                browse the directory.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white" href="/recommend">
                  Update answers
                </Link>
                <Link className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)]" href="/tools">
                  Browse tools
                </Link>
              </div>
            </Card>
          ) : null}

          {primaryPick ? (
            <Card className="relative overflow-hidden border border-[var(--border)] bg-[var(--surface-1)] shadow-sm">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800">
                    Primary recommendation
                  </div>
                  <div className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text)]">{primaryPick.tool.name}</div>
                  {(() => {
                    const meta = toolMeta[primaryPick.tool.slug];
                    const vendorName = meta?.vendorName ?? primaryPick.tool.vendorName;
                    return vendorName ? <div className="mt-1 text-sm text-[var(--text-muted)]">by {vendorName}</div> : null;
                  })()}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(() => {
                    const meta = toolMeta[primaryPick.tool.slug];
                    const freshness = meta?.lastVerifiedAt ? freshnessLabel(meta.lastVerifiedAt) : null;
                    if (!freshness)
                      return (
                        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)]">
                          Verification: unknown
                        </span>
                      );
                    return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${freshness.tone}`}>{freshness.label}</span>;
                  })()}
                  <span className="text-xs text-[var(--text-muted)]">Score {primaryPick.score}</span>
                </div>
              </div>

              {primaryPick.tool.tagline ? <div className="mt-3 text-[var(--text)]">{primaryPick.tool.tagline}</div> : null}

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <div className="text-sm font-semibold text-[var(--text)]">Why shortlisted</div>
                  <ul className="mt-3 space-y-2">
                    {primaryPick.why.slice(0, 7).map((w) => (
                      <li key={w} className="flex gap-2 text-sm leading-6 text-[var(--text)]">
                        <span className="mt-[2px] inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                          ✓
                        </span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-semibold text-[var(--text)]">Decision-ready checks</div>
                  <div className="mt-3 space-y-2">
                    <MiniRow label="Compliance" value={decisionInputs?.complianceNeeded?.length ? decisionInputs.complianceNeeded.join(", ") : "Validate"} />
                    <MiniRow label="GST" value={decisionInputs?.gstRequired ?? "Validate"} />
                    <MiniRow label="Residency" value={decisionInputs?.dataResidency ?? "Validate"} />
                    <div className="text-xs leading-5 text-[var(--text-muted)]">
                      Use tool details to verify sources. Unknowns are highlighted so you can validate fast.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Link className="text-sm font-semibold text-indigo-700 hover:underline" href={`/tools/${primaryPick.tool.slug}`}>
                  View top pick details →
                </Link>
                <div className="flex flex-wrap gap-2">
                  {compareHref ? (
                    <Link
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-1)] px-4 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
                      href={compareHref}
                    >
                      Compare
                    </Link>
                  ) : null}
                  <a
                    href="#intro"
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-700 px-4 text-sm font-semibold text-white hover:bg-indigo-800"
                  >
                    Request intro
                  </a>
                </div>
              </div>
            </Card>
          ) : null}

          {alternatives.length ? (
            <div className="pt-2">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 className="text-base font-semibold text-[var(--text)]">Alternatives</h2>
                <div className="text-xs text-[var(--text-muted)]">Useful to sanity-check pricing, payroll edge cases, and support</div>
              </div>

              <div className="space-y-4">
                {alternatives.map((p) => {
                  const meta = toolMeta[p.tool.slug];
                  const freshness = meta?.lastVerifiedAt ? freshnessLabel(meta.lastVerifiedAt) : null;
                  const vendorName = meta?.vendorName ?? p.tool.vendorName;

                  return (
                    <Card key={p.tool.slug} className="shadow-sm">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="text-lg font-semibold text-[var(--text)]">{p.tool.name}</div>
                          {vendorName ? <div className="mt-1 text-sm text-[var(--text-muted)]">by {vendorName}</div> : null}
                        </div>
                        <div className="flex items-center gap-2">
                          {freshness ? (
                            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${freshness.tone}`}>{freshness.label}</span>
                          ) : (
                            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)]">
                              Verification: unknown
                            </span>
                          )}
                          <span className="text-xs text-[var(--text-muted)]">Score {p.score}</span>
                        </div>
                      </div>

                      {p.tool.tagline ? <div className="mt-2 text-sm text-[var(--text)]">{p.tool.tagline}</div> : null}

                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                          <div className="text-sm font-semibold text-[var(--text)]">Why shortlisted</div>
                          <ul className="mt-2 space-y-2">
                            {p.why.slice(0, 4).map((w) => (
                              <li key={w} className="flex gap-2 text-sm leading-6 text-[var(--text-muted)]">
                                <span className="mt-[2px] inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
                                  •
                                </span>
                                <span>{w}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[var(--text)]">Next to validate</div>
                          <div className="mt-2 space-y-2">
                            <MiniRow label="Payroll" value="Edge cases" />
                            <MiniRow label="Compliance" value="Evidence" />
                            <MiniRow label="Support" value="SLA" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link className="text-sm font-semibold text-indigo-700 hover:underline" href={`/tools/${p.tool.slug}`}>
                          View details →
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : null}

          {picks.length ? (
            <Card className="shadow-sm">
              <details>
                <summary className="cursor-pointer text-sm font-semibold text-[var(--text)]">Why not others?</summary>
                <div className="mt-3 text-sm text-[var(--text)]">
                  <p className="text-[var(--text-muted)]">
                    HRSignal shows the top 3–5 tools for your inputs. Tools that are not shown typically fall into one (or more) buckets:
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex gap-2">
                      <span className="mt-[2px] inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text)]">•</span>
                      <span>Lower overall fit score for your size/integrations/requirements.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[2px] inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text)]">•</span>
                      <span>Missing evidence for critical payroll/compliance claims (we’ll say “validate”).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[2px] inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text)]">•</span>
                      <span>Stale or unknown verification freshness (we surface “verified recently” when dates exist).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[2px] inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text)]">•</span>
                      <span>Doesn’t match must-have integrations (if selected).</span>
                    </li>
                  </ul>
                </div>
              </details>
            </Card>
          ) : null}
        </div>

        <div className="mt-10" id="intro">
          <Card className="shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)]">Get pricing & vendor intro</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  We’ll review and share your requirement with one best-fit vendor (not blasted to everyone).
                </p>
              </div>
              <div className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
                Momentum: shortlist → intro → demo
              </div>
            </div>

          <form
            className="mt-5 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setSending(true);
              try {
                const res = await fetch("/api/leads", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({
                    submissionId: submission.id,
                    runId,
                    source: "results-cta",
                    companyName: submission.companyName,
                    name: contactName,
                    email: contactEmail,
                    phone: contactPhone,
                    useCase,
                    buyerRole: submission.buyerRole,
                    sizeBand: submission.sizeBand,
                    states: submission.states,
                    categoriesNeeded: submission.categoriesNeeded,
                    mustHaveIntegrations: submission.mustHaveIntegrations,
                    budgetNote: submission.budgetNote,
                    timelineNote: submission.timelineNote,
                  }),
                });

                const data = await res.json().catch(() => null);
                if (!res.ok) {
                  const msg = data?.error || "Please check the form and try again.";
                  setError(msg);
                  toast({ type: "error", title: "Couldn’t submit", description: msg });
                  return;
                }

                if (!data?.ok) {
                  const msg = data?.error || "Please check the form and try again.";
                  setError(msg);
                  toast({ type: "error", title: "Couldn’t submit", description: msg });
                  return;
                }

                setSent(true);
                // Inline success state is shown below; avoid global toast for success.
              } catch {
                const msg = "Something went wrong on our side. Please try again in a minute.";
                setError(msg);
                toast({ type: "error", title: "Network error", description: "Please try again in a moment." });
              } finally {
                setSending(false);
              }
            }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Your name</label>
                <input className="input mt-1" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">Work email</label>
                <input
                  className="input mt-1"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="you@company.com"
                  required={!contactPhone}
                />
                <p className="mt-1 text-xs text-[var(--text-muted)]">Email preferred (or share a phone number below).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Phone (optional)</label>
                <input className="input mt-1" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">What do you need?</label>
                <textarea
                  className="input mt-1 min-h-[44px]"
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  placeholder="Eg: Need payroll + attendance, demo next week"
                  required
                />
                <p className="mt-1 text-xs text-[var(--text-muted)]">A short note helps us pick one best-fit vendor.</p>
              </div>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className={`transition-opacity duration-200 ${sent ? "opacity-100" : "opacity-0"}`} aria-hidden={!sent}>
              {sent ? (
                <div className="flex items-start gap-2 text-sm text-emerald-300">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>Request received. We will share one best-fit vendor shortly.</div>
                </div>
              ) : null}
            </div>

            <Button disabled={sending || sent}>
              {sent ? "Submitted" : sending ? "Submitting…" : "Submit"}
            </Button>
          </form>
          </Card>
        </div>
      </Container>
    </main>

    <SiteFooter />
  </div>
  );
}

function prettyCategory(slug: string) {
  const map: Record<string, string> = {
    hrms: "HRMS / Core HR",
    payroll: "Payroll & Compliance",
    ats: "Recruitment / ATS",
    bgv: "Background Verification",
    performance: "Performance & OKRs",
    engagement: "Engagement & Surveys",
    lms: "LMS / Training",
    attendance: "Time & Attendance",
  };
  return map[slug] ?? slug;
}

function MomentumStep({
  step,
  title,
  desc,
  active,
}: {
  step: number;
  title: string;
  desc: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border px-4 py-4 ${
        active
          ? "border-[rgba(255,255,255,0.14)] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)]"
          : "border-[var(--border-soft)] bg-[var(--surface-1)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div
            className={`text-xs font-medium ${
              active ? "text-white/85" : "text-[var(--text-muted)]"
            }`}
          >
            Step {step}
          </div>
          <div className={`mt-1 text-sm font-medium ${active ? "text-white" : "text-[var(--text)]"}`}>{title}</div>
          <div className={`mt-1 text-xs leading-5 ${active ? "text-white/85" : "text-[var(--text-muted)]"}`}>{desc}</div>
        </div>
        <div
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
            active ? "bg-white/15 text-white" : "border border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text)]"
          }`}
        >
          {step}
        </div>
      </div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
      <div className="text-xs font-semibold text-zinc-500">{label}</div>
      <div className="text-sm font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

function MiniRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2">
      <div className="text-xs font-semibold text-zinc-500">{label}</div>
      <div className="text-xs font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

function extractPayrollDecisionInputs(note: string): PayrollDecisionInputs | null {
  // The payroll decision wizard appends a structured block into budgetNote.
  if (!note || !note.includes("Category: Payroll")) return null;

  const compliance = matchLine(note, /^Compliance needed:\s*(.*)$/m)
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((x) => x !== "-") ?? [];

  return {
    statutoryComplexity: matchLine(note, /^Statutory complexity:\s*(.*)$/m) ?? null,
    complianceNeeded: compliance,
    gstRequired: matchLine(note, /^GST invoicing required:\s*(.*)$/m) ?? null,
    dataResidency: matchLine(note, /^Data residency:\s*(.*)$/m) ?? null,
  };
}

function matchLine(input: string, re: RegExp) {
  const m = input.match(re);
  const v = m?.[1]?.trim();
  if (!v) return null;
  return v;
}

function freshnessLabel(iso: string): { label: string; tone: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { label: "Verified: unknown", tone: "border-zinc-200 bg-white text-zinc-600" };

  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 45) return { label: `Verified recently (${days}d)`, tone: "border-emerald-200 bg-emerald-50 text-emerald-800" };
  if (days <= 120) return { label: `Verified (${days}d ago)`, tone: "border-amber-200 bg-amber-50 text-amber-800" };
  return { label: `Verification stale (${days}d)`, tone: "border-rose-200 bg-rose-50 text-rose-800" };
}
