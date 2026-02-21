export const dynamic = "force-dynamic";

import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HomeSection } from "@/components/marketing/HomeSection";

import { prisma } from "@/lib/db";

import { HeroVendorCards } from "@/components/home/HeroVendorCards";
import { HotCarousel } from "@/components/home/HotCarousel";
import { JustLaunched } from "@/components/home/JustLaunched";
import { CategoryTiles } from "@/components/home/CategoryTiles";

export default async function Home() {
  const hot = process.env.DATABASE_URL
    ? await prisma.tool.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ upvotesWeek: "desc" }, { upvotes: "desc" }, { name: "asc" }],
        select: { slug: true, name: true, tagline: true, upvotesWeek: true },
        take: 6,
      })
    : [];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)]">
      <SiteHeader />

      {/* 1) Hero + decision snapshot */}
      <HomeSection className="pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden">
        <div className="bg-blob-blue" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide">
                <span className="w-2 h-2 bg-[var(--primary-blue)] rounded-full animate-pulse" />
                Curated for Indian teams
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
                Stop Guessing. <span className="text-[var(--primary-blue)]">Discover HR Tools That Actually Work in India.</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">Curated &amp; battle-tested by 300+ Indian HR leaders</p>

              <div className="max-w-md relative group">
                <div className="absolute inset-0 bg-[var(--primary-blue)] rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity" />
                <form
                  action="/recommend"
                  method="get"
                  className="relative bg-white p-2 rounded-full shadow-soft flex items-center border border-slate-100"
                >
                  <input type="hidden" name="source" value="hero_email" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="work_email@company.com"
                    autoComplete="email"
                    aria-label="Work email"
                    className="flex-1 bg-transparent border-none outline-none px-6 text-slate-700 placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    className="bg-[var(--primary-blue)] hover:bg-[var(--primary-dark)] text-white font-semibold py-3 px-6 rounded-full transition-all"
                  >
                    Analyze Fit
                  </button>
                </form>
              </div>

              <div className="flex items-center gap-6 text-xs font-semibold text-slate-500 pt-2">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Takes 60 Seconds
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> No Vendor Spam
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Unbiased
                </span>
              </div>
            </div>

            <div className="relative h-[600px] w-full flex items-center justify-center">
              <DecisionSnapshotCard />
            </div>
          </div>
        </div>
      </HomeSection>

      {/* Valentine-killer middle: replace everything after hero */}
      <HomeSection className="pt-0 border-t border-[var(--border-soft)]">
        <HeroVendorCards />
      </HomeSection>

      <HomeSection className="pt-0 border-t border-[var(--border-soft)]">
        <HotCarousel
          items={hot.map((t) => ({ slug: t.slug, name: t.name, weekly: t.upvotesWeek ?? 0, tagline: t.tagline ?? null }))}
        />
      </HomeSection>

      <HomeSection className="pt-0 border-t border-[var(--border-soft)]">
        <JustLaunched />
      </HomeSection>

      <HomeSection className="pt-0 border-t border-[var(--border-soft)]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-extrabold text-slate-900">Categories</div>
            <div className="mt-1 text-sm text-slate-600">Start with a module. Move fast. Validate hard.</div>
          </div>
          <Link className="text-sm font-semibold text-[var(--link)] hover:text-[var(--link-hover)]" href="/tools">
            Explore all →
          </Link>
        </div>
        <div className="mt-5">
          <CategoryTiles />
        </div>
      </HomeSection>

      <SiteFooter />
    </div>
  );
}

function DecisionSnapshotCard() {
  return (
    <>
      {/* Fit card */}
      <div className="absolute bg-white p-8 radius-card shadow-float w-80 z-20 animate-float border border-slate-100 left-10 top-20">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Keka HR</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Enterprise Plan</p>
          </div>
          <div className="w-8 h-8 rounded-full shadow-sm bg-[#FF9933] flex items-center justify-center text-white text-[10px] font-bold">
            IN
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-extrabold text-slate-900 tracking-tighter">92</span>
            <span className="text-sm font-semibold text-slate-400 mb-2">/100 Fit</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-[var(--primary-blue)] h-full rounded-full" style={{ width: "92%" }} />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Payroll Compl.</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md text-xs">Full Match</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Budget</span>
            <span className="text-slate-900 font-bold">₹120/emp</span>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Link
            href="/tools"
            className="flex-1 bg-slate-900 text-white text-xs font-bold py-3 rounded-xl hover:bg-slate-800 transition text-center"
          >
            View Details
          </Link>
          <button type="button" className="bg-slate-100 text-slate-600 p-3 rounded-xl hover:bg-slate-200 transition" aria-label="More">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Compliance card */}
      <div className="absolute bg-slate-900 p-8 radius-card shadow-2xl w-80 z-10 animate-float-delay right-0 bottom-20 opacity-95">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-white text-lg">Compliance Check</h3>
          <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
        </div>

        <div className="space-y-4">
          {["PF Calculation", "Form-16 Auto", "ESI + PT"].map((label) => (
            <div key={label} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex items-center justify-between">
              <span className="text-slate-300 text-sm">{label}</span>
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ))}
        </div>

        <div className="mt-6 text-xs text-slate-400">Evidence-backed checks (PF/ESI/PT/TDS) — verify during demos.</div>
      </div>
    </>
  );
}
