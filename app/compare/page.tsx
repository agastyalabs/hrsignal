export const dynamic = "force-dynamic";

import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { CompareHydrate } from "@/components/compare/CompareHydrate";
import { prisma } from "@/lib/db";
import { CompareActions } from "./CompareActions";
import { normalizePricingText, pricingTypeFromNote } from "@/lib/pricing/format";

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
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)]">
        <SiteHeader />
        <CompareHydrate />

        <main className="py-10 sm:py-14">
          <Container>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">Compare tools</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                  Add tools to compare from the directory or tool pages.
                </p>
              </div>
              <Link className="text-sm font-medium text-[var(--link)] hover:text-[var(--link-hover)] hover:underline" href="/tools">
                Browse tools
              </Link>
            </div>

            <Card className="mt-6 p-6">
              <div className="text-base font-semibold text-[var(--text)]">No tools selected</div>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Use the “Compare” button on tool cards to build a shortlist (up to 5).
              </p>
              <Link
                href="/tools"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
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
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)]">
        <SiteHeader />
        <main className="py-10 sm:py-14">
          <Container>
            <Card className="p-6">
              <div className="text-base font-semibold text-[var(--text)]">Catalog not configured</div>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Set DATABASE_URL to use compare in production.</p>
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
      supportedStates: t.supportedStates,
      categories: t.categories.map((c) => ({ slug: c.category.slug, name: c.category.name })),
      integrations: t.integrations.map((i) => i.integration.name),
      pricing: t.pricingPlans.length
        ? t.pricingPlans
            .slice(0, 3)
            .map((p) => {
              const type = pricingTypeFromNote(p.priceNote, t.deployment);
              const text = normalizePricingText(p.priceNote, type);
              const setup = p.setupFeeNote ? `\nSetup: ${p.setupFeeNote}` : "";
              return `${p.name}\n${type}\n${text}${setup}`;
            })
            .join("\n")
        : "Quote-based\nContact vendor / request quote",
    }));

  const diffOnly = sp.diff === "1";

  const sections: Array<{
    id: string;
    label: string;
    rows: Array<{ key: string; label: string; value: (t: (typeof tools)[number]) => string }>;
  }> = [
    {
      id: "pricing",
      label: "Pricing",
      rows: [
        { key: "pricing", label: "Plans", value: (t) => t.pricing || "—" },
        {
          key: "pricing_note",
          label: "Notes",
          value: () =>
            "Badges indicate pricing type: Per employee / month, Per company / month, One-time (license; AMC may apply), Quote-based (contact vendor / request quote).", 
        },
      ],
    },
    {
      id: "features",
      label: "Core features",
      rows: [
        {
          key: "categories",
          label: "Modules",
          value: (t) => t.categories.map((c) => c.name).join(", ") || "—",
        },
        {
          key: "tagline",
          label: "Summary",
          value: (t) => t.tagline || "—",
        },
      ],
    },
    {
      id: "compliance",
      label: "India compliance",
      rows: [
        {
          key: "states",
          label: "Supported states",
          value: (t) => (t.supportedStates?.length ? t.supportedStates.join(", ") : "Not specified"),
        },
        {
          key: "compliance_hint",
          label: "Common compliance",
          value: (t) => {
            const catSlugs = new Set(t.categories.map((c) => c.slug));
            if (catSlugs.has("payroll")) return "PF/ESI/PT/TDS support (verify scope with vendor).";
            if (catSlugs.has("hrms")) return "Policies + document workflows (verify compliance add-ons).";
            return "Not specified";
          },
        },
      ],
    },
    {
      id: "integrations",
      label: "Integrations",
      rows: [
        {
          key: "integrations",
          label: "Native / listed",
          value: (t) => (t.integrations.length ? t.integrations.join(", ") : "Not listed"),
        },
      ],
    },
    {
      id: "support",
      label: "Support",
      rows: [
        { key: "support", label: "Channels", value: () => "Not listed" },
        { key: "sla", label: "SLA", value: () => "Not listed" },
      ],
    },
    {
      id: "deployment",
      label: "Deployment",
      rows: [
        { key: "deployment", label: "Type", value: () => "Not listed" },
      ],
    },
  ];

  const sectionsFiltered = sections
    .map((s) => ({
      ...s,
      rows: s.rows.filter((r) => {
        if (!diffOnly) return true;
        const values = tools.map((t) => r.value(t));
        return new Set(values).size > 1;
      }),
    }))
    .filter((s) => s.rows.length > 0);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)]">
      <SiteHeader />
      <main className="py-10 sm:py-14">
        <Container>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">Compare tools</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                Compare up to 5 tools side-by-side. Use “differences only” to scan faster.
              </p>
            </div>
            <Link className="text-sm font-medium text-[var(--link)] hover:text-[var(--link-hover)] hover:underline" href="/tools">
              Browse tools
            </Link>
          </div>

          <CompareActions tools={slugs} />

          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-1)]">
            <table className="min-w-[880px] w-full text-sm">
              <thead className="sticky top-[64px] z-10 bg-[var(--surface-1)]">
                <tr className="border-b border-[var(--border-soft)]">
                  <th className="sticky left-0 w-56 bg-[var(--surface-1)] p-4 text-left text-xs font-semibold text-[var(--text-muted)]">
                    Attribute
                  </th>
                  {tools.map((t) => (
                    <th key={t.slug} className="p-4 text-left align-top">
                      <div className="text-sm font-semibold text-[var(--text)]">{t.name}</div>
                      {t.vendorName ? <div className="mt-1 text-xs text-[var(--text-muted)]">by {t.vendorName}</div> : null}
                      <div className="mt-3">
                        <Link className="text-xs font-medium text-[var(--link)] hover:text-[var(--link-hover)] hover:underline" href={`/tools/${t.slug}`}>
                          View details →
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sectionsFiltered.flatMap((section) => {
                  const header = (
                    <tr key={section.id} className="border-b border-[var(--border-soft)]">
                      <td
                        colSpan={tools.length + 1}
                        className="bg-[var(--surface-2)] px-4 py-2 text-xs font-semibold text-[var(--text)]"
                      >
                        {section.label}
                      </td>
                    </tr>
                  );

                  const rows = section.rows.map((r) => (
                    <tr key={`${section.id}:${r.key}`} className="border-b border-[var(--border-soft)] last:border-0">
                      <td className="sticky left-0 bg-[var(--surface-1)] p-4 align-top text-xs font-semibold text-[var(--text-muted)]">
                        {r.label}
                      </td>
                      {tools.map((t) => (
                        <td key={t.slug} className="p-4 align-top text-[var(--text)]">
                          <pre className="whitespace-pre-wrap font-sans text-sm text-[var(--text)]">{r.value(t)}</pre>
                        </td>
                      ))}
                    </tr>
                  ));

                  return [header, ...rows];
                })}
              </tbody>
            </table>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
