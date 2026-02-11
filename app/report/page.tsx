import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

import { prisma } from "@/lib/db";
import { canonicalVendorSlug } from "@/lib/vendors/slug";
import { getVendorBrief } from "@/lib/vendors/brief";

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

  return clampScore(
    compliance * 0.3 + evidence * 0.25 + freshness * 0.2 + integrations * 0.15 - missingPenalty * 0.1,
  );
}

function fmtDate(d: Date | null) {
  if (!d) return "—";
  return d.toISOString().slice(0, 10);
}

function topSignals(args: {
  complianceTagsCount: number;
  evidenceLinksCount: number;
  integrationsCount: number;
  verifiedAt: Date | null;
  missingSignalsCount: number;
}) {
  const out: Array<{ label: string; strength: number }> = [];

  out.push({ label: `Compliance tags: ${args.complianceTagsCount}`, strength: Math.min(10, args.complianceTagsCount) });
  out.push({ label: `Evidence links: ${args.evidenceLinksCount}`, strength: Math.min(10, args.evidenceLinksCount) });
  out.push({ label: `Integrations listed: ${args.integrationsCount}`, strength: Math.min(10, args.integrationsCount) });

  const age = daysSince(args.verifiedAt);
  out.push({
    label: `Verified: ${args.verifiedAt ? fmtDate(args.verifiedAt) : "Needs validation"}`,
    strength: age === null ? 0 : Math.max(0, 10 - Math.floor(age / 45)),
  });

  out.push({
    label: `Missing signals: ${args.missingSignalsCount} / 5`,
    strength: Math.max(0, 10 - args.missingSignalsCount * 3),
  });

  return out
    .sort((a, b) => b.strength - a.strength)
    .map((s) => s.label)
    .slice(0, 3);
}

export default async function ReportPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const rawTier = sp.ct;
  const tier = (Array.isArray(rawTier) ? rawTier[0] : rawTier) as string | undefined;
  const complexityTier = tier === "high" || tier === "medium" || tier === "low" ? tier : null;

  const inputs = {
    headcount: (Array.isArray(sp.headcount) ? sp.headcount[0] : sp.headcount) ?? "—",
    states: (Array.isArray(sp.states) ? sp.states[0] : sp.states) ?? "—",
    payrollFrequency: (Array.isArray(sp.freq) ? sp.freq[0] : sp.freq) ?? "—",
    pfEsiApplicability: (Array.isArray(sp.pfesi) ? sp.pfesi[0] : sp.pfesi) ?? "—",
    contractWorkers: (Array.isArray(sp.contractors) ? sp.contractors[0] : sp.contractors) ?? "—",
    timeline: (Array.isArray(sp.timeline) ? sp.timeline[0] : sp.timeline) ?? "—",
  };

  const rawPremium = sp.premium;
  const premiumVal = (Array.isArray(rawPremium) ? rawPremium[0] : rawPremium) ?? "false";
  const isPremium = premiumVal === "true";

  const ranked = complexityTier && process.env.DATABASE_URL
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
          signals: string[];
        }>;

        for (const v of dbVendors) {
          const slug = canonicalVendorSlug({ vendorName: v.name, toolSlugs: v.tools.map((t) => t.slug) });

          const complianceTags = Array.from(new Set(v.tools.flatMap((t) => t.indiaComplianceTags ?? []))).filter(Boolean);
          const integrations = Array.from(new Set(v.tools.flatMap((t) => t.integrations.map((i) => i.integration.name)))).filter(Boolean);

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

          vendors.push({
            slug,
            name: slug === "freshteam" ? "Freshteam (Freshworks)" : v.name,
            score,
            signals: topSignals({
              complianceTagsCount: complianceTags.length,
              evidenceLinksCount: brief.urls.length,
              integrationsCount: integrations.length,
              verifiedAt,
              missingSignalsCount,
            }),
          });
        }

        return vendors.sort((a, b) => b.score - a.score).slice(0, 12);
      })()
    : [];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      <main className="py-8 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between print:hidden">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Decision report</h1>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Print to PDF from your browser. Mobile-friendly, but export works best on desktop.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ButtonLink href="/recommend" variant="secondary" size="md">
                  Back
                </ButtonLink>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex h-11 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary)] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  Print / Save as PDF
                </button>
              </div>
            </div>

            <Card className="mt-5 p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--text)]">Decision Brief (India payroll context)</div>
                  <div className="mt-1 text-sm text-[var(--text-muted)]">Generated from your inputs. Deterministic; no ML.</div>
                </div>
                <div className="shrink-0">
                  <Badge variant={complexityTier === "high" ? "verified" : "neutral"}>
                    Complexity: {complexityTier ?? "—"}
                  </Badge>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Headcount</div>
                  <div className="mt-1 text-sm font-semibold text-[var(--text)]">{inputs.headcount}</div>
                </div>
                <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">States</div>
                  <div className="mt-1 text-sm font-semibold text-[var(--text)]">{inputs.states}</div>
                </div>
                <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Payroll frequency</div>
                  <div className="mt-1 text-sm font-semibold text-[var(--text)]">{inputs.payrollFrequency}</div>
                </div>
                <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">PF/ESI applicability</div>
                  <div className="mt-1 text-sm font-semibold text-[var(--text)]">{inputs.pfEsiApplicability}</div>
                </div>
                <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Contract workers</div>
                  <div className="mt-1 text-sm font-semibold text-[var(--text)]">{inputs.contractWorkers}</div>
                </div>
                <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Timeline</div>
                  <div className="mt-1 text-sm font-semibold text-[var(--text)]">{inputs.timeline}</div>
                </div>
              </div>

              <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Ranking logic summary</div>
                    <div className="mt-2 text-sm text-[var(--text-muted)]">
                      Score = compliance depth (30%) + evidence depth (25%) + freshness (20%) + integration depth (15%) − missing data penalty (10%).
                    </div>
                  </div>
                  {!isPremium ? (
                    <div className="text-xs text-[var(--text-muted)]">Premium hides watermark + reveals weights</div>
                  ) : null}
                </div>

                {!isPremium ? (
                  <div className="mt-3">
                    <div className="relative overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-3">
                      <div className="pointer-events-none select-none blur-sm">
                        <div className="text-xs font-semibold text-[var(--text-muted)]">Detailed weights</div>
                        <div className="mt-1 text-sm text-[var(--text-muted)]">Compliance 30% • Evidence 25% • Freshness 20% • Integrations 15% • Missing penalty 10%</div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
                          Upgrade for clean executive export
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-3">
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Detailed weights</div>
                    <div className="mt-1 text-sm text-[var(--text-muted)]">
                      Compliance 30% • Evidence 25% • Freshness 20% • Integrations 15% • Missing penalty 10%
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="mt-5 p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--text)]">Ranked vendors</div>
                  <div className="mt-1 text-sm text-[var(--text-muted)]">Sorted by deterministic score for India payroll context.</div>
                </div>
                <div className="text-xs text-[var(--text-muted)]">Top {ranked.length}</div>
              </div>

              <div className="mt-4 space-y-3">
                {ranked.length ? (
                  ranked.map((v, idx) => (
                    <div key={v.slug} className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-[var(--text)]">
                            {idx + 1}. {v.name}
                          </div>
                          <div className="mt-1 text-xs text-[var(--text-muted)]">/{v.slug}</div>
                        </div>
                        <Badge variant={v.score >= 75 ? "verified" : "neutral"}>{v.score}/100</Badge>
                      </div>

                      <div className="mt-3">
                        <div className="text-xs font-semibold text-[var(--text-muted)]">Top signals</div>
                        <ul className="mt-2 space-y-1 text-sm text-[var(--text-muted)]">
                          {v.signals.map((s) => (
                            <li key={s}>• {s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-3 print:hidden">
                        <Link
                          href={`/vendors/${v.slug}`}
                          className="text-sm font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 hover:text-violet-100 hover:decoration-[rgba(124,77,255,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                        >
                          View vendor details →
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-[var(--text-muted)]">
                    Open this report from the Decision Brief flow (so the complexity tier is included).
                  </div>
                )}
              </div>
            </Card>

            <div className="mt-6 border-t border-[var(--border-soft)] pt-4">
              <div className="text-center text-xs text-[var(--text-muted)] opacity-70">
                HRSignal • Decision report • India payroll context • {new Date().getUTCFullYear()}
              </div>
              {!isPremium ? (
                <div className="mt-2 text-center text-[10px] text-[var(--text-muted)] opacity-40">
                  HRSignal watermark — internal use. Verify statutory compliance and month-end scenarios before purchase.
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
