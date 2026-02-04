export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import ResultsClient from "./results-client";
import { notFound } from "next/navigation";

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = await prisma.recommendationRun.findUnique({
    where: { id },
    include: { submission: true },
  });
  if (!run) return notFound();

  return <ResultsClient runId={run.id} submission={run.submission} result={run.result as unknown as RecommendationResult} />;
}

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
      lastVerifiedAt?: string | Date | null;
    };
    score: number;
    matchedCategories: string[];
    why: string[];
  }>;
};

