import Link from "next/link";

import { prisma } from "@/lib/db";

export async function JustLaunched() {
  if (!process.env.DATABASE_URL) return null;

  const rows = await prisma.pendingTool.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
    select: { id: true, name: true, website: true, category: true, createdAt: true },
  });

  if (!rows.length) return null;

  return (
    <div className="radius-card border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm font-extrabold text-slate-900">Just launched</div>
          <div className="mt-1 text-sm text-slate-600">Newest submissions (stealth queue).</div>
        </div>
        <Link className="text-sm font-semibold text-[var(--link)] hover:text-[var(--link-hover)]" href="/submit">
          Submit yours →
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((r) => (
          <a
            key={r.id}
            href={r.website}
            target="_blank"
            rel="noreferrer"
            className="radius-inner border border-slate-200 bg-slate-50 p-4 transition-all hover:-translate-y-0.5 hover:bg-white"
          >
            <div className="text-sm font-extrabold text-slate-900">{r.name}</div>
            <div className="mt-1 text-xs font-bold text-slate-500">{r.category}</div>
            <div className="mt-2 text-xs text-slate-600">{r.website.replace(/^https?:\/\//, "")}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
