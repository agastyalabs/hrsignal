export const dynamic = "force-dynamic";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { prisma } from "@/lib/db";

const CATEGORY_TILES = [
  {
    slug: "hrms",
    name: "Core HRMS",
    desc: "Employee lifecycle, org, docs, workflows",
    indiaReady: false,
  },
  {
    slug: "payroll",
    name: "Payroll + Compliance",
    desc: "India-first PF/ESI/PT/TDS fit",
    indiaReady: true,
  },
  {
    slug: "attendance",
    name: "Attendance/Leave/Time",
    desc: "Shifts, biometric, field staff",
    indiaReady: true,
  },
  {
    slug: "ats",
    name: "ATS / Hiring",
    desc: "Pipeline, interviews, offers",
    indiaReady: false,
  },
  {
    slug: "performance",
    name: "Performance/OKR",
    desc: "Reviews, goals, feedback",
    indiaReady: false,
  },
] as const;

const USE_CASES = [
  {
    title: "Set up payroll in 7 days",
    desc: "Shortlist payroll tools that handle statutory basics and approvals.",
    href: "/tools?category=payroll",
  },
  {
    title: "Automate attendance & leave",
    desc: "Biometric, shifts, WFH, field teams — pick what fits.",
    href: "/tools?category=attendance",
  },
  {
    title: "Hire 20 people / quarter",
    desc: "ATS tools that keep pipeline, interviews, and offers organized.",
    href: "/tools?category=ats",
  },
] as const;

const COMPARISONS = [
  { title: "Keka vs Zoho People", href: "/tools?q=keka" },
  { title: "greytHR vs Keka", href: "/tools?q=greythr" },
  { title: "Zoho Recruit vs Freshteam", href: "/tools?category=ats" },
] as const;

export default async function Home() {
  const trending = await getTrendingTools();

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        {/* Hero */}
        <section className="rounded-2xl bg-white p-8 shadow sm:p-10">
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-900">
            Find the right HR software for your business — fast.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
            HRSignal is a HR-only software discovery platform for India-first SMEs: HRMS, payroll & compliance, attendance, ATS, and
            performance.
          </p>

          {/* Search */}
          <form
            className="mt-6 flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row"
            action="/tools"
          >
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
            <button className="rounded-md bg-black px-4 py-2 font-medium text-white transition-transform hover:-translate-y-0.5">
              Search
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORY_TILES.map((c) => (
              <Link
                key={c.slug}
                href={`/tools?category=${encodeURIComponent(c.slug)}`}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-800 transition-colors hover:bg-zinc-50"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/stack-builder"
              className="rounded-full bg-black px-3 py-1 text-sm text-white transition-transform hover:-translate-y-0.5"
            >
              Get recommendations
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card title="India-first compliance fit">PF/ESI/PT-ready options with clear notes and SME realities.</Card>
            <Card title="Explainable recommendations">See “why this tool” with scoring factors — no black box.</Card>
            <Card title="Qualified vendor intros">Share your requirements once. We route to one best-fit vendor.</Card>
          </div>
        </section>

        {/* Categories */}
        <section className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold">Popular categories</h2>
            <Link className="text-sm underline" href="/tools">
              Browse all tools
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_TILES.map((c) => (
              <Link
                key={c.slug}
                href={`/tools?category=${encodeURIComponent(c.slug)}`}
                className="rounded-xl bg-white p-5 shadow transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">{c.name}</div>
                  {c.indiaReady ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                      India-ready
                    </span>
                  ) : null}
                </div>
                <div className="mt-2 text-sm text-zinc-600">{c.desc}</div>
                <div className="mt-4 text-sm font-medium underline">Explore →</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Trending tools</h2>
          <p className="mt-1 text-sm text-zinc-600">Quick picks to start your shortlist.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group rounded-xl bg-white p-5 shadow transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="text-lg font-semibold">{t.name}</div>
                {t.vendorName ? <div className="mt-1 text-sm text-zinc-600">by {t.vendorName}</div> : null}
                {t.tagline ? <div className="mt-3 text-sm text-zinc-700">{t.tagline}</div> : null}
                <div className="mt-4 text-sm font-medium underline opacity-0 transition-opacity group-hover:opacity-100">
                  View details →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Use-cases + Comparisons */}
        <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold">Use-case collections</h2>
            <div className="mt-4 space-y-4">
              {USE_CASES.map((u) => (
                <Link
                  key={u.title}
                  href={u.href}
                  className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50"
                >
                  <div className="font-semibold">{u.title}</div>
                  <div className="mt-1 text-sm text-zinc-600">{u.desc}</div>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold">Comparison spotlight</h2>
            <p className="mt-1 text-sm text-zinc-600">Fast shortcuts to common evaluations.</p>
            <div className="mt-4 space-y-3">
              {COMPARISONS.map((c) => (
                <Link key={c.title} href={c.href} className="block text-sm font-medium underline">
                  {c.title}
                </Link>
              ))}
            </div>
            <div className="mt-6 rounded-lg bg-zinc-50 p-4">
              <div className="text-sm font-semibold">Want a guided shortlist?</div>
              <div className="mt-1 text-sm text-zinc-600">Answer a quick questionnaire and get explainable recommendations.</div>
              <Link className="mt-3 inline-block rounded-md bg-black px-4 py-2 text-sm text-white" href="/stack-builder">
                Start Stack Builder
              </Link>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="mt-10 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">How we rank tools</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Recommendations are explainable and based on your company size, must-have modules, integrations, and India-first compliance fit.
            We don’t blast your lead to multiple vendors.
          </p>
        </section>

        {/* Vendor CTA */}
        <section className="mt-10 rounded-2xl bg-black p-8 text-white shadow sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold">Are you a vendor?</h2>
              <p className="mt-2 max-w-xl text-sm text-zinc-200">
                Get listed in HRSignal’s HR-only marketplace and receive qualified leads from Indian SMEs.
              </p>
            </div>
            <Link className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-black" href="/admin">
              Get listed (internal)
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

async function getTrendingTools() {
  const fallback = [
    { slug: "keka", name: "Keka", vendorName: "Keka", tagline: "Modern HRMS with payroll" },
    { slug: "greythr", name: "greytHR", vendorName: "greytHR", tagline: "HRMS + payroll for Indian SMEs" },
    { slug: "zoho-people", name: "Zoho People", vendorName: "Zoho", tagline: "HRMS with attendance/leave" },
  ];

  if (!process.env.DATABASE_URL) return fallback;

  try {
    const rows = await prisma.tool.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { lastVerifiedAt: "desc" },
      include: { vendor: true },
      take: 6,
    });

    return rows.map((t) => ({
      slug: t.slug,
      name: t.name,
      vendorName: t.vendor?.name ?? "",
      tagline: t.tagline ?? "",
    }));
  } catch {
    return fallback;
  }
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div className="text-base font-semibold text-zinc-900">{title}</div>
      <div className="mt-2 text-sm leading-6 text-zinc-600">{children}</div>
    </div>
  );
}
