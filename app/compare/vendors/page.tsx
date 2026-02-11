export const dynamic = "force-dynamic";

import Link from "next/link";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

import { canonicalVendorSlug, normalizeVendorSlug } from "@/lib/vendors/slug";
import { getVendorBrief } from "@/lib/vendors/brief";

function uniq(xs: string[]) {
  return Array.from(new Set(xs)).filter(Boolean);
}

function normListParam(raw: string | undefined): string[] {
  const parts = String(raw ?? "")
    .split(",")
    .map((s) => normalizeVendorSlug(s.trim()))
    .filter(Boolean);

  const out: string[] = [];
  for (const p of parts) {
    if (!out.includes(p)) out.push(p);
    if (out.length >= 3) break;
  }
  return out;
}

function fmtDate(d: Date | null): string {
  if (!d) return "—";
  return d.toISOString().slice(0, 10);
}

function clampScore(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

type VendorCompareModel = {
  slug: string;
  name: string;

  overallFit: number;
  toolsConsidered: string;
  indiaComplianceTags: string;
  integrations: string;
  evidenceDepth: string;
  freshness: string;
  riskFlags: string;

  // For deterministic insights
  _verified: boolean;
  _verifiedAt: Date | null;
  _sourceUpdatedAt: Date | null;
  _evidenceLinksCount: number;
  _integrationsCount: number;
  _complianceTagsCount: number;
  _toolsCount: number;
  _missingSignalsCount: number;
};

function daysSince(d: Date | null): number | null {
  if (!d) return null;
  const ms = Date.now() - d.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function computeDecisionConfidenceScore(args: {
  verifiedAt: Date | null;
  evidenceLinksCount: number;
  missingSignalsCount: number;
  totalSignals: number;
}): number {
  // Deterministic formula (no ML).
  // 1) Verification recency drives confidence most.
  // 2) Evidence completeness improves confidence.
  // 3) Missing data ratio reduces confidence.

  const ageDays = daysSince(args.verifiedAt);

  // Recency: full score if <= 30d, decays to 0 by 365d; missing verification = 0.
  const recency =
    ageDays === null ? 0 : clampScore(((365 - Math.min(365, ageDays)) / 365) * 100);

  // Evidence: saturate at 8 links.
  const evidence = clampScore((Math.min(8, args.evidenceLinksCount) / 8) * 100);

  const missingRatio = args.totalSignals > 0 ? args.missingSignalsCount / args.totalSignals : 1;
  const completeness = clampScore((1 - missingRatio) * 100);

  // Weighted blend.
  return clampScore(recency * 0.5 + evidence * 0.3 + completeness * 0.2);
}

function computeOverallFit(args: {
  verified: boolean;
  complianceTagsCount: number;
  evidenceLinksCount: number;
  integrationsCount: number;
  hasPayroll: boolean;
  hasComplianceSignals: boolean;
}): number {
  // Weighted for India payroll context.
  // India compliance (30%), Evidence depth (20%), Integration visibility (15%), Freshness (10%), Payroll edge-case readiness (25%).
  const india = Math.min(30, args.complianceTagsCount * 7.5); // 4 tags ~ full
  const evidence = Math.min(20, args.evidenceLinksCount * 4); // 5 links ~ full
  const integrations = Math.min(15, args.integrationsCount * 3); // 5 integrations ~ full
  const freshness = args.verified ? 10 : 0;
  const edge = args.hasPayroll
    ? args.hasComplianceSignals
      ? 25
      : 10
    : args.hasComplianceSignals
      ? 15
      : 5;

  return clampScore(india + evidence + integrations + freshness + edge);
}

export default async function VendorComparePage({
  searchParams,
}: {
  searchParams: Promise<{ vendors?: string }>;
}) {
  const sp = await searchParams;
  const requested = normListParam(sp.vendors);

  if (!requested.length) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <SiteHeader />
        <Section className="pt-10 sm:pt-14">
          <Card className="p-6">
            <div className="text-sm font-semibold text-[var(--text)]">Compare vendors</div>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Add up to 3 vendors via URL: <span className="font-mono">?vendors=a,b,c</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <ButtonLink href="/vendors" size="md" variant="secondary">
                Browse vendors
              </ButtonLink>
            </div>
          </Card>
        </Section>
        <SiteFooter />
      </div>
    );
  }

  const dbVendors = process.env.DATABASE_URL
    ? await prisma.vendor.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          websiteUrl: true,
          verifiedInIndia: true,
          tools: {
            where: { status: "PUBLISHED" },
            select: {
              slug: true,
              name: true,
              lastVerifiedAt: true,
              indiaComplianceTags: true,
              integrations: { select: { integration: { select: { name: true } } } },
              categories: { select: { category: { select: { slug: true } } } },
            },
            orderBy: { name: "asc" },
            take: 40,
          },
        },
        take: 900,
      })
    : [];

  const bySlug = new Map<string, (typeof dbVendors)[number]>();
  for (const v of dbVendors) {
    const slug = canonicalVendorSlug({ vendorName: v.name, toolSlugs: v.tools.map((t) => t.slug) });
    if (!bySlug.has(slug)) bySlug.set(slug, v);
  }

  const models: VendorCompareModel[] = [];

  for (const slug of requested) {
    const v = bySlug.get(slug) ?? null;
    const brief = await getVendorBrief({
      vendorName: v?.name ?? slug,
      urlSlug: slug,
      toolSlugs: v?.tools.map((t) => t.slug) ?? [],
    });

    const toolNames = v?.tools?.map((t) => t.name).filter(Boolean) ?? [];
    const toolsConsidered = toolNames.length
      ? `${toolNames.length} tool${toolNames.length === 1 ? "" : "s"}: ${toolNames.slice(0, 6).join(", ")}${toolNames.length > 6 ? "…" : ""}`
      : "0 tools";

    const complianceTags = uniq(v ? v.tools.flatMap((t) => t.indiaComplianceTags ?? []) : []);
    const integrations = uniq(v ? v.tools.flatMap((t) => t.integrations.map((i) => i.integration.name)) : []);

    const newestVerificationMs = v
      ? v.tools
          .map((t) => (t.lastVerifiedAt ? new Date(t.lastVerifiedAt).getTime() : 0))
          .reduce((a, b) => Math.max(a, b), 0)
      : 0;

    // Dual freshness logic:
    // - Verification drives status (needs validation if no Tool.lastVerifiedAt)
    // - Source-updated is informational only (no penalty if missing)
    const verified = Boolean(newestVerificationMs);
    const verificationDate = newestVerificationMs ? new Date(newestVerificationMs) : null;

    const freshness = `${verified ? "Verified" : "Needs validation"}: ${fmtDate(verificationDate)}${brief.updatedAt ? ` • Source updated: ${fmtDate(brief.updatedAt)}` : ""}`;

    const hasPayroll = v ? v.tools.some((t) => t.categories.some((c) => c.category.slug === "payroll")) : false;
    const hasComplianceSignals = complianceTags.length > 0;

    const overallFit = computeOverallFit({
      verified,
      complianceTagsCount: complianceTags.length,
      evidenceLinksCount: brief.urls.length,
      integrationsCount: integrations.length,
      hasPayroll,
      hasComplianceSignals,
    });

    const riskFlags: string[] = [];
    if (!v || v.tools.length === 0) riskFlags.push("No published tools (compare will be limited)");
    if (!verified) riskFlags.push("Needs validation: no verification date");
    if (!integrations.length) riskFlags.push("Integrations not listed");
    if (!complianceTags.length) riskFlags.push("India compliance tags not listed");
    if (!brief.urls.length) riskFlags.push("Evidence links missing");

    const missingSignalsCount = [
      !verified,
      !brief.urls.length,
      !integrations.length,
      !complianceTags.length,
      !v || v.tools.length === 0,
    ].filter(Boolean).length;

    models.push({
      slug,
      name: slug === "freshteam" ? "Freshteam (Freshworks)" : v?.name ?? slug,
      overallFit,
      toolsConsidered,
      indiaComplianceTags: complianceTags.length ? complianceTags.join(", ") : "—",
      integrations: integrations.length ? integrations.join(", ") : "—",
      evidenceDepth: brief.urls.length ? String(brief.urls.length) : "—",
      freshness,
      riskFlags: riskFlags.length ? riskFlags.slice(0, 5).join(" • ") : "—",
      _verified: verified,
      _verifiedAt: verificationDate,
      _sourceUpdatedAt: brief.updatedAt,
      _evidenceLinksCount: brief.urls.length,
      _integrationsCount: integrations.length,
      _complianceTagsCount: complianceTags.length,
      _toolsCount: v?.tools.length ?? 0,
      _missingSignalsCount: missingSignalsCount,
    });
  }

  const rows: Array<{ id: keyof VendorCompareModel; label: string }> = [
    { id: "overallFit", label: "HRSignal Readiness Score" },
    { id: "toolsConsidered", label: "Tools considered" },
    { id: "indiaComplianceTags", label: "India compliance tags (union)" },
    { id: "integrations", label: "Integrations (union)" },
    { id: "evidenceDepth", label: "Evidence depth (links)" },
    { id: "freshness", label: "Freshness" },
    { id: "riskFlags", label: "Risk flags" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Compare vendors</h1>
            <p className="mt-1 max-w-2xl text-sm text-[var(--text-muted)]">
              India payroll context: verification drives status; source-updated is informational only.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/vendors" size="md" variant="secondary">
              Browse vendors
            </ButtonLink>
          </div>
        </div>

        {/* Decision Intelligence Layer */}
        <Card className="p-5">
          {(() => {
            const totalSignals = 5;
            const confidence = computeDecisionConfidenceScore({
              verifiedAt: models.some((m) => m._verifiedAt) ? new Date(Math.max(...models.map((m) => (m._verifiedAt ? m._verifiedAt.getTime() : 0)))) : null,
              evidenceLinksCount: models.reduce((a, m) => a + m._evidenceLinksCount, 0),
              missingSignalsCount: Math.max(...models.map((m) => m._missingSignalsCount)),
              totalSignals,
            });

            const strongestCompliance = models.slice().sort((a, b) => b._complianceTagsCount - a._complianceTagsCount)[0];
            const strongestIntegrations = models.slice().sort((a, b) => b._integrationsCount - a._integrationsCount)[0];
            const lowestEvidence = models.slice().sort((a, b) => a._evidenceLinksCount - b._evidenceLinksCount)[0];
            const highestRisk = models.slice().sort((a, b) => b._missingSignalsCount - a._missingSignalsCount)[0];

            return (
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)]">Comparison Insight (India payroll context)</div>
                    <div className="mt-1 text-sm text-[var(--text-muted)]">
                      Deterministic insights from verification, evidence links, and missing listing signals.
                    </div>
                  </div>

                  <div className="shrink-0">
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Decision confidence score</div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant={confidence >= 70 ? "verified" : "neutral"}>{confidence} / 100</Badge>
                      <span
                        className="text-xs text-[var(--text-muted)]"
                        title="Computed from verification recency, evidence completeness, and missing data ratio. Deterministic; no ML."
                      >
                        How?
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Strongest compliance depth</div>
                    <div className="mt-1 text-sm font-semibold text-[var(--text)]">{strongestCompliance?.name ?? "—"}</div>
                    <div className="mt-1 text-xs text-[var(--text-muted)]">Tags: {strongestCompliance?._complianceTagsCount ?? 0}</div>
                  </div>

                  <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Strongest integration visibility</div>
                    <div className="mt-1 text-sm font-semibold text-[var(--text)]">{strongestIntegrations?.name ?? "—"}</div>
                    <div className="mt-1 text-xs text-[var(--text-muted)]">Integrations: {strongestIntegrations?._integrationsCount ?? 0}</div>
                  </div>

                  <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Lowest evidence depth</div>
                    <div className="mt-1 text-sm font-semibold text-[var(--text)]">{lowestEvidence?.name ?? "—"}</div>
                    <div className="mt-1 text-xs text-[var(--text-muted)]">
                      Links: {lowestEvidence?._evidenceLinksCount ?? 0}{lowestEvidence && lowestEvidence._evidenceLinksCount === 0 ? " • Flag" : ""}
                    </div>
                  </div>

                  <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Highest risk listing</div>
                    <div className="mt-1 text-sm font-semibold text-[var(--text)]">{highestRisk?.name ?? "—"}</div>
                    <div className="mt-1 text-xs text-[var(--text-muted)]">Missing signals: {highestRisk?._missingSignalsCount ?? 0} / {totalSignals}</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </Card>

        {/* Mobile-first stacked comparison */}
        <div className="space-y-4 lg:hidden">
          {models.map((v) => (
            <Card key={v.slug} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-[var(--text)]">{v.name}</div>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">{v.slug}</div>
                </div>
                <span title="India-specific payroll compliance + verification intelligence score (0–100)">
                  <Badge variant={v.overallFit >= 80 ? "verified" : "neutral"}>HRSignal Readiness {v.overallFit}/100</Badge>
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {rows.slice(1).map((r) => (
                  <div key={String(r.id)} className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                    <div className="text-xs font-semibold text-[var(--text-muted)]">{r.label}</div>
                    <div className="mt-1 text-sm leading-relaxed text-[var(--text)]">
                      {String(v[r.id] ?? "—")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Link
                  className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline"
                  href={`/vendors/${v.slug}`}
                >
                  View vendor →
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block">
          <Card className="overflow-x-auto p-0">
            <table className="min-w-[980px] w-full text-sm">
              <thead className="bg-[var(--surface-1)]">
                <tr className="border-b border-[var(--border-soft)]">
                  <th className="p-4 text-left text-xs font-semibold text-[var(--text-muted)] w-[220px]">Field</th>
                  {models.map((v) => (
                    <th key={v.slug} className="p-4 text-left align-top">
                      <div className="text-sm font-semibold text-[var(--text)]">{v.name}</div>
                      <div className="mt-1 text-xs text-[var(--text-muted)]">{v.slug}</div>
                      <div className="mt-3">
                        <span title="India-specific payroll compliance + verification intelligence score (0–100)">
                          <Badge variant={v.overallFit >= 80 ? "verified" : "neutral"}>HRSignal Readiness {v.overallFit}/100</Badge>
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((r) => (
                  <tr key={String(r.id)} className="border-b border-[var(--border-soft)] align-top last:border-0">
                    <td className="p-4 text-xs font-semibold text-[var(--text-muted)]">{r.label}</td>
                    {models.map((v) => (
                      <td key={v.slug + String(r.id)} className="p-4 text-sm text-[var(--text)]">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-[var(--text)]">{String(v[r.id] ?? "—")}</pre>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="mt-4 text-xs text-[var(--text-muted)]" title="Weights are tuned for India payroll context.">
          Tip: compare up to 3 vendors using <span className="font-mono">?vendors=a,b,c</span>.
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
