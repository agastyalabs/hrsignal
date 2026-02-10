import { prisma } from "@/lib/db";

export async function getToolCountsByCategorySafe(categorySlugs: string[]) {
  const out = new Map<string, number>();
  for (const s of categorySlugs) out.set(s, 0);

  // Try DB first, never crash
  if (process.env.DATABASE_URL) {
    try {
      await Promise.all(
        categorySlugs.map(async (slug) => {
          const count = await prisma.tool.count({
            where: {
              status: "PUBLISHED",
              categories: { some: { category: { slug } } },
            },
          });
          out.set(slug, count);
        })
      );
      return out;
    } catch {
      // fall through
    }
  }

  try {
    const mod = await import("@/data/tools_seed.json");
    const tools = (mod.default ?? []) as Array<{ categories?: string[] }>;
    for (const slug of categorySlugs) {
      const count = tools.filter((t) => (t.categories ?? []).includes(slug)).length;
      out.set(slug, count);
    }
  } catch {
    // keep zeros
  }

  return out;
}
