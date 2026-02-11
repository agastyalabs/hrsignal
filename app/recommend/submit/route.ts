import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { buildRecommendationsV2 } from "@/lib/recommendations/engine";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.redirect(new URL("/recommend?error=missing_catalog", req.url));
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.redirect(new URL("/recommend?error=invalid_form", req.url));

  const companyName = String(form.get("companyName") ?? "").trim();
  const buyerEmail = String(form.get("buyerEmail") ?? "").trim();
  const buyerRole = String(form.get("buyerRole") ?? "").trim();

  if (!companyName || !buyerEmail) {
    return NextResponse.redirect(new URL("/recommend?error=missing_fields", req.url));
  }

  // Minimal defaults for non-JS flows (first step submits, still yields valid results).
  const input = {
    companyName,
    buyerEmail,
    buyerRole: buyerRole || null,
    sizeBand: "EMP_20_200" as const,
    states: [] as string[],
    categoriesNeeded: ["hrms", "payroll", "attendance"],
    mustHaveIntegrations: [] as string[],
    budgetNote: null as string | null,
    timelineNote: null as string | null,
  };

  // Unified lead capture (best-effort; no DB writes here beyond questionnaire submission).
  try {
    await fetch(new URL("/api/leads/submit", req.url), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: buyerEmail,
        role: buyerRole || undefined,
        companySize: input.sizeBand,
        source: "recommend_form",
      }),
    });
  } catch {
    // Non-blocking
  }

  const submission = await prisma.questionnaireSubmission.create({
    data: {
      answers: input,
      companyName: input.companyName,
      buyerEmail: input.buyerEmail,
      buyerRole: input.buyerRole,
      sizeBand: input.sizeBand,
      states: input.states,
      categoriesNeeded: input.categoriesNeeded,
      mustHaveIntegrations: input.mustHaveIntegrations,
      budgetNote: input.budgetNote,
      timelineNote: input.timelineNote,
    },
  });

  const result = await buildRecommendationsV2({
    sizeBand: input.sizeBand,
    categoriesNeeded: input.categoriesNeeded,
    mustHaveIntegrations: input.mustHaveIntegrations,
  });

  const run = await prisma.recommendationRun.create({
    data: {
      submissionId: submission.id,
      result,
    },
    select: { id: true },
  });

  return NextResponse.redirect(new URL(`/recommend/success?run=${encodeURIComponent(run.id)}`, req.url));
}
