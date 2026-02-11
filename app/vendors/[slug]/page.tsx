export const dynamic = "force-dynamic";
export const dynamicParams = true;

import Link from "next/link";

import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { canonicalVendorSlug, normalizeVendorSlug, resolveSlugRedirect } from "@/lib/vendors/slug";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { VendorLogo } from "@/components/VendorLogo";
import { domainFromUrl } from "@/lib/brand/logo";
import { normalizePricingText, pricingTypeFromNote } from "@/lib/pricing/format";
import { getVendorBrief } from "@/lib/vendors/brief";
import { Markdownish } from "@/app/resources/Markdownish";
import { EvidenceLinks } from "@/components/vendors/EvidenceLinks";
import { StickyCtas } from "@/components/vendors/StickyCtas";
import { ScorePill } from "./ScorePill";
import { FitWeightRow } from "./FitWeightRow";
import { getResearchedVendorProfile } from "@/lib/vendors/researched";
import type { Metadata } from "next";
import { absUrl } from "@/lib/seo/url";

function slugify(name: string) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = normalizeVendorSlug(rawSlug);
  const title = `${slug} — Vendor profile | HRSignal`;
  const description = `Evidence-first vendor profile for ${slug}. Compare modules, India readiness, implementation notes, and sources.`;
  const url = absUrl(`/vendors/${slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function VendorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = normalizeVendorSlug(rawSlug);

  // If a markdown brief exists, we should be able to render even if catalog DB is missing.
  const slugBrief = await getVendorBrief({ vendorName: slug, urlSlug: slug });

  type VendorWithIncludes = Prisma.VendorGetPayload<{
    include: {
      categories: true;
      tools: {
        include: {
          categories: { include: { category: true } };
          integrations: { include: { integration: true } };
          pricingPlans: true;
        };
      };
    };
  }>;

  let vendor: VendorWithIncludes | null = null;

  if (process.env.DATABASE_URL) {
    // Back-compat: if caller passed an id, this will still resolve.
    vendor = await prisma.vendor.findUnique({
      where: { id: slug },
      include: {
        categories: true,
        tools: {
          where: { status: "PUBLISHED" },
          orderBy: { name: "asc" },
          include: {
            categories: { include: { category: true } },
            integrations: { include: { integration: true } },
            pricingPlans: true,
          },
        },
      },
    });

    if (!vendor) {
      // Resolve by derived slug from vendor name.
      const rows = await prisma.vendor.findMany({
        where: { isActive: true },
        select: { id: true },
        take: 500,
      });

      // Fetch names in a second query (prisma doesn't let us compute slug in SQL).
      const vendorsById = await prisma.vendor.findMany({
        where: { id: { in: rows.map((r) => r.id) } },
        include: {
          categories: true,
          tools: {
            where: { status: "PUBLISHED" },
            orderBy: { name: "asc" },
            include: {
              categories: { include: { category: true } },
              integrations: { include: { integration: true } },
              pricingPlans: true,
            },
          },
        },
      });

      vendor =
        vendorsById.find((v) => {
          if (slugify(v.name) === slug) return true;
          const canon = canonicalVendorSlug({ vendorName: v.name, toolSlugs: v.tools.map((t) => t.slug) });
          return canon === slug;
        }) ??
        null;
    }
  }

  // If vendor isn't in catalog but a brief exists, render a researched template with strong fallbacks.
  if (!vendor) {
    if (!slugBrief.exists) return notFound();

    // Redirect any alias slug to its normalized form.
    if (rawSlug !== slug) redirect(`/vendors/${slug}`);

    const profile = getResearchedVendorProfile(slug);
    const title = profile?.displayName ?? (slug === "freshteam" ? "Freshteam (Freshworks)" : slug);


    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <SiteHeader />

        <Section className="pt-10 sm:pt-14">
          <div className="mb-6">
            <Link className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/vendors">
              ← Back to vendors
            </Link>
          </div>

          <div className="flex flex-col gap-8">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">{title}</h1>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {profile?.descriptor ?? "A vendor profile template with evidence links and evaluation guidance."}
                  </p>
                </div>

                {slugBrief.updatedAt ? (
                  <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-muted)]">
                    Last updated: <span className="font-semibold text-[var(--text)]">{slugBrief.updatedAt.toISOString().slice(0, 10)}</span>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="text-sm font-semibold text-[var(--text)]">Overview</div>
                  <div className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                    {profile?.overview ??
                      "We’re upgrading this vendor profile into a researched template. Use the Evidence links below to validate pricing, security, and support."}
                  </div>

                  {slugBrief.sections["overview"] || slugBrief.sections["snapshot"] ? (
                    <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                      <Markdownish content={slugBrief.sections["overview"] ?? slugBrief.sections["snapshot"] ?? ""} />
                    </div>
                  ) : null}
                </div>

                <div>
                  <div className="text-sm font-semibold text-[var(--text)]">CTA</div>
                  <div className="mt-2 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                    <div className="text-sm font-semibold text-[var(--text)]">Generate an explainable shortlist</div>
                    <div className="mt-1 text-sm text-[var(--text-muted)]">
                      Answer a few questions and we’ll shortlist 3–5 tools with match reasons.
                    </div>
                    <div className="mt-4">
                      <Link className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/recommend">
                        Get recommendations →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Evidence</div>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Primary sources (docs, pricing, security, support).</p>
              <div className="mt-3">
                <EvidenceLinks links={profile?.evidence ?? []} />
              </div>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
              <div className="text-sm font-semibold text-[var(--text)]">FAQs</div>
              <div className="mt-3 space-y-3">
                {(profile?.faqs?.length
                  ? profile.faqs
                  : [
                      {
                        q: "How should I evaluate this vendor quickly?",
                        a: "Start with Pricing + Security + Support evidence links, then request a focused demo for your payroll/implementation edge cases.",
                      },
                    ]
                ).map((f) => (
                  <details key={f.q} className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-3">
                    <summary className="cursor-pointer select-none text-sm font-semibold text-[var(--text)]">{f.q}</summary>
                    <div className="mt-2 text-sm text-[var(--text-muted)]">{f.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <SiteFooter />
      </div>
    );
  }

  // Redirect aliases (or derived slugs) to the canonical vendor slug.
  const canon = canonicalVendorSlug({ vendorName: vendor.name, toolSlugs: vendor.tools.map((t) => t.slug) });
  const maybeRedirect = resolveSlugRedirect({ requestedSlug: rawSlug, canonicalSlug: canon });
  if (maybeRedirect) redirect(`/vendors/${maybeRedirect}`);

  const v = vendor;
  const profile = getResearchedVendorProfile(normalizeVendorSlug(canon));

  const toolCategories = Array.from(new Set(v.tools.flatMap((t) => t.categories.map((c) => c.category.name))));

  const catSlugs = new Set(v.tools.flatMap((t) => t.categories.map((c) => c.category.slug)));

  const integrationNames = Array.from(new Set(v.tools.flatMap((t) => t.integrations.map((i) => i.integration.name)))).sort();

  const complianceTags = Array.from(new Set(v.tools.flatMap((t) => t.indiaComplianceTags ?? []))).sort();

  const deploymentTypes = Array.from(new Set(v.tools.map((t) => (t.deployment ? String(t.deployment) : null)).filter(Boolean) as string[]));

  function deploymentLabel(): string {
    if (!deploymentTypes.length) return "Info pending";
    const norm = deploymentTypes.map((d) => d.toUpperCase());
    const out: string[] = [];
    if (norm.includes("CLOUD")) out.push("Cloud / SaaS");
    if (norm.includes("ONPREM") || norm.includes("ON-PREM")) out.push("On‑prem");
    if (norm.includes("HYBRID")) out.push("Hybrid");
    return out.join(" • ") || "Info pending";
  }

  function overviewCopy(): string[] {
    // Keep it specific to what we actually know: modules + India + integrations.
    const modules: string[] = [];
    if (catSlugs.has("hrms")) modules.push("core HR (employee lifecycle, org, docs)");
    if (catSlugs.has("payroll")) modules.push("payroll + India compliance workflows");
    if (catSlugs.has("attendance")) modules.push("attendance/leave/time policies");
    if (catSlugs.has("ats")) modules.push("hiring (ATS) workflows");
    if (catSlugs.has("performance")) modules.push("performance/OKR cycles");

    if (!v.tools.length) {
      return [
        `${v.name} is listed on HRSignal. We’re building out a fuller vendor brief as more catalog metadata is verified.`,
        "In the meantime, use the checklist below to validate pricing units, India compliance scope, and implementation effort during your demo.",
      ];
    }

    const moduleLine = modules.length ? `They publish tools covering ${modules.join(", ")}.` : "They publish HR software tools on HRSignal.";
    const indiaLine = v.verifiedInIndia
      ? "This is an India-first listing (verify state coverage + statutory scope during evaluation)."
      : "India coverage is not fully verified yet — confirm statutory scope (PF/ESI/PT/TDS) if payroll is in scope.";

    const integLine = integrationNames.length
      ? `Common integrations are listed (e.g., ${integrationNames.slice(0, 3).join(", ")}).`
      : "Integrations are still being verified; ask for a native integration list during the demo.";

    return [moduleLine, indiaLine, integLine];
  }

  function moduleBullets(): string[] {
    const bullets: string[] = [];
    if (catSlugs.has("hrms")) bullets.push("Core HR: employee master, org structure, documents, approvals");
    if (catSlugs.has("attendance")) bullets.push("Attendance/leave: policies, shifts, approvals, exports");
    if (catSlugs.has("payroll")) bullets.push("Payroll: monthly cycles, compliance support, reconciliations");
    if (catSlugs.has("ats")) bullets.push("ATS: pipeline stages, interviews, offers, onboarding handoff");
    if (catSlugs.has("performance")) bullets.push("Performance/OKR: cycles, goals, feedback, analytics");
    if (!bullets.length) {
      return [
        "Info pending: modules/features are being verified",
        "Ask for a product walkthrough mapped to your HR processes",
        "Confirm exports/reports you need (PF/ESI/PT registers, attendance, onboarding)",
        "Validate role-based access + audit trails",
      ];
    }
    return bullets;
  }

  function buyerQuestions(): string[] {
    const qs: string[] = [];
    qs.push("What is the exact pricing metric (per employee/month vs per company/month vs quote-based) and minimum billable headcount?");
    if (catSlugs.has("payroll")) qs.push("Which statutory items are covered (PF/ESI/PT/TDS/LWF) and for which states?");
    if (catSlugs.has("attendance")) qs.push("How do shift rules, overtime, and biometric/device integrations work?");
    if (catSlugs.has("ats")) qs.push("Do they support careers page, email templates, and interview scorecards natively?");
    qs.push("What are typical implementation timelines, data migration scope, and post-go-live support SLAs?");
    return qs.slice(0, 6);
  }

  function prosCons(): { pros: string[]; cons: string[] } {
    const pros: string[] = [];
    const cons: string[] = [];

    if (v.tools.length >= 2) pros.push("Multiple published tools (clearer module coverage)");
    else pros.push("Focused catalog footprint (simpler evaluation)");

    if (integrationNames.length) pros.push("Integrations listed (reduces unknowns during evaluation)");
    else cons.push("Integrations not fully listed yet — ask for a current integration sheet");

    if (v.verifiedInIndia) pros.push("India-first listing signals available (verify scope)");
    else cons.push("India coverage not verified — confirm compliance/state coverage in the demo");

    // NOTE: pricingNotes is defined later; avoid TDZ errors by checking directly from tools.
    const hasPricingNotes = v.tools.some((t) => (t.pricingPlans ?? []).some((p) => Boolean(p.priceNote)));
    if (hasPricingNotes) pros.push("Some pricing notes are available (units are labeled)");
    else cons.push("Pricing is quote-based/unclear — confirm unit, minimums, and add-ons");

    // Keep balanced and not sales-y
    cons.push("Always validate edge cases (multi-state, complex shifts, retro payroll) with real scenarios");

    return { pros: pros.slice(0, 4), cons: cons.slice(0, 4) };
  }

  const overviewLines = overviewCopy();
  const modules = moduleBullets();
  const qa = buyerQuestions();
  const { pros, cons } = prosCons();

  const sizeLabel = (band: string) => {
    if (band === "EMP_20_200") return "51–200";
    if (band === "EMP_50_500") return "201–500";
    if (band === "EMP_100_1000") return "501–1000";
    return band;
  };

  const bestForSizes = vendor.supportedSizeBands.length
    ? vendor.supportedSizeBands.map((b) => sizeLabel(b)).join(", ")
    : null;

  const bestForStates = vendor.supportedStates?.length ? vendor.supportedStates.join(", ") : null;

  const pricingNotes = vendor.tools
    .flatMap((t) =>
      t.pricingPlans.map((p) => {
        const type = pricingTypeFromNote(p.priceNote, t.deployment);
        return {
          tool: t.name,
          name: p.name,
          type,
          note: normalizePricingText(p.priceNote, type),
        };
      })
    )
    .filter((x) => x.note);

  const brief = await getVendorBrief({
    vendorName: v.name,
    urlSlug: slug,
    toolSlugs: v.tools.map((t) => t.slug),
  });

  const briefPick = (keys: string[], label?: string) => {
    const parts = keys
      .map((k) => ({ k, v: brief.sections[k] }))
      .filter((x): x is { k: string; v: string } => Boolean(x.v));
    if (!parts.length) return null;

    // Join multiple sections with H3 separators so it doesn't look like a document dump.
    const merged = parts
      .map((p) => {
        const title = label ? `${label}: ${p.k}` : p.k;
        return `### ${title}\n\n${p.v}`;
      })
      .join("\n\n");
    return merged;
  };

  const alternatives = await prisma.vendor.findMany({
    where: {
      id: { not: vendor.id },
      isActive: true,
      categories: vendor.categories.length ? { some: { id: { in: vendor.categories.map((c) => c.id) } } } : undefined,
    },
    orderBy: { verifiedInIndia: "desc" },
    take: 6,
    select: { id: true, name: true },
  });

  const compareHref = vendor.tools.length >= 2 ? `/compare?tools=${encodeURIComponent(vendor.tools.map((t) => t.slug).join(","))}` : null;

  // Fit scoring (heuristic: avoids false precision)
  const subScores = {
    india: vendor.verifiedInIndia ? 88 : 58,
    evidence: brief.urls.length ? 82 : 64,
    coverage: Math.min(88, 55 + toolCategories.length * 6),
    integrations: Math.min(88, 55 + Math.min(8, integrationNames.length) * 4),
  };
  const overallFit = Math.round((subScores.india + subScores.evidence + subScores.coverage + subScores.integrations) / 4);

  const displayTitle = slug === "freshteam" ? "Freshteam (Freshworks)" : vendor.name;
  const confusionLine =
    slug === "freshteam" ? "Not to be confused with Freshservice (HR service delivery workflows)." : null;
  const websiteUrl = slug === "freshteam" ? "https://www.freshworks.com/hrms/freshteam/" : vendor.websiteUrl;

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: vendor.name,
    applicationCategory: "Human Resources",
    operatingSystem: "Web",
    url: `https://hrsignal.vercel.app/vendors/${canon}`,
    description: profile?.overview ?? `Vendor profile for ${vendor.name}.`,
  };

  const faqJsonLd = profile?.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: profile.faqs.slice(0, 10).map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      {faqJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} /> : null}
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <div className="mb-6">
          <Link className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/vendors">
            ← Back to vendors
          </Link>
        </div>

        <Card className="border border-[var(--border)] bg-[var(--surface-1)] shadow-[var(--shadow-sm)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-2)] ring-1 ring-[var(--border)]">
                <VendorLogo
                  slug={slugify(vendor.name)}
                  name={vendor.name}
                  domain={domainFromUrl(vendor.websiteUrl)}
                  className="h-11 w-11 rounded-lg"
                  size={44}
                />
              </div>

              <div className="min-w-0">
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">{displayTitle}</h1>
                {confusionLine ? <div className="mt-2 text-sm text-[var(--text-muted)]">{confusionLine}</div> : null}
                {websiteUrl ? (
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    <a className="underline" href={websiteUrl} target="_blank" rel="noreferrer">
                      {websiteUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-muted)]">
              Published tools: <span className="font-semibold text-[var(--text)]">{vendor.tools.length}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Overall fit</div>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <div className="text-3xl font-extrabold tracking-tight text-[var(--text)]">{overallFit}</div>
                    <div className="text-xs font-semibold text-[var(--text-muted)]">/ 100</div>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-[rgba(255,255,255,0.08)]">
                    <div className="h-2 rounded-full bg-[var(--primary)]" style={{ width: `${overallFit}%` }} />
                  </div>
                </div>

                <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Sub-scores</div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <ScorePill label="India" value={subScores.india} />
                    <ScorePill label="Evidence" value={subScores.evidence} />
                    <ScorePill label="Coverage" value={subScores.coverage} />
                    <ScorePill label="Integrations" value={subScores.integrations} />
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
                <div className="text-sm font-semibold text-[var(--text)]">Decision snapshot</div>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Pros</div>
                    <ul className="mt-2 space-y-2 text-sm text-[var(--text-muted)]">
                      {(profile?.bestFor?.length ? profile.bestFor : pros).slice(0, 4).map((x, idx) => (
                        <li key={`${x}-${idx}`}>• {x}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Cons / risks</div>
                    <ul className="mt-2 space-y-2 text-sm text-[var(--text-muted)]">
                      {(profile?.notFor?.length ? profile.notFor : cons).slice(0, 4).map((x, idx) => (
                        <li key={`${x}-${idx}`}>• {x}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
                <div className="text-sm font-semibold text-[var(--text)]">Risk flags / What to validate before buying</div>
                <div className="mt-1 text-sm text-[var(--text-muted)]">
                  Focus your demo on statutory edge cases, audit readiness, and state complexity.
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  {[
                    {
                      title: "Multi-state statutory edge cases",
                      body: "Confirm PF/ESI/PT rules across your states (branch/registration mapping, exemptions, and register outputs).",
                    },
                    {
                      title: "Month-end controls (arrears/reversals/cutoffs)",
                      body: "Validate arrears, reversals, LOP retro changes, and payroll cutoffs with real scenarios and sample outputs.",
                    },
                    {
                      title: "Audit trail + approvals",
                      body: "Ask for evidence of role-based access, audit logs for payroll edits, and approval workflows for sensitive changes.",
                    },
                    {
                      title: "Exports + reconciliation",
                      body: "Verify statutory exports (challans/returns where applicable), accounting exports, and reconciliation workflow for corrections.",
                    },
                    {
                      title: "Integrations (API vs files)",
                      body: "Confirm how attendance/leave inputs and accounting outputs integrate (API/webhooks vs file exports vs manual).",
                    },
                    {
                      title: "Data residency + security scope",
                      body: "If required, confirm India data residency options and plan-tier availability for SSO/audit controls.",
                    },
                  ].slice(0, 6).map((x) => (
                    <div
                      key={x.title}
                      className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4"
                    >
                      <div className="text-sm font-semibold text-[var(--text)]">{x.title}</div>
                      <div className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{x.body}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)]">How this score is calculated</div>
                    <div className="mt-1 text-sm text-[var(--text-muted)]">
                      Weighted for India payroll context.
                    </div>
                  </div>
                  <span
                    className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--text-muted)]"
                    title="Weights are tuned for India payroll context and prioritize statutory edge cases and verification signals."
                    aria-label="About fit score weights"
                  >
                    ?
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <FitWeightRow label="India compliance" weight={30} />
                  <FitWeightRow label="Evidence depth" weight={20} />
                  <FitWeightRow label="Integration visibility" weight={15} />
                  <FitWeightRow label="Freshness" weight={10} />
                  <FitWeightRow label="Payroll edge-case readiness" weight={25} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <StickyCtas compareHref={compareHref} shortlistHref="/recommend" />

              <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4">
                <div className="text-sm font-semibold text-[var(--text)]">Comparison preview</div>
                <div className="mt-1 text-sm text-[var(--text-muted)]">Common alternatives evaluated alongside {vendor.name}.</div>
                <div className="mt-3 space-y-2">
                  {alternatives.slice(0, 5).map((a) => {
                    const altSlug = canonicalVendorSlug({ vendorName: a.name });
                    return (
                      <Link
                        key={a.id}
                        href={`/vendors/${altSlug}`}
                        className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2 text-sm"
                      >
                        <span className="truncate font-semibold text-[var(--text)]">{a.name}</span>
                        <span className="text-xs font-semibold text-[var(--text-muted)]">View →</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="text-sm font-semibold text-[var(--text)]">Overview</div>
            <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="border border-[var(--border)] bg-[var(--surface-2)] p-5 shadow-[var(--shadow-sm)] lg:col-span-2">
                {brief.exists ? (
                  <div>
                    <Markdownish
                      content={
                        brief.sections["overview"] ??
                        briefPick(["snapshot", "what it does feature summary", "best fit company size analyst view"], "Brief") ??
                        ""
                      }
                    />
                    {brief.updatedAt ? (
                      <div className="mt-4 text-xs font-medium text-[var(--text-muted)]">
                        Last updated: {brief.updatedAt.toISOString().slice(0, 10)}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-2 text-sm leading-relaxed text-[var(--text-muted)]">
                    {overviewLines.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-3">
                    <div className="text-[11px] font-semibold text-[var(--text-muted)]">Deployment</div>
                    <div className="mt-1 text-xs font-semibold text-[var(--text)]">{deploymentLabel()}</div>
                  </div>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-3">
                    <div className="text-[11px] font-semibold text-[var(--text-muted)]">Integrations</div>
                    <div className="mt-1 text-xs font-semibold text-[var(--text)]">
                      {integrationNames.length ? `${integrationNames.length}+ listed` : "—"}
                    </div>
                  </div>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-3">
                    <div className="text-[11px] font-semibold text-[var(--text-muted)]">Compliance</div>
                    <div className="mt-1 text-xs font-semibold text-[var(--text)]">
                      {complianceTags.length ? `${complianceTags.length}+ tags` : vendor.verifiedInIndia ? "India-first" : "—"}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs font-semibold text-[var(--text-muted)]">Categories</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(toolCategories.length ? toolCategories : vendor.categories.map((c) => c.name)).slice(0, 10).map((x) => (
                    <span key={x} className="rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]">
                      {x}
                    </span>
                  ))}
                  {toolCategories.length === 0 && vendor.categories.length === 0 ? (
                    <span className="text-xs text-[var(--text-muted)]">—</span>
                  ) : null}
                </div>
              </Card>

              <Card className="border border-[var(--border)] bg-[var(--surface-2)] p-5 shadow-[var(--shadow-sm)]">
                <div className="text-sm font-semibold text-[var(--text)]">Best for</div>
                <dl className="mt-3 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold text-[var(--text-muted)]">Company size</dt>
                    <dd className="mt-1 text-[var(--text-muted)]">{bestForSizes ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-[var(--text-muted)]">India coverage</dt>
                    <dd className="mt-1 text-[var(--text-muted)]">
                      {vendor.verifiedInIndia ? "India-first listing" : "—"}
                      {vendor.multiStateSupport ? " • Multi-state" : ""}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-[var(--text-muted)]">States</dt>
                    <dd className="mt-1 text-[var(--text-muted)]">{bestForStates ?? "—"}</dd>
                  </div>
                </dl>
              </Card>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-[var(--border)]">
            <div className="text-sm font-semibold text-[var(--text)]">Key modules / features</div>
            <Card className="mt-3 border border-[var(--border)] bg-[var(--surface-2)] p-5 shadow-[var(--shadow-sm)]">
              {brief.exists ? (
                <Markdownish
                  content={
                    brief.sections["products tools"] ??
                    brief.sections["what it does feature summary"] ??
                    briefPick(["recruiting ats", "onboarding", "employee directory records", "time off leave"], "Features") ??
                    ""
                  }
                />
              ) : (
                <>
                  <ul className="grid grid-cols-1 gap-2 text-sm text-[var(--text-muted)] sm:grid-cols-2">
                    {modules.map((x, idx) => (
                      <li key={`${x}-${idx}`}>• {x}</li>
                    ))}
                  </ul>
                  {!vendor.tools.length ? (
                    <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-4">
                      <div className="text-xs font-semibold text-[var(--text)]">Buyer checklist (until info is verified)</div>
                      <ul className="mt-2 space-y-2 text-sm text-[var(--text-muted)]">
                        {qa.map((q, idx) => (
                          <li key={`${q}-${idx}`}>• {q}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </>
              )}
            </Card>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Best for</div>
              <Card className="mt-3 border border-[var(--border)] bg-[var(--surface-2)] p-5 shadow-none">
                <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                  {(profile?.bestFor?.length ? profile.bestFor : pros).slice(0, 10).map((x, idx) => (
                    <li key={`${x}-${idx}`}>• {x}</li>
                  ))}
                </ul>
              </Card>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Not for</div>
              <Card className="mt-3 border border-[var(--border)] bg-[var(--surface-2)] p-5 shadow-none">
                <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                  {(profile?.notFor?.length ? profile.notFor : cons).slice(0, 10).map((x, idx) => (
                    <li key={`${x}-${idx}`}>• {x}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-[var(--border)]">
            <div className="text-sm font-semibold text-[var(--text)]">Pricing</div>
            <Card className="mt-3 border border-[var(--border)] bg-[var(--surface-2)] p-5 shadow-[var(--shadow-sm)]">
              {brief.exists && (brief.sections["pricing"] || brief.sections["pricing model"]) ? (
                <Markdownish content={brief.sections["pricing"] ?? brief.sections["pricing model"]} />
              ) : pricingNotes.length ? (
                <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                  {pricingNotes.slice(0, 6).map((p) => (
                    <li key={`${p.tool}-${p.name}`} className="flex flex-wrap items-center gap-2">
                      <span>• {p.tool} — {p.name}:</span>
                      <span className="rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-2 py-0.5 text-xs font-semibold text-[var(--text-muted)]">{p.type}</span>
                      <span>{p.note}</span>
                    </li>
                  ))}
                </ul>
              ) : brief.exists && brief.sections["pricing model"] ? (
                <Markdownish content={brief.sections["pricing model"]} />
              ) : (
                <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)]">
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-2 py-0.5 text-xs font-semibold text-[var(--text-muted)]">
                    Quote-based
                  </span>
                  <span>Contact vendor / request quote.</span>
                </div>
              )}
            </Card>
          </div>

          <div className="mt-10 pt-8 border-t border-[var(--border)] grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Integrations</div>
              <Card className="mt-3 border border-[var(--border)] bg-[var(--surface-2)] p-5 shadow-[var(--shadow-sm)]">
                {brief.exists && brief.sections["integrations"] ? (
                  <Markdownish content={brief.sections["integrations"]} />
                ) : integrationNames.length ? (
                  <div className="flex flex-wrap gap-2">
                    {integrationNames.slice(0, 14).map((n) => (
                      <span key={n} className="rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]">
                        {n}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="text-xs font-semibold text-[var(--text)]">Missing info (we’re verifying)</div>
                    <ul className="mt-2 space-y-2 text-sm text-[var(--text-muted)]">
                      <li>• Current integration list (HRIS/payroll/ATS/accounting)</li>
                      <li>• Exports (CSV, Tally/Books, bank files) and API availability</li>
                      <li>• SSO/SCIM/webhooks (plan-dependent)</li>
                    </ul>
                  </div>
                )}
              </Card>
            </div>

            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Implementation / onboarding</div>
              <Card className="mt-3 border border-[var(--border)] bg-[var(--surface-2)] p-5 shadow-[var(--shadow-sm)]">
                {brief.exists && (brief.sections["implementation onboarding"] || brief.sections["deployment and implementation"] || brief.sections["deployment implementation"]) ? (
                  <Markdownish
                    content={
                      brief.sections["implementation onboarding"] ??
                      brief.sections["deployment and implementation"] ??
                      brief.sections["deployment implementation"] ??
                      ""
                    }
                  />
                ) : (
                  <div className="text-sm leading-relaxed text-[var(--text-muted)]">
                    {vendor.tools.length ? (
                      <>
                        Implementation usually depends on modules and policy complexity. For {vendor.name}, validate:
                        <ul className="mt-3 space-y-2">
                          <li>• Data migration scope (employee masters, org, leave balances, salary structures)</li>
                          <li>• Policy setup (shifts, leave, payroll cycles) and approvals</li>
                          <li>• Parallel run + month-end checklist (especially for payroll/compliance)</li>
                          <li>• Admin training + post–go-live support cadence</li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <div className="text-xs font-semibold text-[var(--text)]">Missing info (we’re verifying)</div>
                        <ul className="mt-2 space-y-2">
                          {qa.slice(0, 4).map((q, idx) => (
                            <li key={`${q}-${idx}`}>• {q}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </Card>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-[var(--border)] grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Compliance & security</div>
              <Card className="mt-3 border border-[var(--border)] bg-[var(--surface-2)] p-5 shadow-[var(--shadow-sm)]">
                {brief.exists && (brief.sections["compliance and security"] || brief.sections["compliance security"] || brief.sections["compliance, security, and privacy"] || brief.sections["compliance"] || brief.sections["india first context"]) ? (
                  <Markdownish
                    content={
                      brief.sections["compliance and security"] ??
                      brief.sections["compliance security"] ??
                      brief.sections["compliance, security, and privacy"] ??
                      brief.sections["compliance"] ??
                      brief.sections["india first context"] ??
                      ""
                    }
                  />
                ) : complianceTags.length ? (
                  <div>
                    <div className="text-sm text-[var(--text-muted)]">Compliance tags seen on published tools:</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {complianceTags.map((t) => (
                        <span key={t} className="rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-xs font-semibold text-[var(--text)]">Missing info (we’re verifying)</div>
                    <ul className="mt-2 space-y-2 text-sm text-[var(--text-muted)]">
                      <li>• India compliance scope (PF/ESI/PT/TDS/LWF) and statutory registers</li>
                      <li>• Audit trails, role-based access, data retention</li>
                      <li>• Security controls (SSO, backups, incident response)</li>
                    </ul>
                  </div>
                )}
              </Card>
            </div>

            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Alternatives</div>
              <Card className="mt-3 border border-[var(--border)] bg-[var(--surface-2)] p-5 shadow-[var(--shadow-sm)]">
                {alternatives.length ? (
                  <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                    {alternatives.slice(0, 6).map((a) => (
                      <li key={a.id}>
                        • <Link
                          className="text-violet-300 underline decoration-[rgba(255,255,255,0.18)] underline-offset-4 hover:text-violet-200 hover:decoration-[rgba(255,255,255,0.32)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(139,92,246,0.25)] visited:text-violet-300"
                          href={`/vendors/${slugify(a.name)}`}
                        >
                          {a.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>
                    <div className="text-xs font-semibold text-[var(--text)]">Missing info (we’re verifying)</div>
                    <ul className="mt-2 space-y-2 text-sm text-[var(--text-muted)]">
                      <li>• Category-based alternatives for this vendor</li>
                      <li>• India-first shortlists for similar workflows</li>
                    </ul>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                  {vendor.tools.length >= 2 ? (
                    <Link
                      className="font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]"
                      href={`/compare?tools=${encodeURIComponent(vendor.tools.map((t) => t.slug).join(","))}`}
                    >
                      Compare {vendor.name} tools →
                    </Link>
                  ) : null}
                  <Link className="font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/tools">
                    Browse tools →
                  </Link>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-[var(--border)]">
            <div className="text-sm font-semibold text-[var(--text)]">Evidence links</div>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Primary sources to validate pricing, docs, security, and support.</p>
            <div className="mt-3">
              <EvidenceLinks
                links={
                  (profile?.evidence ?? []).length
                    ? (profile?.evidence ?? [])
                    : brief.urls.slice(0, 8).map((u) => ({ kind: "Other", label: "Source", url: u }))
                }
              />
            </div>

            <Card className="mt-4 border border-[var(--border)] bg-[var(--surface-2)] p-5 shadow-none">
              <details>
                <summary className="cursor-pointer select-none text-sm font-semibold text-[var(--text)]">
                  Sources checked & info pending
                </summary>
                <div className="mt-4 grid grid-cols-1 gap-6 text-sm text-[var(--text-muted)] lg:grid-cols-2">
                  <div>
                    <div className="text-xs font-semibold text-[var(--text)]">Sources checked</div>
                    {brief.urls.length ? (
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {brief.urls.slice(0, 10).map((u) => (
                          <li key={u}>
                            <a className="underline" href={u} target="_blank" rel="noreferrer">
                              {u}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="mt-2">Info pending.</div>
                    )}
                    {brief.updatedAt ? (
                      <div className="mt-3 text-xs font-medium text-[var(--text-muted)]">
                        Last checked: {brief.updatedAt.toISOString().slice(0, 10)}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[var(--text)]">Data gaps / Info pending</div>
                    {brief.dataGaps.length ? (
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {brief.dataGaps.slice(0, 10).map((g) => (
                          <li key={g}>{g}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="mt-2">No explicit gaps listed.</div>
                    )}
                  </div>
                </div>
              </details>
            </Card>
          </div>

          <div className="mt-10 pt-8 border-t border-[var(--border)]">
            <div className="text-sm font-semibold text-[var(--text)]">Tools</div>
            {vendor.tools.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--text-muted)]">No published tools for this vendor yet.</p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {vendor.tools.map((t) => (
                  <Link key={t.id} href={`/tools/${t.slug}`} className="block">
                    <Card className="h-full border border-[var(--border)] bg-[var(--surface-2)] shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.14)] hover:shadow-[var(--shadow-md)]">
                      <div className="text-base font-semibold text-[var(--text)]">{t.name}</div>
                      {t.tagline ? <div className="mt-1 text-sm text-[var(--text-muted)]">{t.tagline}</div> : null}
                      <div className="mt-3 text-sm text-[var(--text-muted)]">
                        {t.categories.map((c) => c.category.name).join(" • ")}
                      </div>
                      <div className="mt-4 text-sm font-medium text-[var(--primary)]">View tool →</div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Card>
      </Section>

      <SiteFooter />
    </div>
  );
}
