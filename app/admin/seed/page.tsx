export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";

export default async function AdminSeedPage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Seed catalog</h1>
        <p className="mt-2 text-sm text-zinc-600">
          This is an internal helper for v1. It will insert a small starter catalog (categories, vendors, tools, integrations).
        </p>

        <form action={seedCatalog} className="mt-6">
          <button className="rounded-md bg-black px-4 py-2 text-white">Run seed</button>
        </form>
      </div>
    </div>
  );
}

async function seedCatalog() {
  "use server";

  const categories = [
    { slug: "hrms", name: "HRMS / Core HR", sortOrder: 10 },
    { slug: "payroll", name: "Payroll & Compliance", sortOrder: 20 },
    { slug: "attendance", name: "Attendance/Leave/Time", sortOrder: 30 },
    { slug: "ats", name: "ATS / Hiring", sortOrder: 40 },
    { slug: "performance", name: "Performance/OKR", sortOrder: 50 },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder },
      create: { slug: c.slug, name: c.name, sortOrder: c.sortOrder },
    });
  }

  const integrations = [
    { slug: "tally", name: "Tally" },
    { slug: "zoho-books", name: "Zoho Books" },
    { slug: "google-workspace", name: "Google Workspace" },
  ];

  for (const i of integrations) {
    await prisma.integration.upsert({
      where: { slug: i.slug },
      update: { name: i.name },
      create: { slug: i.slug, name: i.name },
    });
  }

  const vendors = [
    {
      name: "greytHR",
      websiteUrl: "https://www.greythr.com",
      contactEmail: "support@greythr.com",
      supportedSizeBands: ["EMP_20_200", "EMP_50_500"],
      categories: ["hrms", "payroll"],
    },
    {
      name: "Keka",
      websiteUrl: "https://www.keka.com",
      contactEmail: "support@keka.com",
      supportedSizeBands: ["EMP_20_200", "EMP_50_500", "EMP_100_1000"],
      categories: ["hrms", "payroll", "performance"],
    },
    {
      name: "Zoho",
      websiteUrl: "https://www.zoho.com",
      contactEmail: "support@zoho.com",
      supportedSizeBands: ["EMP_20_200", "EMP_50_500", "EMP_100_1000"],
      categories: ["hrms", "payroll", "ats"],
    },
    {
      name: "Freshworks",
      websiteUrl: "https://www.freshworks.com",
      contactEmail: "support@freshworks.com",
      supportedSizeBands: ["EMP_20_200", "EMP_50_500"],
      categories: ["ats"],
    },
  ];

  for (const v of vendors) {
    const existing = await prisma.vendor.findFirst({ where: { name: v.name } });
    const vendor = existing
      ? await prisma.vendor.update({
          where: { id: existing.id },
          data: {
            websiteUrl: v.websiteUrl,
            contactEmail: v.contactEmail,
            supportedSizeBands: v.supportedSizeBands as any,
            isActive: true,
          },
        })
      : await prisma.vendor.create({
          data: {
            name: v.name,
            websiteUrl: v.websiteUrl,
            contactEmail: v.contactEmail,
            supportedSizeBands: v.supportedSizeBands as any,
            isActive: true,
          },
        });

    await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        categories: {
          set: [],
          connect: v.categories.map((slug) => ({ slug })),
        },
      },
    });
  }

  const vendorByName = Object.fromEntries(
    (await prisma.vendor.findMany()).map((v) => [v.name, v])
  );

  const tools = [
    {
      slug: "greythr",
      name: "greytHR",
      vendorName: "greytHR",
      tagline: "HRMS + payroll for Indian SMEs",
      categories: ["hrms", "payroll"],
      integrations: ["tally"],
      bestFor: ["EMP_20_200", "EMP_50_500"],
    },
    {
      slug: "keka",
      name: "Keka",
      vendorName: "Keka",
      tagline: "Modern HRMS with payroll",
      categories: ["hrms", "payroll", "performance"],
      integrations: ["tally", "google-workspace"],
      bestFor: ["EMP_20_200", "EMP_50_500", "EMP_100_1000"],
    },
    {
      slug: "zoho-people",
      name: "Zoho People",
      vendorName: "Zoho",
      tagline: "HRMS with attendance/leave",
      categories: ["hrms", "attendance"],
      integrations: ["zoho-books", "google-workspace"],
      bestFor: ["EMP_20_200", "EMP_50_500"],
    },
    {
      slug: "zoho-payroll",
      name: "Zoho Payroll",
      vendorName: "Zoho",
      tagline: "Payroll for India compliance",
      categories: ["payroll"],
      integrations: ["zoho-books"],
      bestFor: ["EMP_20_200", "EMP_50_500"],
    },
    {
      slug: "freshteam",
      name: "Freshteam",
      vendorName: "Freshworks",
      tagline: "ATS + onboarding for SMEs",
      categories: ["ats"],
      integrations: ["google-workspace"],
      bestFor: ["EMP_20_200", "EMP_50_500"],
    },
  ];

  for (const t of tools) {
    const vendor = vendorByName[t.vendorName];
    const tool = await prisma.tool.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        vendorId: vendor?.id,
        tagline: t.tagline,
        status: "PUBLISHED",
        bestForSizeBands: t.bestFor as any,
        lastVerifiedAt: new Date(),
      },
      create: {
        slug: t.slug,
        name: t.name,
        vendorId: vendor?.id,
        tagline: t.tagline,
        status: "PUBLISHED",
        bestForSizeBands: t.bestFor as any,
        lastVerifiedAt: new Date(),
      },
    });

    await prisma.toolCategory.deleteMany({ where: { toolId: tool.id } });
    await prisma.toolIntegration.deleteMany({ where: { toolId: tool.id } });

    for (const cSlug of t.categories) {
      const cat = await prisma.category.findUnique({ where: { slug: cSlug } });
      if (!cat) continue;
      await prisma.toolCategory.create({ data: { toolId: tool.id, categoryId: cat.id } });
    }

    for (const iSlug of t.integrations) {
      const integ = await prisma.integration.findUnique({ where: { slug: iSlug } });
      if (!integ) continue;
      await prisma.toolIntegration.create({ data: { toolId: tool.id, integrationId: integ.id } });
    }
  }
}
