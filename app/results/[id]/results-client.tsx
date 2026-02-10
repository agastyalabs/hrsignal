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
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <ToastViewport toasts={toasts} dismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <main className="py-10 sm:py-14">
        <Container className="max-w-5xl">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-2xl font-semibold">Your HR stack shortlist</h1>
          <div className="flex items-center gap-3">
            {compareHref ? (
              <Link className="text-sm font-medium text-indigo-700 hover:underline" href={compareHref}>
                Compare
              </Link>
            ) : null}
            <Link className="text-sm font-medium text-indigo-700 hover:underline" href="/recommend">
              Start over
            </Link>
          </div>
        </div>
        <p className="mt-2 text-zinc-600">
          Based on your inputs, here are 3–5 best-fit tools. Want pricing/demo help? Submit your details and we’ll route you to the best-fit
          vendor.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {submission.categoriesNeeded.slice(0, 5).map((c) => (
            <span key={c} className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700">
              {prettyCategory(c)}
            </span>
          ))}
          {submission.mustHaveIntegrations.length ? (
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700">
              Integrations: {submission.mustHaveIntegrations.join(", ")}
            </span>
          ) : null}
        </div>

        {decisionInputs ? (
          <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Payroll decision context</div>
                <div className="mt-1 text-xs text-zinc-500">We’ll highlight verification freshness when we have dates, and call out what to validate.</div>
              </div>
              <div className="text-xs text-zinc-500">Trust-first: evidence & recency over guesswork</div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-zinc-700 sm:grid-cols-2">
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
              <div className="text-base font-semibold text-zinc-900">No matches yet</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                We couldn’t find published tools that match your selected categories/integrations.
                Try removing an integration requirement, or browse the directory.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white" href="/recommend">
                  Update answers
                </Link>
                <Link className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium" href="/tools">
                  Browse tools
                </Link>
              </div>
            </Card>
          ) : null}

          {picks.map((p) => {
            const meta = toolMeta[p.tool.slug];
            const freshness = meta?.lastVerifiedAt ? freshnessLabel(meta.lastVerifiedAt) : null;
            const vendorName = meta?.vendorName ?? p.tool.vendorName;

            return (
              <Card key={p.tool.slug} className="shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-xl font-semibold text-zinc-900">{p.tool.name}</div>
                    {vendorName ? <div className="mt-1 text-sm text-zinc-600">by {vendorName}</div> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    {freshness ? (
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${freshness.tone}`}>{freshness.label}</span>
                    ) : (
                      <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-600">
                        Verification: unknown
                      </span>
                    )}
                    <span className="text-xs text-zinc-500">Score {p.score}</span>
                  </div>
                </div>

                {p.tool.tagline ? <div className="mt-2 text-zinc-700">{p.tool.tagline}</div> : null}

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <div className="text-sm font-semibold text-zinc-900">Why shortlisted</div>
                    <ul className="mt-2 space-y-2">
                      {p.why.slice(0, 6).map((w) => (
                        <li key={w} className="flex gap-2 text-sm leading-6 text-zinc-700">
                          <span className="mt-[2px] inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                            ✓
                          </span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-zinc-900">Compliance fit (validate)</div>
                    <div className="mt-2 space-y-2 text-sm text-zinc-700">
                      {decisionInputs?.complianceNeeded?.length ? (
                        <MiniRow label="Compliance" value={decisionInputs.complianceNeeded.join(", ")} />
                      ) : (
                        <MiniRow label="Compliance" value="Validate in demo" />
                      )}
                      <MiniRow label="GST" value={decisionInputs?.gstRequired ?? "Validate"} />
                      <MiniRow label="Residency" value={decisionInputs?.dataResidency ?? "Validate"} />
                      <div className="text-xs leading-5 text-zinc-500">
                        Tool-level evidence can be partial. Use “View details” to check sources and freshness.
                      </div>
                    </div>
                  </div>
                </div>

                {p.matchedCategories.length ? (
                  <div className="mt-4 text-sm text-zinc-600">Matches: {p.matchedCategories.map(prettyCategory).join(", ")}</div>
                ) : null}

                <div className="mt-4">
                  <Link className="text-sm font-medium text-indigo-700 hover:underline" href={`/tools/${p.tool.slug}`}>
                    View details →
                  </Link>
                </div>
              </Card>
            );
          })}

          {picks.length ? (
            <Card className="shadow-sm">
              <details>
                <summary className="cursor-pointer text-sm font-semibold text-zinc-900">Why not others?</summary>
                <div className="mt-3 text-sm text-zinc-700">
                  <p className="text-zinc-600">
                    HRSignal shows the top 3–5 tools for your inputs. Tools that are not shown typically fall into one (or more) buckets:
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex gap-2">
                      <span className="mt-[2px] inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-zinc-100 text-zinc-700">•</span>
                      <span>Lower overall fit score for your size/integrations/requirements.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[2px] inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-zinc-100 text-zinc-700">•</span>
                      <span>Missing evidence for critical payroll/compliance claims (we’ll say “validate”).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[2px] inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-zinc-100 text-zinc-700">•</span>
                      <span>Stale or unknown verification freshness (we surface “verified recently” when dates exist).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[2px] inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-zinc-100 text-zinc-700">•</span>
                      <span>Doesn’t match must-have integrations (if selected).</span>
                    </li>
                  </ul>
                </div>
              </details>
            </Card>
          ) : null}
        </div>

        <div className="mt-10">
          <Card className="shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Get pricing & vendor intro</h2>
          <p className="mt-1 text-sm text-zinc-600">
            We’ll review and share your requirement with one best-fit vendor (not blasted to everyone).
          </p>

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
                toast({ type: "success", title: "Request received", description: "We’ll share one best-fit vendor shortly." });
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
                <p className="mt-1 text-xs text-zinc-500">Email preferred (or share a phone number below).</p>
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
                <p className="mt-1 text-xs text-zinc-500">A short note helps us pick one best-fit vendor.</p>
              </div>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {sent ? <p className="text-sm text-green-700">Thanks — we’ll share one best-fit vendor shortly.</p> : null}

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
