import * as React from "react";

export function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[108px] flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
      <div className="text-xs font-medium text-[var(--text-muted)]">{label}</div>
      <div>
        <div className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--text)]">{value}</div>
        <div className="mt-1 text-sm text-[var(--text-muted)]">{description}</div>
      </div>
    </div>
  );
}
