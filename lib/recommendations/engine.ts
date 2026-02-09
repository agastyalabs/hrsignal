import type { BuyerSizeBand } from "@prisma/client";
import { prisma } from "@/lib/db";

export type RecommendationResultV2 = {
  version: 2;
  criteria: {
    sizeBand: BuyerSizeBand;
    categoriesNeeded: string[];
    mustHaveIntegrations: string[];
  };
  tools: Array<{
    tool: {
      slug: string;
      name: string;
      tagline: string | null;
      vendorName: string | null;
      lastVerifiedAt: Date | null;
    };
    score: number;
    matchedCategories: string[];
    why: string[];
  }>;
};

export async function buildRecommendationsV2({
  sizeBand,
  categoriesNeeded,
  mustHaveIntegrations,
}: {
  sizeBand: BuyerSizeBand;
  categoriesNeeded: string[];
  mustHaveIntegrations: string[];
}): Promise<RecommendationResultV2> {
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
      if (missingRequired.length > 0) return null;

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

  score += ctx.matchedCategories.length * 4;
  reasons.push(`Matches: ${ctx.matchedCategories.map(prettyCategory).join(", ")}.`);

  if (!tool.bestForSizeBands.length || tool.bestForSizeBands.includes(ctx.sizeBand)) {
    score += 5;
    reasons.push(`Good fit for ${prettySizeBand(ctx.sizeBand)} employee teams.`);
  }

  if (ctx.mustHaveIntegrations.length) {
    const have = new Set(tool.integrations.map((i) => i.integration.slug));
    const matched = ctx.mustHaveIntegrations.filter((req) => have.has(req));
    score += matched.length * 2;
    if (matched.length) reasons.push(`Supports integrations: ${matched.join(", ")}.`);
  }

  if (tool.lastVerifiedAt) {
    score += 1;
    reasons.push("Recently verified listing.");
  }

  return { score, reasons };
}

function prettySizeBand(band: BuyerSizeBand) {
  // UI labels should match the new logical ranges.
  if (band === "EMP_20_200") return "51–200";
  if (band === "EMP_50_500") return "201–500";
  if (band === "EMP_100_1000") return "501–1000";
  return String(band);
}

function prettyCategory(slug: string) {
  const map: Record<string, string> = {
    hrms: "HRMS / Core HR",
    payroll: "Payroll & Compliance",
    attendance: "Attendance/Leave/Time",
    ats: "ATS / Hiring",
    performance: "Performance/OKR",
    bgv: "Background Verification (BGV)",
    lms: "LMS / L&D",
  };
  return map[slug] ?? slug;
}
