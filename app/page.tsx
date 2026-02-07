export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { TrustStrip } from "@/components/marketing/TrustStrip";
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
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />

      {/* Hero */}
      <Section className="pt-10 sm:pt-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
              Find the right HR software for your business — fast.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              India-first recommendations for HRMS, payroll & compliance, attendance, ATS and performance tools.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/stack-builder" size="lg" variant="primary">
                Get recommendations
              </ButtonLink>
              <ButtonLink href="/tools" size="lg" variant="secondary">
                Browse tools
              </ButtonLink>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/tools?category=${encodeURIComponent(c.slug)}`}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search module */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Search tools</div>
                <div className="mt-1 text-sm text-zinc-600">Start with a vendor, category, or use-case.</div>
              </div>
              <Image
                src="/placeholders/tool.svg"
                alt=""
                width={48}
                height={48}
                className="opacity-80"
                priority
              />
            </div>

            <form className="mt-4 flex flex-col gap-3 sm:flex-row" action="/tools">
              <input
                className="input"
                name="q"
                placeholder="Search tools (e.g., Keka, payroll, attendance)"
                aria-label="Search tools"
              />
              <select className="input" name="category" defaultValue="">
                <option value="">All categories</option>
                <option value="hrms">HRMS</option>
                <option value="payroll">Payroll + Compliance</option>
                <option value="attendance">Attendance/Leave</option>
                <option value="ats">ATS/Hiring</option>
                <option value="performance">Performance/OKR</option>
              </select>
              <button className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700">
                Search
              </button>
            </form>

            <div className="mt-4">
              <div className="text-xs font-medium text-zinc-500">Popular categories</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/tools?category=${encodeURIComponent(c.slug)}`}
                    className="rounded-full bg-zinc-50 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-100"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <TrustStrip />
        </div>
      </Section>

      {/* Categories */}
      <Section>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            title="Browse by category"
            subtitle="Start with the module you need. We keep categories simple in v1 so browsing stays fast."
          />
          <Link className="text-sm font-medium text-indigo-700" href="/tools">
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
      <Section className="bg-white">
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
      <Section className="bg-white">
        <SectionHeading title="Trusted by modern teams" subtitle="Logos are placeholders until we add real customers." />

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            "Acme",
            "ZenHR",
            "Northwind",
            "Atlas",
            "Bluepeak",
            "River",
          ].map((x) => (
            <div
              key={x}
              className="flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-500"
            >
              {x}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <SectionHeading
            title="Built for India-first SMEs"
            subtitle="Representative testimonials (placeholder) until we add real customer stories."
          />
          <div className="mt-6">
            <TestimonialStrip />
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-zinc-50 p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-xl font-semibold text-zinc-900">Ready for a guided shortlist?</div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                Get explainable recommendations based on company size, modules, integrations, and compliance needs.
              </p>
            </div>
            <ButtonLink href="/stack-builder" size="lg">
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
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">Starter</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">Free</div>
            <p className="mt-2 text-sm text-zinc-600">Get recommendations + shortlist with reasons.</p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              <li>• 3–5 recommendations</li>
              <li>• Explainable match reasons</li>
              <li>• Request pricing/vendor intro</li>
            </ul>
            <div className="mt-5">
              <ButtonLink href="/stack-builder" size="lg" className="w-full justify-center">
                Get started
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
            <div className="text-sm font-semibold text-indigo-900">Teams</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-indigo-900">Early access</div>
            <p className="mt-2 text-sm text-indigo-800/80">We’ll set this up with you (white-glove).</p>
            <ul className="mt-4 space-y-2 text-sm text-indigo-900">
              <li>• Custom filters (states, compliance, integrations)</li>
              <li>• Vendor screening and intro</li>
              <li>• Priority support</li>
            </ul>
            <div className="mt-5">
              <ButtonLink href="/stack-builder" size="lg" variant="primary" className="w-full justify-center">
                Request early access
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">Enterprise</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">Talk to us</div>
            <p className="mt-2 text-sm text-zinc-600">For larger teams and multi-entity compliance needs.</p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              <li>• Custom scoring rules</li>
              <li>• Assisted evaluation</li>
              <li>• SLA + reporting</li>
            </ul>
            <div className="mt-5">
              <ButtonLink href="/stack-builder" size="lg" variant="secondary" className="w-full justify-center">
                Contact sales
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQs */}
      <Section className="bg-white">
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
            <div key={f.q} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-zinc-900">{f.q}</div>
              <div className="mt-2 text-sm leading-6 text-zinc-600">{f.a}</div>
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
      where: { status: "PUBLISHED" },
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
