import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { slug: "hrms", name: "HRMS / Core HR", sortOrder: 10 },
    { slug: "payroll", name: "Payroll & Compliance", sortOrder: 20 },
    { slug: "ats", name: "Recruitment / ATS", sortOrder: 30 },
    { slug: "bgv", name: "Background Verification (BGV)", sortOrder: 40 },
    { slug: "performance", name: "Performance & OKRs", sortOrder: 50 },
    { slug: "engagement", name: "Engagement & Surveys", sortOrder: 60 },
    { slug: "lms", name: "LMS / Training", sortOrder: 70 },
    { slug: "attendance", name: "Time & Attendance", sortOrder: 80 },
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

  // Seeds are now sourced from JSON (India-first, evidence URLs included).
  const dataDir = path.join(process.cwd(), "data");
  const vendorsSeedPath = path.join(dataDir, "vendors_seed.json");
  const toolsSeedPath = path.join(dataDir, "tools_seed.json");

  if (!fs.existsSync(vendorsSeedPath) || !fs.existsSync(toolsSeedPath)) {
    throw new Error(
      `Missing seed files. Expected: ${vendorsSeedPath} and ${toolsSeedPath}. ` +
        `Run the catalog seed generation step or add the files to the repo.`
    );
  }

  const vendors = JSON.parse(fs.readFileSync(vendorsSeedPath, "utf8"));
  const toolsSeed = JSON.parse(fs.readFileSync(toolsSeedPath, "utf8"));

  for (const v of vendors) {
    const existing = await prisma.vendor.findFirst({ where: { name: v.name } });

    const verifiedInIndia = Boolean(v.verified_in_india);
    const registeredCountry = v.registered_country || (verifiedInIndia ? "IN" : "US");

    const vendor = existing
      ? await prisma.vendor.update({
          where: { id: existing.id },
          data: {
            websiteUrl: v.website_url,
            contactEmail: v.contact_email,
            registeredCountry,
            verifiedInIndia,
            multiStateSupport: v.multi_state_support ?? verifiedInIndia,
            supportedSizeBands: v.supported_size_bands || [],
            isActive: true,
          },
        })
      : await prisma.vendor.create({
          data: {
            name: v.name,
            websiteUrl: v.website_url,
            contactEmail: v.contact_email,
            registeredCountry,
            verifiedInIndia,
            multiStateSupport: v.multi_state_support ?? verifiedInIndia,
            supportedSizeBands: v.supported_size_bands || [],
            isActive: true,
          },
        });

    await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        categories: {
          set: [],
          connect: (v.categories || []).map((slug) => ({ slug })),
        },
      },
    });
  }

  const vendorByName = Object.fromEntries((await prisma.vendor.findMany()).map((v) => [v.name, v]));

  function slugify(name) {
    return String(name)
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60);
  }

  function defaultTagline(cats) {
    if (cats.includes("hrms")) return "HRMS for employee records, onboarding and workflows";
    if (cats.includes("payroll")) return "Payroll and compliance workflows";
    if (cats.includes("attendance")) return "Attendance, leave and time tracking";
    if (cats.includes("ats")) return "Recruitment and ATS pipeline management";
    if (cats.includes("performance")) return "Performance reviews and OKRs";
    if (cats.includes("bgv")) return "Background verification and screening";
    if (cats.includes("lms")) return "Learning and development (LMS)";
    return "HR software platform";
  }

  function complianceTagsFor(categories) {
    const tags = new Set();
    if (categories.includes("payroll")) {
      for (const t of ["PF", "ESI", "PT", "LWF", "TDS", "Form16", "24Q"]) tags.add(t);
    }
    if (categories.includes("attendance")) {
      for (const t of ["Leave", "Shifts"]) tags.add(t);
    }
    if (categories.includes("bgv")) {
      for (const t of ["KYC", "Identity"]) tags.add(t);
    }
    return [...tags];
  }

  const toolSeeds = toolsSeed;

  for (const t of toolSeeds) {
    const vendor = vendorByName[t.vendor_name];

    const deployment = String(t.deployment || "cloud").toUpperCase();
    const deploymentEnum = deployment === "ONPREM" ? "ONPREM" : deployment === "HYBRID" ? "HYBRID" : "CLOUD";

    const tool = await prisma.tool.upsert({
      where: { slug: t.slug || slugify(t.name) },
      update: {
        name: t.name,
        vendorId: vendor?.id,
        tagline: t.short_description || defaultTagline(t.categories || []),
        description: t.short_description || null,
        status: "PUBLISHED",
        bestForSizeBands: vendor?.supportedSizeBands || [],
        deployment: deploymentEnum,
        indiaComplianceTags: (t.india_fit_tags && t.india_fit_tags.length ? t.india_fit_tags : complianceTagsFor(t.categories || [])),
        lastVerifiedAt: t.last_verified_at ? new Date(t.last_verified_at) : new Date(),
      },
      create: {
        slug: t.slug || slugify(t.name),
        name: t.name,
        vendorId: vendor?.id,
        tagline: t.short_description || defaultTagline(t.categories || []),
        description: t.short_description || null,
        status: "PUBLISHED",
        bestForSizeBands: vendor?.supportedSizeBands || [],
        deployment: deploymentEnum,
        indiaComplianceTags: (t.india_fit_tags && t.india_fit_tags.length ? t.india_fit_tags : complianceTagsFor(t.categories || [])),
        lastVerifiedAt: t.last_verified_at ? new Date(t.last_verified_at) : new Date(),
      },
    });

    await prisma.toolCategory.deleteMany({ where: { toolId: tool.id } });
    await prisma.toolIntegration.deleteMany({ where: { toolId: tool.id } });

    for (const cSlug of t.categories || []) {
      const cat = await prisma.category.findUnique({ where: { slug: cSlug } });
      if (!cat) continue;
      await prisma.toolCategory.create({ data: { toolId: tool.id, categoryId: cat.id } });
    }

    for (const iSlug of t.integrations || []) {
      const integ = await prisma.integration.findUnique({ where: { slug: iSlug } });
      if (!integ) continue;
      await prisma.toolIntegration.create({ data: { toolId: tool.id, integrationId: integ.id } });
    }
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
