import Link from "next/link";

const TILES = [
  { slug: "payroll", label: "Payroll", tone: "from-indigo-50 to-white", icon: "₹" },
  { slug: "attendance", label: "Attendance", tone: "from-emerald-50 to-white", icon: "⏱" },
  { slug: "hrms", label: "HRMS", tone: "from-slate-50 to-white", icon: "🏢" },
  { slug: "ats", label: "ATS", tone: "from-indigo-50 to-emerald-50", icon: "🧲" },
  { slug: "performance", label: "Performance", tone: "from-emerald-50 to-white", icon: "📈" },
  { slug: "compliance", label: "Compliance", tone: "from-rose-50 to-white", icon: "🧾" },
] as const;

export function CategoryTiles() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TILES.map((t) => (
        <Link
          key={t.slug}
          href={`/categories/${encodeURIComponent(t.slug)}`}
          className={`group radius-card border border-slate-200 bg-gradient-to-br ${t.tone} p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-float`}
        >
          <div className="flex items-center justify-between">
            <div className="text-lg font-extrabold text-slate-900">{t.label}</div>
            <div className="inline-flex h-11 w-11 items-center justify-center radius-pill bg-white/70 text-lg shadow-soft">{t.icon}</div>
          </div>
          <div className="mt-3 text-sm text-slate-700">Browse India-first tools →</div>
          <div className="mt-4 text-sm font-semibold text-[var(--primary-blue)] group-hover:text-[var(--primary-dark)]">Explore</div>
        </Link>
      ))}
    </div>
  );
}
