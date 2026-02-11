import * as React from "react";

export function CompareRow({
  title,
  left,
  right,
}: {
  title: string;
  left: string;
  right: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 lg:grid-cols-12 lg:gap-4">
      <div className="lg:col-span-3">
        <div className="text-sm font-medium text-[var(--text)]">{title}</div>
      </div>
      <div className="lg:col-span-4">
        <div className="text-xs font-medium text-[var(--text-muted)]">Traditional directories</div>
        <div className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{left}</div>
      </div>
      <div className="lg:col-span-5">
        <div className="text-xs font-medium text-[var(--text-muted)]">HRSignal</div>
        <div className="mt-2 text-sm leading-relaxed text-[var(--text)]">{right}</div>
      </div>
    </div>
  );
}
