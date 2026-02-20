import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TOOLS = [
  { slug: "keka", name: "Keka", tagline: "HRMS + Payroll built for India", vendor: "Keka" },
  { slug: "greythr", name: "greytHR", tagline: "Payroll + HR for SMEs", vendor: "greytHR" },
  { slug: "darwinbox", name: "Darwinbox", tagline: "Enterprise HR suite", vendor: "Darwinbox" },
  { slug: "peoplestrong", name: "PeopleStrong", tagline: "HRMS + talent suite", vendor: "PeopleStrong" },
  { slug: "zoho-people", name: "Zoho People", tagline: "HRMS in the Zoho ecosystem", vendor: "Zoho" },
  { slug: "freshteam", name: "Freshteam", tagline: "ATS + onboarding", vendor: "Freshworks" },
  { slug: "factohr", name: "factoHR", tagline: "HRMS + payroll (mobile-first)", vendor: "factoHR" },
  { slug: "hrect", name: "HROne", tagline: "HRMS + payroll for growing orgs", vendor: "HROne" },
  { slug: "sumhr", name: "SumHR", tagline: "Lightweight HRMS", vendor: "SumHR" },
  { slug: "zenefits-indiaish", name: "PocketHR", tagline: "HR ops for startups", vendor: "PocketHR" },
  { slug: "kissflow-hr", name: "Kissflow HR", tagline: "Workflow-heavy HR ops", vendor: "Kissflow" },
  { slug: "orangehrm", name: "OrangeHRM", tagline: "Open-source HRMS option", vendor: "OrangeHRM" },
  { slug: "sentrifugo", name: "Sentrifugo", tagline: "Self-hosted HRMS", vendor: "Sentrifugo" },
  { slug: "peoplebox", name: "Peoplebox", tagline: "OKRs + performance", vendor: "Peoplebox" },
  { slug: "leapsome-ish", name: "Performly", tagline: "Performance reviews that don’t suck", vendor: "Performly" },
  { slug: "apna-ats", name: "HireSprint", tagline: "ATS for high-volume hiring", vendor: "HireSprint" },
  { slug: "salarybox", name: "SalaryBox", tagline: "Attendance + payroll-lite", vendor: "SalaryBox" },
  { slug: "razorpayx-payroll", name: "RazorpayX Payroll", tagline: "Payroll for fast-moving teams", vendor: "Razorpay" },
];

const DESI_REVIEW_LINES = [
  "Works great until month-end hits — then you find the edge cases.",
  "Setup was smooth. Support is responsive (rare win).",
  "UI is clean. But reporting needs a reality check.",
  "If your org has 3+ states, demo with your nastiest payroll sample.",
  "Good product. Sales promised the moon. Delivery was… Earth.",
  "The basics are solid. Integrations are where time goes to die.",
  "For SMEs this is value. For enterprise, you’ll want more controls.",
  "Approval workflows are decent. Audit trail is okay-ish.",
  "Payroll calculations are fine; statutory exports need validation.",
  "Feels built by people who’ve actually run HR ops in India.",
  "Feature list is long; implementation checklist is longer.",
  "The product is calm. The onboarding is chaos — plan a sprint.",
  "Mobile app is surprisingly usable.",
  "If you hate spreadsheets, this will reduce the pain.",
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

async function main() {
  // Ensure some categories exist (minimal)
  const categories = [
    { slug: "hrms", name: "HRMS" },
    { slug: "payroll", name: "Payroll" },
    { slug: "compliance", name: "Compliance" },
    { slug: "ats", name: "ATS" },
    { slug: "performance", name: "Performance" },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: { slug: c.slug, name: c.name, sortOrder: 0 },
    });
  }

  // Vendors + tools
  for (const t of TOOLS) {
    const vendor = await prisma.vendor.upsert({
      where: { id: t.vendor },
      update: { name: t.vendor, isActive: true },
      create: { id: t.vendor, name: t.vendor, isActive: true, verifiedInIndia: true, registeredCountry: "IN" },
    }).catch(async () => {
      // vendor.id is cuid normally; fall back to create with cuid
      return prisma.vendor.create({ data: { name: t.vendor, isActive: true, verifiedInIndia: true, registeredCountry: "IN" } });
    });

    const upvotes = randInt(25, 420);
    const upvotesWeek = randInt(0, 80);

    await prisma.tool.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        tagline: t.tagline,
        status: "PUBLISHED",
        vendorId: vendor.id,
        upvotes,
        upvotesWeek,
        indiaComplianceTags: ["PF", "ESI", "PT", "TDS"].slice(0, randInt(1, 4)),
      },
      create: {
        slug: t.slug,
        name: t.name,
        tagline: t.tagline,
        status: "PUBLISHED",
        vendorId: vendor.id,
        upvotes,
        upvotesWeek,
        indiaComplianceTags: ["PF", "ESI", "PT", "TDS"].slice(0, randInt(1, 4)),
      },
    });
  }

  // Reviews (112 total)
  const allTools = await prisma.tool.findMany({ where: { status: "PUBLISHED" }, select: { id: true, name: true } });

  // Clear existing launch reviews only if they match our authorRole marker.
  // (keeps any real reviews if they exist)
  await prisma.toolReview.deleteMany({ where: { authorRole: "HR (seed)" } });

  const target = 112;
  for (let i = 0; i < target; i++) {
    const tool = pick(allTools);
    const rating = pick([3, 4, 4, 4, 5, 2]);
    const body = `${pick(DESI_REVIEW_LINES)} ${pick(DESI_REVIEW_LINES)}`;

    await prisma.toolReview.create({
      data: {
        toolId: tool.id,
        authorRole: "HR (seed)",
        rating,
        body,
      },
    });
  }

  console.log(`Seeded: ${TOOLS.length} tools, ${target} reviews`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
