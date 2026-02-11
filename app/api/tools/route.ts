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

  // Vendor brief evidence (docs/vendors/<slug>.md) → evidence URLs.
  const { canonicalVendorSlug } = await import("@/lib/vendors/slug");
  const { getVendorBrief } = await import("@/lib/vendors/brief");

  const tools = await Promise.all(
    rows.map(async (t) => {
      const vendorName = t.vendor?.name ?? null;
      const vendorSlug = vendorName ? canonicalVendorSlug({ vendorName, toolSlugs: [t.slug] }) : null;
      const brief = vendorName && vendorSlug ? await getVendorBrief({ vendorName, urlSlug: vendorSlug, toolSlugs: [t.slug] }) : null;
      const evidenceLinksCount = brief?.urls?.length ?? 0;
      const pricingPageVerified = Boolean(
        brief?.urls?.some((u) => {
          const s = String(u).toLowerCase();
          return s.includes("pricing") || s.includes("plans") || s.includes("price");
        }),
      );

      const complianceTagsCount = Array.isArray(t.indiaComplianceTags) ? t.indiaComplianceTags.filter(Boolean).length : 0;

      return {
        slug: t.slug,
        name: t.name,
        tagline: t.tagline,
        vendorName,
        lastVerifiedAt: t.lastVerifiedAt,
        categories: t.categories.map((c) => c.category.name),
        integrations: t.integrations.map((i) => i.integration.name),
        integrationsCount: t.integrations.length,
        complianceTagsCount,
        evidenceLinksCount,
        pricingPageVerified,
        pricingPlans: t.pricingPlans.map((p) => ({
          name: p.name,
          priceNote: p.priceNote,
          setupFeeNote: p.setupFeeNote,
        })),
      };
    }),
  );

  // preserve input order
  const bySlug = new Map(tools.map((t) => [t.slug, t] as const));
  const ordered = parsed.data.slugs.map((s) => bySlug.get(s)).filter(Boolean);

  return NextResponse.json({ ok: true, tools: ordered });
}
