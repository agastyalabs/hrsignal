import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

const Schema = z.object({
  slugs: z.array(z.string().min(1)).min(1).max(5),
});

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: "Catalog not configured." }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const rows = await prisma.tool.findMany({
    where: { slug: { in: parsed.data.slugs }, status: "PUBLISHED" },
    include: {
      vendor: true,
      categories: { include: { category: true } },
      integrations: { include: { integration: true } },
      pricingPlans: true,
    },
    take: 5,
  });

  const tools = rows.map((t) => ({
    slug: t.slug,
    name: t.name,
    tagline: t.tagline,
    vendorName: t.vendor?.name ?? null,
    lastVerifiedAt: t.lastVerifiedAt,
    categories: t.categories.map((c) => c.category.name),
    integrations: t.integrations.map((i) => i.integration.name),
    pricingPlans: t.pricingPlans.map((p) => ({
      name: p.name,
      priceNote: p.priceNote,
      setupFeeNote: p.setupFeeNote,
    })),
  }));

  // preserve input order
  const bySlug = new Map(tools.map((t) => [t.slug, t] as const));
  const ordered = parsed.data.slugs.map((s) => bySlug.get(s)).filter(Boolean);

  return NextResponse.json({ ok: true, tools: ordered });
}
