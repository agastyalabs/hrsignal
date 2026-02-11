import * as React from "react";

export function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-2">
      <div className="text-[11px] font-semibold text-[var(--text-muted)]">{label}</div>
      <div className="text-xs font-extrabold text-[var(--text)]">{value}</div>
    </div>
  );
}
