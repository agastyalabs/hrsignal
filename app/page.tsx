export const dynamic = "force-dynamic";

import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { VendorLogoStrip } from "@/components/marketing/VendorLogoStrip";
import { TestimonialStrip } from "@/components/marketing/TestimonialStrip";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { ToolCard, type ToolCardModel } from "@/components/catalog/ToolCard";
import { prisma } from "@/lib/db";

const CATEGORIES = [
  {
    slug: "hrms",
    name: "Core HRMS",
    description: "Employee lifecycle, org, docs, workflows",
    indiaReady: false,
  },
  {
    slug: "payroll",
    name: "Payroll + Compliance",
    description: "India-first PF/ESI/PT/TDS fit",
    indiaReady: true,
  },
  {
    slug: "attendance",
    name: "Attendance/Leave/Time",
    description: "Shifts, biometric, field staff",
    indiaReady: true,
  },
  {
    slug: "ats",
    name: "ATS / Hiring",
    description: "Pipeline, interviews, offers",
    indiaReady: false,
  },
  {
    slug: "performance",
    name: "Performance/OKR",
    description: "Reviews, goals, feedback",
    indiaReady: false,
  },
] as const;

export default async function Home() {
  const trending = await getTrendingTools();

  return (
    <div className="min-h-screen bg-[#0B1220]">
      <SiteHeader />

      {/* Hero */}
      <Section className="pt-10 sm:pt-14">
        <div className="relative overflow-hidden rounded-3xl border border-[#1F2937] bg-[#111827] shadow-sm">
          {/* Background wash (subtle) */}
          <div className="pointer-events-none absolute -top-28 right-[-140px] h-[420px] w-[420px] rounded-full bg-[#8B5CF6]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-[-140px] h-[420px] w-[420px] rounded-full bg-[#0F172A] blur-3xl" />

          <div className="grid grid-cols-1 gap-10 p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-xs font-semibold text-[#CBD5E1]">
                Built for Indian SMEs • HR-only directory
              </div>

              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-[#F9FAFB] sm:text-5xl">
                Stop guessing HR software.
              </h1>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#8B5CF6] sm:text-3xl">
                Get a shortlist that actually fits your team.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#CBD5E1]">
                HRSignal helps Indian SMEs compare HRMS, payroll, compliance, attendance, ATS and performance tools — with clear match reasons,
                not sales fluff.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href="/recommend" size="lg" variant="primary">
                  Get Recommendations
                </ButtonLink>
                <ButtonLink href="/categories" size="lg" variant="secondary">
                  Browse Categories
                </ButtonLink>
              </div>

              <div className="mt-4 text-sm font-medium text-[var(--text-muted)]">
                200+ India-ready tools · Verified vendors · Privacy-first
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/tools?category=${encodeURIComponent(c.slug)}`}
                    className="rounded-full border border-[#1F2937] bg-[#111827] px-3 py-1 text-sm text-[#CBD5E1] transition-all duration-200 hover:bg-[#0F172A] hover:text-[#F9FAFB] hover:border-[#334155] hover:shadow-sm motion-reduce:transition-none"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>

              {/* Proof bar */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 shadow-sm">
                  <div className="text-sm font-semibold text-[var(--text)]">Built for Indian SMEs</div>
                  <div className="mt-1 text-sm text-[var(--text-muted)]">Shortlists that fit India payroll + ops realities.</div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 shadow-sm">
                  <div className="text-sm font-semibold text-[var(--text)]">Verified listings</div>
                  <div className="mt-1 text-sm text-[var(--text-muted)]">Clear metadata, compliance tags, deployment info.</div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 shadow-sm">
                  <div className="text-sm font-semibold text-[var(--text)]">Privacy-first</div>
                  <div className="mt-1 text-sm text-[var(--text-muted)]">We don’t share details without consent.</div>
                </div>
              </div>
            </div>

            {/* Right visual + search */}
            <div>
              <div className="rounded-2xl border border-[#1F2937] bg-[#0F172A] p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-[#F9FAFB]">Search tools</div>
                    <div className="mt-1 text-sm text-[#CBD5E1]">Start with a vendor, category, or use-case.</div>
                  </div>

                  {/* Inline SVG illustration (no external asset dependency) */}
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="opacity-90"
                  >
                    <rect x="8" y="10" width="40" height="36" rx="12" fill="#E0E7FF" />
                    <rect x="16" y="19" width="24" height="6" rx="3" fill="#4F46E5" opacity="0.85" />
                    <rect x="16" y="29" width="18" height="5" rx="2.5" fill="#111827" opacity="0.25" />
                    <circle cx="40" cy="33" r="6" fill="#F5F3FF" />
                    <path
                      d="M41.8 35.8L45 39"
                      stroke="#4F46E5"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="mt-4 rounded-xl border border-[#1F2937] bg-[#111827] p-4">
                  <div className="text-sm font-medium text-[#CBD5E1]">
                    Use the search bar in the header to find tools, vendors, and categories.
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs font-medium text-[#94A3B8]">Popular categories</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/tools?category=${encodeURIComponent(c.slug)}`}
                        className="rounded-full border border-[#1F2937] bg-[#111827] px-3 py-1 text-sm text-[#CBD5E1] transition-all duration-200 hover:bg-[#0F172A] hover:text-[#F9FAFB] hover:border-[#334155] hover:shadow-sm motion-reduce:transition-none"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { k: "Listings", v: "200+" },
                    { k: "SME focus", v: "India" },
                    { k: "Method", v: "Explainable" },
                  ].map((m) => (
                    <div key={m.k} className="rounded-xl border border-[#1F2937] bg-[#111827] p-3 shadow-sm">
                      <div className="text-xs font-medium text-[#94A3B8]">{m.k}</div>
                      <div className="mt-1 text-sm font-semibold text-[#F9FAFB]">{m.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <TrustStrip />
          <VendorLogoStrip title="Popular vendors" subtitle="Recognizable India-first HR tools — more logos added continuously." />
        </div>
      </Section>

      {/* Categories */}
      <Section>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            title="Browse by category"
            subtitle="Start with the module you need. We keep categories simple in v1 so browsing stays fast."
          />
          <Link className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]" href="/tools">
            View all tools →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <CategoryCard
              key={c.slug}
              slug={c.slug}
              name={c.name}
              description={c.description}
              indiaReady={c.indiaReady}
            />
          ))}
        </div>
      </Section>

      {/* Trending */}
      <Section className="bg-transparent">
        <SectionHeading title="Trending tools" subtitle="Quick picks to start your shortlist." />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section>
        <SectionHeading
          title="How HRSignal helps"
          subtitle="A simple workflow: discover, shortlist with reasons, and request demos/quotes when you’re ready."
        />
        <div className="mt-6">
          <FeatureGrid
            features={[
              {
                title: "Pick a category",
                description: "Browse HRMS, payroll & compliance, attendance, ATS, or performance tools.",
              },
              {
                title: "Get recommendations",
                description: "Answer a short questionnaire and get 3–5 matches with explainable reasons.",
              },
              {
                title: "Request demos/quotes",
                description: "Share requirements once. We route your request to a best-fit vendor after review.",
              },
              {
                title: "Stay in control",
                description: "Privacy-first by default. No spammy blast to multiple vendors.",
              },
            ]}
          />
        </div>
      </Section>

      {/* Social proof */}
      <Section className="bg-transparent">
        <SectionHeading title="Built for India-first SMEs" subtitle="Practical, explainable shortlists—built to reduce vendor spam." />

        <div className="mt-6">
          <TestimonialStrip />
        </div>

        <div className="mt-10 rounded-2xl border border-[#1F2937] bg-[#0F172A] p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-xl font-semibold text-[#F9FAFB]">Ready for a guided shortlist?</div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#CBD5E1]">
                Get explainable recommendations based on company size, modules, integrations, and compliance needs.
              </p>
            </div>
            <ButtonLink href="/recommend" size="lg">
              Get recommendations
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section>
        <SectionHeading
          title="Pricing"
          subtitle="Free while we’re in early access. We’ll add a paid plan once benchmarks + advanced insights land."
        />

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 shadow-sm">
            <div className="text-sm font-semibold text-[#F9FAFB]">Starter</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">Free</div>
            <p className="mt-2 text-sm text-[#CBD5E1]">Get recommendations + shortlist with reasons.</p>
            <ul className="mt-4 space-y-2 text-sm text-[#CBD5E1]">
              <li>• 3–5 recommendations</li>
              <li>• Explainable match reasons</li>
              <li>• Request pricing/vendor intro</li>
            </ul>
            <div className="mt-5">
              <ButtonLink href="/recommend" size="lg" className="w-full justify-center">
                Get started
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--primary)]/30 bg-[#0F172A] p-6 shadow-sm">
            <div className="text-sm font-semibold text-[#F9FAFB]">Teams</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-[#F9FAFB]">Early access</div>
            <p className="mt-2 text-sm text-[#CBD5E1]">We’ll set this up with you (white-glove).</p>
            <ul className="mt-4 space-y-2 text-sm text-[#CBD5E1]">
              <li>• Custom filters (states, compliance, integrations)</li>
              <li>• Vendor screening and intro</li>
              <li>• Priority support</li>
            </ul>
            <div className="mt-5">
              <ButtonLink href="/recommend" size="lg" variant="primary" className="w-full justify-center">
                Request early access
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 shadow-sm">
            <div className="text-sm font-semibold text-[#F9FAFB]">Enterprise</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">Talk to us</div>
            <p className="mt-2 text-sm text-[#CBD5E1]">For larger teams and multi-entity compliance needs.</p>
            <ul className="mt-4 space-y-2 text-sm text-[#CBD5E1]">
              <li>• Custom scoring rules</li>
              <li>• Assisted evaluation</li>
              <li>• SLA + reporting</li>
            </ul>
            <div className="mt-5">
              <ButtonLink href="/recommend" size="lg" variant="secondary" className="w-full justify-center">
                Contact sales
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQs */}
      <Section className="bg-transparent">
        <SectionHeading title="FAQs" subtitle="Straight answers so you can move fast." />
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[
            {
              q: "Do you share my details with multiple vendors?",
              a: "No. We only share your requirement with one best-fit vendor after review.",
            },
            {
              q: "Is this only for India?",
              a: "The catalog is India-first (PF/ESI/PT, state coverage), but you can still browse globally.",
            },
            {
              q: "How are recommendations generated?",
              a: "We score tools by category coverage, size fit, and required integrations. You can see why each tool fits.",
            },
            {
              q: "What if my requirements are unique?",
              a: "Add details in the note and we’ll refine the shortlist manually before making an intro.",
            },
          ].map((f) => (
            <div key={f.q} className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 shadow-sm">
              <div className="text-sm font-semibold text-[#F9FAFB]">{f.q}</div>
              <div className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">{f.a}</div>
            </div>
          ))}
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}

async function getTrendingTools(): Promise<ToolCardModel[]> {
  const fallback: ToolCardModel[] = [
    { slug: "keka", name: "Keka", vendorName: "Keka", tagline: "Modern HRMS with payroll", categories: ["HRMS", "Payroll"] },
    {
      slug: "greythr",
      name: "greytHR",
      vendorName: "greytHR",
      tagline: "HRMS + payroll for Indian SMEs",
      categories: ["HRMS", "Payroll"],
    },
    {
      slug: "zoho-people",
      name: "Zoho People",
      vendorName: "Zoho",
      tagline: "HRMS with attendance/leave",
      categories: ["HRMS", "Attendance"],
    },
  ];

  if (!process.env.DATABASE_URL) return fallback;

  try {
    const rows = await prisma.tool.findMany({
      where: {
        status: "PUBLISHED",
        vendor: { registeredCountry: "IN", verifiedInIndia: true },
      },
      orderBy: { lastVerifiedAt: "desc" },
      include: { vendor: true, categories: { include: { category: true } } },
      take: 6,
    });

    return rows.map((t) => ({
      slug: t.slug,
      name: t.name,
      vendorName: t.vendor?.name ?? undefined,
      tagline: t.tagline ?? undefined,
      categories: t.categories.map((c) => c.category.name),
      verified: Boolean(t.lastVerifiedAt),
    }));
  } catch {
    return fallback;
  }
}
