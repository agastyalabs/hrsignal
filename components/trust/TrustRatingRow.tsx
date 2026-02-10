import * as React from "react";

import type { TrustLevel } from "@/lib/trust/policy";
import { formatYmd, normalizeLastCheckedAt, normalizeSourcesCount } from "@/lib/trust/policy";

function trustLabel(level: TrustLevel) {
  if (level === "verified") return "Verified";
  if (level === "partial") return "Partial";
  return "Unverified";
}

function trustStyles(level: TrustLevel) {
  if (level === "verified") return "border-emerald-300/30 bg-emerald-500/10 text-emerald-200";
  if (level === "partial") return "border-amber-300/30 bg-amber-500/10 text-amber-200";
  return "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)]";
}

export function TrustBadge({ level }: { level: TrustLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${trustStyles(level)}`}
    >
      {trustLabel(level)}
    </span>
  );
}

export function TrustRatingRow({
  level,
  sourcesCount,
  lastCheckedAt,
  ratingValue,
  ratingCount,
  className = "",
}: {
  level: TrustLevel;
  sourcesCount?: number | null;
  lastCheckedAt?: Date | string | null;
  ratingValue?: number | null;
  ratingCount?: number | null;
  className?: string;
}) {
  // Policy:
  // - Never show "No ratings yet". If rating missing, omit rating entirely.
  // - Trust badge always present.
  // - Sources shown only if >0.
  // - Last checked shown only if available.

  const sources = normalizeSourcesCount(sourcesCount);
  const last = normalizeLastCheckedAt(lastCheckedAt);
  const showRating = typeof ratingValue === "number" && Number.isFinite(ratingValue);

  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs ${className}`}>
      <TrustBadge level={level} />

      {showRating ? (
        <span className="text-[var(--text)]">
          {ratingValue!.toFixed(1)}
          {typeof ratingCount === "number" && ratingCount > 0 ? (
            <span className="ml-1 text-[var(--text-muted)]">({ratingCount})</span>
          ) : null}
        </span>
      ) : null}

      {sources ? <span className="text-[var(--text-muted)]">Sources: {sources}</span> : null}
      {last ? <span className="text-[var(--text-muted)]">Last checked: {formatYmd(last)}</span> : null}
    </div>
  );
}
