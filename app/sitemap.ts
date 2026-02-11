import type { MetadataRoute } from "next";

import { prisma } from "@/lib/db";
import { canonicalVendorSlug } from "@/lib/vendors/slug";
import { listResourceArticles } from "@/lib/resources/articles";

const BASE = "https://hrsignal.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/vendors`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/recommend`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const resourceUrls: MetadataRoute.Sitemap = listResourceArticles().map((a) => ({
    url: `${BASE}/resources/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  if (!process.env.DATABASE_URL) {
    return [...staticUrls, ...resourceUrls];
  }

  try {
    const [tools, vendors, categories] = await Promise.all([
      prisma.tool.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
        take: 2000,
      }),
      prisma.vendor.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          updatedAt: true,
          tools: { where: { status: "PUBLISHED" }, select: { slug: true }, take: 50 },
        },
        take: 1000,
      }),
      prisma.category.findMany({
        select: { slug: true, updatedAt: true },
        take: 200,
      }),
    ]);

    const toolUrls: MetadataRoute.Sitemap = tools.map((t) => ({
      url: `${BASE}/tools/${t.slug}`,
      lastModified: t.updatedAt ?? now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const vendorUrls: MetadataRoute.Sitemap = vendors.map((v) => {
      const slug = canonicalVendorSlug({ vendorName: v.name, toolSlugs: v.tools.map((t) => t.slug) });
      return {
        url: `${BASE}/vendors/${slug}`,
        lastModified: v.updatedAt ?? now,
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });

    const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${BASE}/categories/${c.slug}`,
      lastModified: c.updatedAt ?? now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticUrls, ...resourceUrls, ...toolUrls, ...vendorUrls, ...categoryUrls];
  } catch {
    return [...staticUrls, ...resourceUrls];
  }
}
