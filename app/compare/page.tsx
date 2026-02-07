export const dynamic = "force-dynamic";

import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { CompareHydrate } from "@/components/compare/CompareHydrate";
import { prisma } from "@/lib/db";

function parseSlugs(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ slugs?: string; tools?: string; diff?: string }>;
}) {
  const sp = await searchParams;
  const slugs = parseSlugs(sp.tools || sp.slugs);

  // Hydrate URL from localStorage if user navigates to /compare directly.
  // (Client-only; does not affect SSR output.)

  if (!slugs.length) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <SiteHeader />
        <CompareHydrate />

        <main className="py-10 sm:py-14">
          <Container>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Compare tools</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                  Add tools to compare from the directory or tool pages.
                </p>
              </div>
              <Link className="text-sm font-medium text-indigo-700 hover:underline" href="/tools">
                Browse tools
              </Link>
            </div>

            <Card className="mt-6 shadow-sm">
              <div className="text-base font-semibold text-zinc-900">No tools selected</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Use the “Compare” button on tool cards to build a shortlist (up to 5).
              </p>
              <Link
                href="/tools"
                className="mt-4 inline-flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Browse tools
              </Link>
            </Card>
          </Container>
        </main>

        <SiteFooter />
      </div>
    );
  }

  if (!process.env.DATABASE_URL) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <SiteHeader />
        <main className="py-10 sm:py-14">
          <Container>
            <Card className="shadow-sm">
              <div className="text-base font-semibold text-zinc-900">Catalog not configured</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">Set DATABASE_URL to use compare in production.</p>
            </Card>
          </Container>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const rows = await prisma.tool.findMany({
    where: { slug: { in: slugs }, status: "PUBLISHED" },
    include: {
      vendor: true,
      categories: { include: { category: true } },
      integrations: { include: { integration: true } },
      pricingPlans: true,
    },
    take: 5,
  });

  const tools = slugs
    .map((s) => rows.find((t) => t.slug === s) ?? null)
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .map((t) => ({
      slug: t.slug,
      name: t.name,
      tagline: t.tagline,
      vendorName: t.vendor?.name ?? null,
      categories: t.categories.map((c) => c.category.name),
      integrations: t.integrations.map((i) => i.integration.name),
      pricing: t.pricingPlans.length
        ? t.pricingPlans
            .slice(0, 2)
            .map((p) => `${p.name}${p.priceNote ? `: ${p.priceNote}` : ""}`)
            .join("\n")
        : "Pricing on request",
    }));

  const diffOnly = sp.diff === "1";

  const tableRows = [
    { key: "categories", label: "Categories", value: (t: (typeof tools)[number]) => t.categories.join(", ") || "—" },
    { key: "integrations", label: "Integrations", value: (t: (typeof tools)[number]) => t.integrations.join(", ") || "—" },
    { key: "pricing", label: "Pricing", value: (t: (typeof tools)[number]) => t.pricing },
  ].filter((r) => {
    if (!diffOnly) return true;
    const values = tools.map((t) => r.value(t));
    return new Set(values).size > 1;
  });

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main className="py-10 sm:py-14">
        <Container>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Compare tools</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                Compare up to 5 tools side-by-side. Use “differences only” to scan faster.
              </p>
            </div>
            <Link className="text-sm font-medium text-indigo-700 hover:underline" href="/tools">
              Browse tools
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              href={`/compare?slugs=${encodeURIComponent(slugs.join(","))}&diff=${diffOnly ? "0" : "1"}`}
            >
              {diffOnly ? "Show all rows" : "Show differences only"}
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
            <table className="min-w-[720px] w-full text-sm">
              <thead className="sticky top-[64px] bg-white">
                <tr className="border-b border-zinc-200">
                  <th className="w-48 p-4 text-left text-xs font-semibold text-zinc-500">Attribute</th>
                  {tools.map((t) => (
                    <th key={t.slug} className="p-4 text-left">
                      <div className="text-sm font-semibold text-zinc-900">{t.name}</div>
                      {t.vendorName ? <div className="mt-1 text-xs text-zinc-500">by {t.vendorName}</div> : null}
                      <div className="mt-3">
                        <Link className="text-xs font-medium text-indigo-700 hover:underline" href={`/tools/${t.slug}`}>
                          View details →
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => (
                  <tr key={r.key} className="border-b border-zinc-200 last:border-0">
                    <td className="p-4 align-top text-xs font-semibold text-zinc-500">{r.label}</td>
                    {tools.map((t) => (
                      <td key={t.slug} className="p-4 align-top text-zinc-700">
                        <pre className="whitespace-pre-wrap font-sans text-sm">{r.value(t)}</pre>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
