import { prisma } from "@/lib/db";

export type HomeCoverageStats = {
  toolsPublished: number | null;
  vendorsActive: number | null;
  categories: number | null;
  reviews: number | null;
  verifiedTools: number | null;
  upvotesWeek: number | null;
};

export async function getHomeCoverageStats(): Promise<HomeCoverageStats> {
  // This must be safe in "no DB" environments.
  try {
    const [
      toolsPublished,
      vendorsActive,
      categories,
      reviews,
      verifiedTools,
      upvotesWeekAgg,
    ] = await Promise.all([
      prisma.tool.count({ where: { status: "PUBLISHED" } }),
      prisma.vendor.count({ where: { isActive: true } }),
      prisma.category.count(),
      prisma.toolReview.count(),
      prisma.tool.count({ where: { lastVerifiedAt: { not: null } } }),
      prisma.tool.aggregate({ _sum: { upvotesWeek: true } }),
    ]);

    return {
      toolsPublished,
      vendorsActive,
      categories,
      reviews,
      verifiedTools,
      upvotesWeek: upvotesWeekAgg._sum.upvotesWeek ?? 0,
    };
  } catch {
    return {
      toolsPublished: null,
      vendorsActive: null,
      categories: null,
      reviews: null,
      verifiedTools: null,
      upvotesWeek: null,
    };
  }
}
