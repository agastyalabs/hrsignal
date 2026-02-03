import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const Schema = z.object({
  companyName: z.string().min(1),
  buyerEmail: z.string().email(),
  buyerRole: z.string().optional().default(""),
  sizeBand: z.enum(["EMP_20_200", "EMP_50_500", "EMP_100_1000"]),
  states: z.array(z.string()).default([]),
  categoriesNeeded: z.array(z.string()).min(1),
  mustHaveIntegrations: z.array(z.string()).default([]),
  budgetNote: z.string().optional().nullable(),
  timelineNote: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Catalog not configured (missing DATABASE_URL)." },
      { status: 503 }
    );
  }
  const json = await req.json();
  const input = Schema.parse(json);

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

  return NextResponse.json({ resultId: run.id });
}

async function buildRecommendations({
  sizeBand,
  categoriesNeeded,
  mustHaveIntegrations,
}: {
  sizeBand: "EMP_20_200" | "EMP_50_500" | "EMP_100_1000";
  categoriesNeeded: string[];
  mustHaveIntegrations: string[];
}) {
  const tools = await prisma.tool.findMany({
    where: {
      status: "PUBLISHED",
      ...(sizeBand
        ? {
            OR: [
              { bestForSizeBands: { has: sizeBand } },
              { bestForSizeBands: { isEmpty: true } },
            ],
          }
        : {}),
      ...(mustHaveIntegrations.length
        ? {
            integrations: {
              every: undefined,
              some: { integration: { slug: { in: mustHaveIntegrations } } },
            },
          }
        : {}),
    },
    include: {
      categories: { include: { category: true } },
      integrations: { include: { integration: true } },
    },
    take: 500,
  });

  const picks = categoriesNeeded.map((cat) => {
    const eligible = tools.filter((t) => t.categories.some((c) => c.category.slug === cat));
    const scored = eligible
      .map((t) => ({
        tool: { id: t.id, slug: t.slug, name: t.name, tagline: t.tagline },
        score: scoreTool(t, { sizeBand, mustHaveIntegrations }),
      }))
      .sort((a, b) => b.score - a.score);

    const top = scored[0];
    return {
      category: cat,
      tool: top?.tool ?? null,
      why: top
        ? `Good fit for ${prettySizeBand(sizeBand)} teams${mustHaveIntegrations.length ? 
            ` and supports ${mustHaveIntegrations.join(", ")}` : ""}.`
        : "No matching tools in our catalog yet.",
      score: top?.score ?? 0,
    };
  });

  return {
    version: 1,
    picks,
  };
}

function scoreTool(
  tool: { bestForSizeBands: string[]; integrations: { integration: { slug: string } }[] },
  ctx: { sizeBand: string; mustHaveIntegrations: string[] }
) {
  let score = 0;
  if (!tool.bestForSizeBands.length || tool.bestForSizeBands.includes(ctx.sizeBand)) score += 5;
  const have = new Set(tool.integrations.map((i) => i.integration.slug));
  for (const req of ctx.mustHaveIntegrations) if (have.has(req)) score += 2;
  return score;
}

function prettySizeBand(band: string) {
  if (band === "EMP_20_200") return "20–200";
  if (band === "EMP_50_500") return "50–500";
  if (band === "EMP_100_1000") return "100–1000";
  return band;
}
