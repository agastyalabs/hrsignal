import Link from "next/link";

import { prisma } from "@/lib/db";
import { VendorLogo } from "@/components/VendorLogo";
import { domainFromUrl } from "@/lib/brand/logo";
import { UpvoteButton } from "@/components/upvote/UpvoteButton";

const HERO = [
  { slug: "keka", name: "Keka", score: 92, line: "Payroll that survives month-end." },
  { slug: "peoplestrong", name: "PeopleStrong", score: 88, line: "Enterprise workflows without the drama." },
  { slug: "darwinbox", name: "Darwinbox", score: 86, line: "Suite depth. Validate implementation early." },
] as const;

export async function HeroVendorCards() {
  const slugs = HERO.map((h) => h.slug);

  const tools = process.env.DATABASE_URL
    ? await prisma.tool.findMany({
        where: { slug: { in: slugs } },
        select: { id: true, slug: true, name: true, upvotes: true, vendor: { select: { name: true, websiteUrl: true } } },
      })
    : [];

  const bySlug = new Map(tools.map((t) => [t.slug, t]));

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {HERO.map((h, idx) => {
          const t = bySlug.get(h.slug);
          const vendorName = t?.vendor?.name ?? h.name;
          const websiteUrl = t?.vendor?.websiteUrl ?? null;
          const domain = websiteUrl ? domainFromUrl(websiteUrl) : null;

          const floatClass = idx === 0 ? "lg:-translate-y-3" : idx === 2 ? "lg:translate-y-3" : "";

          return (
            <div
              key={h.slug}
              className={
                "radius-card border border-slate-200 bg-white p-7 shadow-float transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)] " +
                floatClass
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                    <VendorLogo slug={h.slug} name={vendorName} domain={domain} className="h-12 w-12 rounded-xl" size={48} />
                  </div>

                  <div>
                    <div className="text-lg font-extrabold tracking-tight text-slate-900">{vendorName}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-600">Readiness Score™</div>
                  </div>
                </div>

                <span className="radius-pill bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700">{h.score}/100</span>
              </div>

              <div className="mt-4 text-sm leading-relaxed text-slate-700">{h.line}</div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <Link
                  href={`/vendors/${h.slug}`}
                  className="inline-flex h-11 items-center justify-center radius-pill bg-[var(--primary-blue)] px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--primary-dark)]"
                >
                  View profile
                </Link>

                {t?.id ? (
                  <div className="animate-pulse">
                    <UpvoteButton toolId={t.id} initial={t.upvotes ?? 0} />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
