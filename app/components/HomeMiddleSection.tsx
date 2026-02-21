import fs from "node:fs";
import path from "node:path";

import type { ComponentType } from "react";

import HomeMiddleSectionClient from "./HomeMiddleSection.jsx";

import { prisma } from "@/lib/db";

type Snapshot = {
  toolCount: number;
  vendorCount: number;
  categoryCount: number;
  verifiedToolCount: number;
  upvotesWeekTotal: number;
  reviewCount: number;
};

function n(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function seedFallback(): Snapshot {
  const dataDir = path.join(process.cwd(), "data");
  const toolsSeedPath = path.join(dataDir, "tools_seed.json");
  const vendorsSeedPath = path.join(dataDir, "vendors_seed.json");

  const tools = fs.existsSync(toolsSeedPath) ? (JSON.parse(fs.readFileSync(toolsSeedPath, "utf8")) as any[]) : [];
  const vendors = fs.existsSync(vendorsSeedPath) ? (JSON.parse(fs.readFileSync(vendorsSeedPath, "utf8")) as any[]) : [];

  const categories = new Set<string>();
  let verifiedToolCount = 0;
  let upvotesWeekTotal = 0;

  for (const t of tools) {
    const cats = Array.isArray(t?.categories) ? t.categories : [];
    for (const c of cats) if (typeof c === "string" && c.trim()) categories.add(c.trim());

    if (t?.last_verified_at) verifiedToolCount += 1;
    upvotesWeekTotal += n(t?.upvotes_week);
  }

  return {
    toolCount: tools.length,
    vendorCount: vendors.length,
    categoryCount: categories.size,
    verifiedToolCount,
    upvotesWeekTotal,
    reviewCount: 0,
  };
}

async function dbSnapshot(): Promise<Snapshot> {
  const [toolCount, vendorCount, categoryCount, verifiedToolCount, upvotesWeekTotal, reviewCount] = await Promise.all([
    prisma.tool.count({ where: { status: "PUBLISHED" } }),
    prisma.vendor.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.tool.count({ where: { status: "PUBLISHED", lastVerifiedAt: { not: null } } }),
    prisma.tool
      .aggregate({ where: { status: "PUBLISHED" }, _sum: { upvotesWeek: true } })
      .then((r) => n(r?._sum?.upvotesWeek)),
    prisma.toolReview.count(),
  ]);

  return {
    toolCount,
    vendorCount,
    categoryCount,
    verifiedToolCount,
    upvotesWeekTotal,
    reviewCount,
  };
}

const HomeMiddleSectionClientTyped = HomeMiddleSectionClient as unknown as ComponentType<{ snapshot: Snapshot }>;

export default async function HomeMiddleSection() {
  let snapshot: Snapshot;

  if (process.env.DATABASE_URL) {
    try {
      snapshot = await dbSnapshot();
    } catch {
      snapshot = seedFallback();
    }
  } else {
    snapshot = seedFallback();
  }

  return <HomeMiddleSectionClientTyped snapshot={snapshot} />;
}
