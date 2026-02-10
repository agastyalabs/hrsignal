"use client";

import type { BuyerSizeBand } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";

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

          {picks.map((p) => (
            <Card key={p.tool.slug} className="shadow-sm">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold">{p.tool.name}</div>
                  {p.tool.vendorName ? <div className="mt-1 text-sm text-zinc-600">by {p.tool.vendorName}</div> : null}
                </div>
                <div className="text-sm text-zinc-500">Score {p.score}</div>
              </div>

              {p.tool.tagline ? <div className="mt-2 text-zinc-700">{p.tool.tagline}</div> : null}

              {p.matchedCategories.length ? (
                <div className="mt-3 text-sm text-zinc-600">
                  Matches: {p.matchedCategories.map(prettyCategory).join(", ")}
                </div>
              ) : null}

              <div className="mt-3 text-sm text-zinc-700">
                <div className="font-medium">Why this fits</div>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {p.why.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <Link className="text-sm font-medium text-indigo-700" href={`/tools/${p.tool.slug}`}>
                  View details →
                </Link>
              </div>
            </Card>
          ))}
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
