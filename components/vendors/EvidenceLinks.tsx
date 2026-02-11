import * as React from "react";

import type { EvidenceLink } from "@/lib/vendors/researched";

function kindBadge(kind: EvidenceLink["kind"]) {
  const base = "rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text)]";
  if (kind === "Pricing") return `${base} border-[rgba(124,77,255,0.22)] bg-[rgba(124,77,255,0.12)]`;
  if (kind === "Security") return `${base} border-[rgba(39,211,188,0.22)] bg-[rgba(39,211,188,0.10)]`;
  if (kind === "Docs") return `${base}`;
  if (kind === "Support") return `${base}`;
  if (kind === "Case study") return `${base}`;
  return base;
}

export function EvidenceLinks({ links }: { links: EvidenceLink[] }) {
  const safe = (links ?? []).filter((l) => l?.url && l?.label).slice(0, 8);
  if (!safe.length) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {safe.map((l) => (
        <a
          key={`${l.kind}:${l.url}`}
          href={l.url}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 py-3"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={kindBadge(l.kind)}>{l.kind}</span>
              <div className="truncate text-sm font-semibold text-[var(--text)]">{l.label}</div>
            </div>
            <div className="mt-1 truncate text-xs text-[var(--text-muted)]">{l.url.replace(/^https?:\/\//, "")}</div>
          </div>
          <div className="text-xs font-semibold text-[var(--text-muted)] group-hover:text-[var(--text)]">→</div>
        </a>
      ))}
    </div>
  );
}
