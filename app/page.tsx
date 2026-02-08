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
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />

      {/* Hero (bento) */}
      <Section className="pt-10 sm:pt-14">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-1)] shadow-[var(--shadow-sm)]">
          {/* Signal motif: layered gradients + waveform */}
          <div className="pointer-events-none absolute inset-0 opacity-90">
            <div className="absolute -top-40 right-[-160px] h-[520px] w-[520px] rounded-full bg-[color:var(--primary)]/18 blur-3xl" />
            <div className="absolute -bottom-44 left-[-180px] h-[560px] w-[560px] rounded-full bg-[#2DD4BF]/10 blur-3xl" />
            <svg
              aria-hidden="true"
              className="absolute -right-24 top-10 h-[340px] w-[640px] opacity-[0.18]"
              viewBox="0 0 640 340"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 210 C 80 120, 160 300, 240 210 C 320 120, 400 300, 480 210 C 560 120, 600 190, 640 160"
                stroke="#6F42C1"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M0 250 C 90 160, 170 330, 250 250 C 330 170, 410 330, 490 250 C 570 170, 610 240, 640 210"
                stroke="#27D3BC"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          </div>

          <div className="relative grid grid-cols-1 gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:gap-10">
            {/* Left */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[#CBD5E1]">
                India-first HR software discovery
                <span className="h-1 w-1 rounded-full bg-[#334155]" />
                Explainable shortlists
              </div>

              <h1 className="mt-5 text-[length:var(--h1-size)] font-semibold leading-[1.08] tracking-tight text-[#F9FAFB]">
                Discover the right HR tools for your Indian SME.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#CBD5E1]">
                HRSignal helps Indian SMEs shortlist HRMS, payroll & compliance, attendance, ATS and performance tools—with clear match reasons.
              </p>

              <div className="mt-6 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {["Export-ready reporting", "RBAC + audit trail", "Month-end reality checks", "No vendor spam by default"].map((x) => (
                  <div
                    key={x}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm font-medium text-[#CBD5E1]"
                  >
                    {x}
                  </div>
                ))}
              </div>

              <div className="mt-6 text-sm font-medium text-[#94A3B8]">
                200+ directory listings • Deterministic recommendations • Privacy-first
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/tools?category=${encodeURIComponent(c.slug)}`}
                    className="rounded-full border border-[#1F2937] bg-[var(--surface-2)] px-3 py-1 text-sm text-[#CBD5E1] transition-all duration-200 hover:border-[#334155] hover:bg-[#111827] hover:text-[#F9FAFB]"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="lg:col-span-5">
              {/* HR illustration (inline SVG placeholder, no external deps) */}
              <div className="relative mb-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-5 shadow-[var(--shadow-sm)]">
                <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[color:var(--primary)]/14 blur-3xl" />
                <div className="absolute -left-24 -bottom-24 h-56 w-56 rounded-full bg-[color:var(--accent)]/14 blur-3xl" />

                <div className="relative">
                  <div className="text-xs font-semibold tracking-wide text-[var(--text-muted)]">VISUAL</div>
                  <div className="mt-1 text-sm font-semibold text-[var(--text)]">Shortlist clarity, without the noise</div>

                  <svg
                    aria-label="HRSignal illustration"
                    role="img"
                    viewBox="0 0 680 260"
                    className="mt-4 h-[180px] w-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stop-color="#6F42C1" stop-opacity="0.55"/>
                        <stop offset="1" stop-color="#27D3BC" stop-opacity="0.35"/>
                      </linearGradient>
                    </defs>

                    <rect x="0" y="0" width="680" height="260" rx="22" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)"/>

                    <path d="M40 170 C 110 70, 200 230, 270 150 C 340 70, 430 240, 500 160 C 570 90, 620 130, 650 110" fill="none" stroke="url(#g)" stroke-width="4" stroke-linecap="round"/>
                    <path d="M40 200 C 120 115, 210 250, 290 185 C 370 120, 450 260, 530 190 C 600 135, 630 165, 650 150" fill="none" stroke="#27D3BC" stroke-opacity="0.35" stroke-width="3" stroke-linecap="round"/>

                    <g transform="translate(70 55)">
                      <rect x="0" y="0" width="220" height="150" rx="18" fill="rgba(13,22,63,0.55)" stroke="rgba(255,255,255,0.10)"/>
                      <rect x="18" y="20" width="120" height="14" rx="7" fill="rgba(255,255,255,0.80)"/>
                      <rect x="18" y="48" width="170" height="10" rx="5" fill="rgba(255,255,255,0.35)"/>
                      <rect x="18" y="68" width="150" height="10" rx="5" fill="rgba(255,255,255,0.28)"/>
                      <rect x="18" y="98" width="110" height="28" rx="14" fill="#6F42C1" opacity="0.9"/>
                    </g>

                    <g transform="translate(330 78)">
                      <rect x="0" y="0" width="280" height="128" rx="18" fill="rgba(13,22,63,0.55)" stroke="rgba(255,255,255,0.10)"/>
                      <circle cx="44" cy="44" r="22" fill="rgba(255,255,255,0.18)"/>
                      <rect x="80" y="26" width="170" height="12" rx="6" fill="rgba(255,255,255,0.55)"/>
                      <rect x="80" y="50" width="210" height="10" rx="5" fill="rgba(255,255,255,0.28)"/>
                      <rect x="24" y="82" width="120" height="24" rx="12" fill="#27D3BC" opacity="0.9"/>
                      <rect x="154" y="82" width="110" height="24" rx="12" fill="rgba(255,255,255,0.12)"/>
                    </g>
                  </svg>
                </div>
              </div>


              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
                <div className="text-sm font-semibold text-[#F9FAFB]">Get your shortlist</div>
                <p className="mt-1 text-sm text-[#CBD5E1]">
                  Choose a fast path or go deeper for more tailored match reasons.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-3">
                  <div className="rounded-2xl border border-[#1F2937] bg-[#0F172A] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-[#F9FAFB]">Get Quick Recommendation</div>
                        <div className="mt-1 text-xs leading-relaxed text-[#94A3B8]">
                          2–3 minutes. Ideal if you want a starting shortlist.
                        </div>
                      </div>
                      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-semibold text-[#CBD5E1]">
                        Quick
                      </div>
                    </div>
                    <div className="mt-4">
                      <ButtonLink href="/recommend?mode=quick" variant="primary" size="md" className="w-full justify-center">
                        Start quick →
                      </ButtonLink>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#1F2937] bg-[#0F172A] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-[#F9FAFB]">Start Detailed Recommendation</div>
                        <div className="mt-1 text-xs leading-relaxed text-[#94A3B8]">
                          6–10 minutes. Better if compliance, integrations, or rollout complexity matters.
                        </div>
                      </div>
                      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-semibold text-[#CBD5E1]">
                        Detailed
                      </div>
                    </div>
                    <div className="mt-4">
                      <ButtonLink href="/recommend?mode=detailed" variant="secondary" size="md" className="w-full justify-center">
                        Start detailed →
                      </ButtonLink>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-[#1F2937] bg-[var(--surface-2)] p-4">
                  <div className="text-xs font-semibold text-[#F9FAFB]">Pro tip</div>
                  <div className="mt-1 text-xs leading-relaxed text-[#94A3B8]">
                    If you already have 2–3 tools in mind, add them to Compare and evaluate exports, workflows, and month-end reliability.
                  </div>
                  <div className="mt-3">
                    <ButtonLink href="/tools" variant="tertiary" size="sm" className="w-full justify-center">
                      Browse tools →
                    </ButtonLink>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { k: "Listings", v: "200+" },
                  { k: "Mode", v: "Explainable" },
                  { k: "Fit", v: "India-first" },
                ].map((m) => (
                  <div
                    key={m.k}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-center shadow-[var(--shadow-sm)]"
                  >
                    <div className="text-xs font-medium text-[#94A3B8]">{m.k}</div>
                    <div className="mt-1 text-sm font-semibold text-[#F9FAFB]">{m.v}</div>
                  </div>
                ))}
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
            <CategoryCard key={c.slug} slug={c.slug} name={c.name} description={c.description} indiaReady={c.indiaReady} />
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

        <div className="mt-10 rounded-2xl border border-[#1F2937] bg-[#0F172A] p-6 shadow-[var(--shadow-sm)] sm:p-8">
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
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6 shadow-[var(--shadow-sm)]">
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

          <div className="rounded-2xl border border-[var(--primary)]/30 bg-[#0F172A] p-6 shadow-[var(--shadow-sm)]">
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

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6 shadow-[var(--shadow-sm)]">
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
            <div key={f.q} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6 shadow-[var(--shadow-sm)]">
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
