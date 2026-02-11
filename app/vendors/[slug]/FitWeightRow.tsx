import * as React from "react";

export function FitWeightRow({ label, weight }: { label: string; weight: number }) {
  const pct = Math.max(0, Math.min(100, weight));
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center">
      <div className="text-sm font-medium text-[var(--text)] sm:col-span-4">{label}</div>
      <div className="sm:col-span-6">
        <div className="h-2 w-full rounded-full bg-[rgba(255,255,255,0.08)]">
          <div className="h-2 rounded-full bg-[var(--primary)]" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="text-sm font-semibold text-[var(--text-muted)] sm:col-span-2 sm:text-right">{pct}%</div>
    </div>
  );
}
