import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

import { prisma } from "@/lib/db";
import { canonicalVendorSlug } from "@/lib/vendors/slug";
import { getVendorBrief } from "@/lib/vendors/brief";

import { RecommendTabs } from "./RecommendTabs";

export const dynamic = "force-dynamic";

function clampScore(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function daysSince(d: Date | null): number | null {
  if (!d) return null;
  const ms = Date.now() - d.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function norm01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function capForTier(tier: "low" | "medium" | "high" | null) {
  if (tier === "high") return { compliance: 5, evidence: 8, integrations: 8 };
  if (tier === "medium") return { compliance: 4, evidence: 6, integrations: 6 };
  return { compliance: 3, evidence: 5, integrations: 5 };
}

function computeFreshnessScore(verifiedAt: Date | null) {
  const ageDays = daysSince(verifiedAt);
  if (ageDays === null) return 0;
  // Full if <= 30d, linear decay to 0 by 365d.
  return clampScore(((365 - Math.min(365, Math.max(0, ageDays - 30))) / 365) * 100);
}

function computeVendorScore(args: {
  tier: "low" | "medium" | "high" | null;
  complianceTagsCount: number;
  evidenceLinksCount: number;
  verifiedAt: Date | null;
  integrationsCount: number;
  missingSignalsCount: number;
  totalSignals: number;
}) {
  const caps = capForTier(args.tier);

  const compliance = clampScore(norm01(args.complianceTagsCount / caps.compliance) * 100);
  const evidence = clampScore(norm01(args.evidenceLinksCount / caps.evidence) * 100);
  const freshness = computeFreshnessScore(args.verifiedAt);
  const integrations = clampScore(norm01(args.integrationsCount / caps.integrations) * 100);

  const missingRatio = args.totalSignals > 0 ? args.missingSignalsCount / args.totalSignals : 1;
  const missingPenalty = clampScore(missingRatio * 100);

  // Weighted formula:
  // compliance depth (30%), evidence depth (25%), freshness (20%), integration depth (15%), missing data penalty (10%).
  return clampScore(
    compliance * 0.3 + evidence * 0.25 + freshness * 0.2 + integrations * 0.15 - missingPenalty * 0.1,
  );
}

function topReasons(args: {
  complianceTagsCount: number;
  integrationsCount: number;
  evidenceLinksCount: number;
  verifiedAt: Date | null;
  missingSignalsCount: number;
  totalSignals: number;
}) {
  const reasons: string[] = [];

  if (args.complianceTagsCount >= 3) reasons.push("Strong India compliance coverage signals");
  else if (args.complianceTagsCount === 0) reasons.push("Compliance tags not listed (validate PF/ESI/PT/TDS scope)");

  if (args.integrationsCount >= 4) reasons.push("More integration visibility (shorter IT validation)");
  else if (args.integrationsCount === 0) reasons.push("Integrations not listed (confirm integration method + exports)");

  if (args.evidenceLinksCount >= 3) reasons.push("More evidence links to validate claims");
  else if (args.evidenceLinksCount === 0) reasons.push("Evidence depth is low (flag)");

  const age = daysSince(args.verifiedAt);
  if (age !== null && age <= 90) reasons.push("Recently verified listing");
  else if (args.verifiedAt === null) reasons.push("No verification date (needs validation)");

  const missingRatio = args.totalSignals > 0 ? args.missingSignalsCount / args.totalSignals : 1;
  if (missingRatio >= 0.6) reasons.push("Multiple missing listing signals (higher due diligence)");

  return reasons.slice(0, 3);
}

export default async function RecommendPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const rawMode = sp.mode;
  const mode = (Array.isArray(rawMode) ? rawMode[0] : rawMode) === "detailed" ? "detailed" : "quick";

  const rawTier = sp.ct;
  const tier = (Array.isArray(rawTier) ? rawTier[0] : rawTier) as string | undefined;
  const complexityTier = tier === "high" || tier === "medium" || tier === "low" ? tier : null;

  const showRanking = Boolean(complexityTier);

  const ranked = showRanking && process.env.DATABASE_URL
    ? await (async () => {
        const dbVendors = await prisma.vendor.findMany({
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            tools: {
              where: { status: "PUBLISHED" },
              select: {
                slug: true,
                name: true,
                lastVerifiedAt: true,
                indiaComplianceTags: true,
                integrations: { select: { integration: { select: { name: true } } } },
              },
              orderBy: { name: "asc" },
              take: 40,
            },
          },
          take: 900,
        });

        const vendors = [] as Array<{
          slug: string;
          name: string;
          score: number;
          reasons: string[];
          details: {
            complianceTagsCount: number;
            integrationsCount: number;
            evidenceLinksCount: number;
            verifiedAt: Date | null;
            missingSignalsCount: number;
          };
        }>;

        for (const v of dbVendors) {
          const slug = canonicalVendorSlug({ vendorName: v.name, toolSlugs: v.tools.map((t) => t.slug) });

          const complianceTags = Array.from(new Set(v.tools.flatMap((t) => t.indiaComplianceTags ?? []))).filter(Boolean);
          const integrations = Array.from(
            new Set(v.tools.flatMap((t) => t.integrations.map((i) => i.integration.name))),
          ).filter(Boolean);

          const newestVerificationMs = v.tools
            .map((t) => (t.lastVerifiedAt ? new Date(t.lastVerifiedAt).getTime() : 0))
            .reduce((a, b) => Math.max(a, b), 0);
          const verifiedAt = newestVerificationMs ? new Date(newestVerificationMs) : null;

          const brief = await getVendorBrief({
            vendorName: v.name,
            urlSlug: slug,
            toolSlugs: v.tools.map((t) => t.slug),
          });

          const missingSignalsCount = [
            !verifiedAt,
            brief.urls.length === 0,
            integrations.length === 0,
            complianceTags.length === 0,
            v.tools.length === 0,
          ].filter(Boolean).length;

          const totalSignals = 5;

          const score = computeVendorScore({
            tier: complexityTier,
            complianceTagsCount: complianceTags.length,
            evidenceLinksCount: brief.urls.length,
            verifiedAt,
            integrationsCount: integrations.length,
            missingSignalsCount,
            totalSignals,
          });

          const reasons = topReasons({
            complianceTagsCount: complianceTags.length,
            integrationsCount: integrations.length,
            evidenceLinksCount: brief.urls.length,
            verifiedAt,
            missingSignalsCount,
            totalSignals,
          });

          vendors.push({
            slug,
            name: slug === "freshteam" ? "Freshteam (Freshworks)" : v.name,
            score,
            reasons,
            details: {
              complianceTagsCount: complianceTags.length,
              integrationsCount: integrations.length,
              evidenceLinksCount: brief.urls.length,
              verifiedAt,
              missingSignalsCount,
            },
          });
        }

        return vendors.sort((a, b) => b.score - a.score).slice(0, 12);
      })()
    : [];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />

      <main className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-[#F9FAFB]">Get recommendations</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#CBD5E1]">
              Answer a few questions. HRSignal recommends 3–5 best‑fit tools with clear match reasons.
            </p>

            {showRanking ? (
              <div className="mt-6">
                <Card className="p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[var(--text)]">Deterministic vendor ranking (no ML)</div>
                      <div className="mt-1 text-sm text-[var(--text-muted)]">
                        Complexity tier: <span className="font-semibold text-[var(--text)]">{complexityTier}</span>. Ranked using compliance, evidence, freshness, integrations, and missing-signal penalty.
                      </div>
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">Showing top {ranked.length} vendors</div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-[var(--text-muted)]">Export a printable decision report for internal review.</div>
                    <Link
                      href={`/report?${new URLSearchParams(Object.entries(sp).flatMap(([k, v]) => {
                        const val = Array.isArray(v) ? v[0] : v;
                        return typeof val === "string" ? [[k, val]] : [];
                      })).toString()}`}
                      className="inline-flex h-11 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-1)] px-4 text-sm font-semibold text-[var(--text)] transition-all duration-200 hover:bg-[var(--surface-2)] hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.18)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.30)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    >
                      Export report (PDF)
                    </Link>
                  </div>

                  <div className="mt-4 space-y-3">
                    {ranked.map((v) => (
                      <div key={v.slug} className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-[var(--text)]">{v.name}</div>
                            <div className="mt-1 text-xs text-[var(--text-muted)]">/{v.slug}</div>
                          </div>
                          <Badge variant={v.score >= 75 ? "verified" : "neutral"}>{v.score}/100</Badge>
                        </div>

                        <details className="mt-3">
                          <summary className="cursor-pointer text-sm font-semibold text-[var(--text)] underline decoration-[rgba(255,255,255,0.18)] underline-offset-4 hover:decoration-[rgba(255,255,255,0.28)]">
                            Why ranked here
                          </summary>
                          <div className="mt-2 space-y-2 text-sm text-[var(--text-muted)]">
                            <ul className="space-y-1">
                              {v.reasons.map((r) => (
                                <li key={r}>• {r}</li>
                              ))}
                            </ul>
                            <div className="text-xs text-[var(--text-muted)]">
                              Signals: compliance tags {v.details.complianceTagsCount}, integrations {v.details.integrationsCount}, evidence links {v.details.evidenceLinksCount}, verified {v.details.verifiedAt ? "yes" : "no"}, missing {v.details.missingSignalsCount}/5.
                            </div>
                            <div className="pt-1">
                              <Link
                                href={`/vendors/${v.slug}`}
                                className="text-sm font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 hover:text-violet-100 hover:decoration-[rgba(124,77,255,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                              >
                                View vendor details →
                              </Link>
                            </div>
                          </div>
                        </details>
                      </div>
                    ))}

                    {ranked.length === 0 ? (
                      <div className="text-sm text-[var(--text-muted)]">
                        Ranking is available when opened from the Decision Brief flow.
                      </div>
                    ) : null}
                  </div>
                </Card>
              </div>
            ) : null}

            <div className="mt-6">
              <RecommendTabs initialMode={mode} />
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
