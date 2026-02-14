import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { buildRecommendationsV2 } from "@/lib/recommendations/engine";

export const runtime = "nodejs";

function deriveCompanyNameFromEmail(email: string): string {
  const domain = email.split("@")[1]?.trim().toLowerCase();
  if (!domain) return "Company";
  const base = domain.split(".")[0]?.replace(/[^a-z0-9-]/g, "").trim();
  if (!base) return "Company";
  return base.slice(0, 1).toUpperCase() + base.slice(1);
}

function normalizeBuyerSizeBand(v: unknown): "EMP_20_200" | "EMP_50_500" | "EMP_100_1000" {
  const s = String(v ?? "").trim();
  if (s === "EMP_20_200" || s === "EMP_50_500" || s === "EMP_100_1000") return s;
  return "EMP_20_200";
}

function normalizePrimaryModule(v: unknown): "hrms" | "payroll" | "attendance" | "ats" | "performance" {
  const s = String(v ?? "").trim();
  if (s === "hrms" || s === "payroll" || s === "attendance" || s === "ats" || s === "performance") return s;
  return "payroll";
}

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.redirect(new URL("/recommend?error=missing_catalog", req.url));
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.redirect(new URL("/recommend?error=invalid_form", req.url));

  const rawCompanyName = String(form.get("companyName") ?? "").trim();
  const buyerEmail = String(form.get("buyerEmail") ?? "").trim();
  const buyerRole = String(form.get("buyerRole") ?? "").trim();

  if (!buyerEmail) {
    return NextResponse.redirect(new URL("/recommend?error=missing_fields", req.url));
  }

  const companyName = rawCompanyName || deriveCompanyNameFromEmail(buyerEmail);

  const sizeBand = normalizeBuyerSizeBand(form.get("sizeBand"));
  const primaryModule = normalizePrimaryModule(form.get("primaryModule"));
  const timelineNote = String(form.get("timelineNote") ?? "").trim() || null;

  // Minimal defaults for non-JS flows (first step submits, still yields valid results).
  const input = {
    companyName,
    buyerEmail,
    buyerRole: buyerRole || null,
    sizeBand,
    states: [] as string[],
    categoriesNeeded: [primaryModule],
    mustHaveIntegrations: [] as string[],
    budgetNote: null as string | null,
    timelineNote,
  };

  // Lead capture (best-effort). This should not block the recommend flow.
  try {
    await fetch(new URL("/api/leads", req.url), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "shortlist",
        email: buyerEmail,
        metadata: {
          companyName,
          role: buyerRole || undefined,
          companySize: input.sizeBand,
          primaryModule,
          timeline: timelineNote || undefined,
          source: "recommend_form", 
        },
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
