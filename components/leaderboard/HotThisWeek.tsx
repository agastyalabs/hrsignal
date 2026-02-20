import Link from "next/link";

import { prisma } from "@/lib/db";

export async function HotThisWeek() {
  if (!process.env.DATABASE_URL) return null;

  const top = await prisma.tool.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ upvotesWeek: "desc" }, { upvotes: "desc" }, { name: "asc" }],
    select: { id: true, slug: true, name: true, upvotesWeek: true },
    take: 7,
  });

  if (!top.length) return null;

  const badge = (idx: number) => {
    if (idx === 0) return "👑";
    if (idx === 1) return "👑";
    if (idx === 2) return "👑";
    return "🔥";
  };

  return (
    <aside className="radius-card border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="text-sm font-extrabold text-slate-900">Hot this week</div>
        <div className="text-xs font-bold text-emerald-700">🔥</div>
      </div>
      <div className="mt-1 text-xs text-slate-500">Resets Monday 00:00 IST.</div>

      <ol className="mt-4 space-y-2">
        {top.map((t, idx) => (
          <li key={t.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm">{badge(idx)}</span>
                <Link href={`/tools/${t.slug}`} className="truncate text-sm font-semibold text-slate-900 hover:underline">
                  {t.name}
                </Link>
              </div>
            </div>
            <span className="radius-pill bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              +{t.upvotesWeek}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-4">
        <Link className="text-sm font-semibold text-[var(--link)] hover:text-[var(--link-hover)]" href="/submit">
          Submit a tool →
        </Link>
      </div>
    </aside>
  );
}
