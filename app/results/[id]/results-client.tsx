"use client";

import type { BuyerSizeBand } from "@prisma/client";
import { useMemo, useState } from "react";

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

export default function ResultsClient({
  runId,
  submission,
  result,
}: {
  runId: string;
  submission: Submission;
  result: any;
}) {
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const picks = useMemo(() => {
    return (result?.picks as Array<{ category: string; tool: any; why: string }> | undefined) ?? [];
  }, [result]);

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold">Your HR stack shortlist</h1>
          <a className="text-sm underline" href="/stack-builder">
            Start over
          </a>
        </div>
        <p className="mt-2 text-zinc-600">
          Based on your inputs, here are best-fit picks per category. Want pricing/demo help? Submit your details and we’ll route you to the
          best-fit vendor.
        </p>

        <div className="mt-6 space-y-4">
          {picks.map((p) => (
            <div key={p.category} className="rounded-xl bg-white p-5 shadow">
              <div className="text-sm font-medium text-zinc-500">{prettyCategory(p.category)}</div>
              <div className="mt-1 text-xl font-semibold">{p.tool.name}</div>
              {p.tool.tagline ? <div className="mt-1 text-zinc-600">{p.tool.tagline}</div> : null}
              <div className="mt-3 text-sm text-zinc-700">
                <span className="font-medium">Why:</span> {p.why}
              </div>
              <div className="mt-3">
                <a className="text-sm underline" href={`/tools/${p.tool.slug}`}>
                  View details →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">Get pricing & vendor intro</h2>
          <p className="mt-1 text-sm text-zinc-600">
            We’ll review and share your requirement with one best-fit vendor (not blasted to everyone).
          </p>

          <form
            className="mt-4 space-y-4"
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
                    companyName: submission.companyName,
                    contactName,
                    contactEmail: submission.buyerEmail,
                    contactPhone,
                    buyerRole: submission.buyerRole,
                  }),
                });
                if (!res.ok) throw new Error("Failed");
                setSent(true);
              } catch {
                setError("Could not submit. Try again.");
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
                <label className="text-sm font-medium">Phone (optional)</label>
                <input className="input mt-1" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
              </div>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {sent ? <p className="text-sm text-green-700">Submitted. We’ll reach out shortly.</p> : null}

            <button className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60" disabled={sending || sent}>
              {sent ? "Submitted" : sending ? "Submitting…" : "Submit"}
            </button>
          </form>
        </div>
      </div>
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
