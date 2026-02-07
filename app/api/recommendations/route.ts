import type { BuyerSizeBand } from "@prisma/client";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const Schema = z.object({
  companyName: z.string().min(1),
  buyerEmail: z.string().email(),
  buyerRole: z.string().optional().default(""),
  sizeBand: z.enum(["EMP_20_200", "EMP_50_500", "EMP_100_1000"]),
  states: z.array(z.string()).default([]),
  categoriesNeeded: z.array(z.string()).min(1).max(5),
  mustHaveIntegrations: z.array(z.string()).default([]),
  budgetNote: z.string().optional().nullable(),
  timelineNote: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        ok: false,
        error: "Service is not configured (missing DATABASE_URL).",
        requestId,
      },
      { status: 503 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload.", requestId },
      { status: 400 }
    );
  }

  const parsed = Schema.safeParse(json);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || "Invalid request.";
    return NextResponse.json({ ok: false, error: msg, requestId }, { status: 400 });
  }

  try {
    const input = parsed.data;

    const submission = await prisma.questionnaireSubmission.create({
      data: {
        answers: input,
        companyName: input.companyName,
        buyerEmail: input.buyerEmail,
        buyerRole: input.buyerRole || null,
        sizeBand: input.sizeBand,
        states: input.states,
        categoriesNeeded: input.categoriesNeeded,
        mustHaveIntegrations: input.mustHaveIntegrations,
        budgetNote: input.budgetNote ?? null,
        timelineNote: input.timelineNote ?? null,
      },
    });

    const result = await buildRecommendations({
      sizeBand: input.sizeBand,
      categoriesNeeded: input.categoriesNeeded,
      mustHaveIntegrations: input.mustHaveIntegrations,
    });

    const run = await prisma.recommendationRun.create({
      data: {
        submissionId: submission.id,
        result,
      },
    });

    return NextResponse.json({ ok: true, resultId: run.id, requestId });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[recommendations] POST failed", { requestId, error: msg });
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to generate recommendations. Please try again.",
        requestId,
      },
      { status: 500 }
    );
  }
}

async function buildRecommendations({
  sizeBand,
  categoriesNeeded,
  mustHaveIntegrations,
}: {
  sizeBand: BuyerSizeBand;
  categoriesNeeded: string[];
  mustHaveIntegrations: string[];
}) {
  const tools = await prisma.tool.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      vendor: true,
      categories: { include: { category: true } },
      integrations: { include: { integration: true } },
    },
    take: 500,
  });

  const wantedCategories = new Set(categoriesNeeded);
  const requiredIntegrations = new Set(mustHaveIntegrations);

  const eligible = tools
    .map((t) => {
      const toolCats = t.categories.map((c) => c.category.slug);
      const matchedCategories = toolCats.filter((c) => wantedCategories.has(c));

      const toolInts = t.integrations.map((i) => i.integration.slug);
      const haveInts = new Set(toolInts);

      const missingRequired = [...requiredIntegrations].filter((req) => !haveInts.has(req));

      if (matchedCategories.length === 0) return null;
      if (missingRequired.length > 0) return null; // hard constraint

      const { score, reasons } = scoreTool(t, {
        sizeBand,
        matchedCategories,
        mustHaveIntegrations,
      });

      return {
        tool: {
          slug: t.slug,
          name: t.name,
          tagline: t.tagline,
          vendorName: t.vendor?.name ?? null,
          lastVerifiedAt: t.lastVerifiedAt,
        },
        score,
        matchedCategories,
        reasons,
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const top = eligible
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((r) => ({
      tool: r.tool,
      score: r.score,
      matchedCategories: r.matchedCategories,
      why: r.reasons,
    }));

  return {
    version: 2,
    criteria: {
      sizeBand,
      categoriesNeeded,
      mustHaveIntegrations,
    },
    tools: top,
  };
}

function scoreTool(
  tool: {
    bestForSizeBands: BuyerSizeBand[];
    integrations: { integration: { slug: string } }[];
    lastVerifiedAt: Date | null;
  },
  ctx: { sizeBand: BuyerSizeBand; matchedCategories: string[]; mustHaveIntegrations: string[] }
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Category coverage
  score += ctx.matchedCategories.length * 4;
  reasons.push(`Matches: ${ctx.matchedCategories.map(prettyCategory).join(", ")}.`);

  // Size fit
  if (!tool.bestForSizeBands.length || tool.bestForSizeBands.includes(ctx.sizeBand)) {
    score += 5;
    reasons.push(`Good fit for ${prettySizeBand(ctx.sizeBand)} employee teams.`);
  }

  // Integrations
  if (ctx.mustHaveIntegrations.length) {
    const have = new Set(tool.integrations.map((i) => i.integration.slug));
    const matched = ctx.mustHaveIntegrations.filter((req) => have.has(req));
    score += matched.length * 2;
    if (matched.length) reasons.push(`Supports integrations: ${matched.join(", ")}.`);
  }

  // Freshness (lightweight)
  if (tool.lastVerifiedAt) {
    score += 1;
    reasons.push("Recently verified listing.");
  }

  return { score, reasons };
}

function prettySizeBand(band: BuyerSizeBand) {
  if (band === "EMP_20_200") return "20–200";
  if (band === "EMP_50_500") return "50–500";
  if (band === "EMP_100_1000") return "100–1000";
  return band;
}

function prettyCategory(slug: string) {
  const map: Record<string, string> = {
    hrms: "HRMS / Core HR",
    payroll: "Payroll & Compliance",
    attendance: "Attendance/Leave/Time",
    ats: "ATS / Hiring",
    performance: "Performance/OKR",
  };
  return map[slug] ?? slug;
}
