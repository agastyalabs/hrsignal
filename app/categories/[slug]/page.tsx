export const dynamic = "force-dynamic";
export const dynamicParams = true;

import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { ToolCard, type ToolCardModel } from "@/components/catalog/ToolCard";

import toolsSeed from "@/data/tools_seed.json";

const FALLBACK: Record<string, { name: string; desc: string; criteria: string[]; pitfalls: string[] }> = {
  hrms: {
    name: "HRMS / Core HR",
    desc: "Employee lifecycle, org, docs, workflows",
    criteria: ["Employee master + RBAC", "Approvals & audit trail", "Exports + reporting", "Onboarding docs"],
    pitfalls: ["Underestimating data migration", "Ignoring multi-location policy needs", "No clear support SLA"],
  },
  payroll: {
    name: "Payroll & Compliance",
    desc: "PF/ESI/PT/TDS workflows and filings",
    criteria: ["State-wise PF/ESI/PT", "Arrears + reversals", "Statutory reports", "Month-end reconciliation"],
    pitfalls: ["No parallel run plan", "Weak audit trail", "Missing edge-case handling"],
  },
  ats: {
    name: "Recruitment / ATS",
    desc: "Pipeline, interviews, offers",
    criteria: ["Pipeline stages + scorecards", "Email/calendar sync", "Offer approvals", "Reporting (TAT/source)"],
    pitfalls: ["Too many stages; low adoption", "No stakeholder visibility", "Poor integration plan"],
  },
  attendance: {
    name: "Time & Attendance",
    desc: "Shifts, leave, overtime, device sync",
    criteria: ["Shift rules + overtime", "Missed punch flows", "Device/offline handling", "Policy flexibility"],
    pitfalls: ["Hard-coded policies", "No field staff support", "Weak exception workflows"],
  },
  performance: {
    name: "Performance / OKRs",
    desc: "Goals, check-ins, reviews",
    criteria: ["Goals + check-ins", "Manager UX + nudges", "Templates", "Analytics"],
    pitfalls: ["Overly complex cycles", "Low manager adoption", "No calibration readiness"],
  },
  bgv: {
    name: "Background Verification (BGV)",
    desc: "Employee checks and screening",
    criteria: ["Turnaround time", "Coverage + sources", "Consent + audit trail", "Exports/API"],
    pitfalls: ["Unclear data handling", "No SLA", "Weak dispute workflow"],
  },
  lms: {
    name: "LMS / Training",
    desc: "Learning, compliance, onboarding",
    criteria: ["Content formats", "Tracking + reports", "SSO", "Mobile learning"],
    pitfalls: ["No adoption plan", "Hard-to-export data", "Weak admin UX"],
  },
};

function pickCategoryMeta(slug: string) {
  return FALLBACK[slug] ?? { name: slug, desc: "", criteria: [], pitfalls: [] };
}

function slugify(name: string) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let title = pickCategoryMeta(slug).name;
  let desc = pickCategoryMeta(slug).desc;

  if (process.env.DATABASE_URL) {
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (cat) {
      title = cat.name;
      desc = desc || "Browse top tools and evaluation guidance.";
    }
  }

  // Top tools: try DB first, fallback to seed.
  let tools: ToolCardModel[] = [];

  if (process.env.DATABASE_URL) {
    try {
      const rows = await prisma.tool.findMany({
        where: {
          status: "PUBLISHED",
          categories: { some: { category: { slug } } },
        },
        include: {
          vendor: true,
          categories: { include: { category: true } },
        },
        orderBy: { lastVerifiedAt: "desc" },
        take: 6,
      });

      tools = rows.map((t) => ({
        slug: t.slug,
        name: t.name,
        vendorName: t.vendor?.name ?? undefined,
        vendorWebsiteUrl: t.vendor?.websiteUrl ?? undefined,
        vendorSlug: t.vendor ? slugify(t.vendor.name) : undefined,
        categories: t.categories.map((c) => c.category.name),
        tagline: t.tagline ?? undefined,
        verified: Boolean(t.lastVerifiedAt),
        lastCheckedAt: t.lastVerifiedAt ? t.lastVerifiedAt.toISOString() : null,
      }));
    } catch {
      tools = [];
    }
  }

  if (!tools.length) {
    const seeded = (toolsSeed as Array<Record<string, unknown>>)
      .filter((t) => {
        const rec = t as Record<string, unknown>;
        const cats = Array.isArray(rec.categories) ? (rec.categories as unknown[]) : [];
        return cats.map(String).includes(slug);
      })
      .slice(0, 6);

    tools = seeded.map((t) => {
      const rec = t as Record<string, unknown>;
      const cats = Array.isArray(rec.categories) ? (rec.categories as unknown[]).map(String) : [];
      return {
        slug: String(rec.slug ?? slugify(String(rec.name ?? "tool"))),
        name: String(rec.name ?? ""),
        vendorName: rec.vendor_name ? String(rec.vendor_name) : undefined,
        vendorSlug: rec.vendor_name ? slugify(String(rec.vendor_name)) : undefined,
        categories: cats.map((c) => c.toUpperCase()),
        tagline: rec.short_description ? String(rec.short_description) : undefined,
        verified: Boolean(rec.last_verified_at),
      };
    });
  }

  if (!desc && !FALLBACK[slug] && !tools.length) return notFound();

  const meta = pickCategoryMeta(slug);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading title={title} subtitle={desc} />
          <Link
            className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]"
            href={`/tools?category=${encodeURIComponent(slug)}`}
          >
            Browse tools →
          </Link>
        </div>

        <div className="mt-8">
          <div className="text-sm font-semibold text-[var(--text)]">Top tools</div>
          {tools.length ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          ) : (
            <Card className="mt-4 p-6">
              <div className="text-sm font-semibold text-[var(--text)]">No tools yet</div>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                We don’t have verified listings for this category yet. Try browsing all tools or request recommendations.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/tools">
                  Browse all tools →
                </Link>
                <Link className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/recommend">
                  Get recommendations →
                </Link>
              </div>
            </Card>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="p-6">
            <div className="text-sm font-semibold text-[var(--text)]">Key evaluation criteria</div>
            <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
              {(meta.criteria.length
                ? meta.criteria
                : ["Demo the core workflow end-to-end", "Confirm pricing unit + minimums", "Validate exports/integrations"]
              ).map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-semibold text-[var(--text)]">Common pitfalls</div>
            <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
              {(meta.pitfalls.length
                ? meta.pitfalls
                : ["Buying before requirements are clear", "Skipping a parallel run", "Not checking data portability"]
              ).map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
