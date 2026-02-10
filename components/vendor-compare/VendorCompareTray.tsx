"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useVendorCompare } from "@/lib/vendor-compare/useVendorCompare";

export function VendorCompareTray() {
  const { slugs, count, clear } = useVendorCompare();

  const href = useMemo(() => {
    if (!slugs.length) return "/compare/vendors";
    return `/compare/vendors?vendors=${encodeURIComponent(slugs.join(","))}`;
  }, [slugs]);

  if (!count) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[rgba(10,14,24,0.85)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(10,14,24,0.65)]"
      role="region"
      aria-label="Vendor comparison tray"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-[var(--text)]">Compare vendors</div>
            <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-xs font-semibold text-white" aria-label={`${count} vendors selected`}>
              {count}
            </span>
            <button
              type="button"
              className="ml-2 text-xs font-medium text-[var(--text-muted)] underline decoration-[var(--border)] underline-offset-2 hover:text-[var(--text)]"
              onClick={() => clear()}
              aria-label="Clear vendor compare selection"
            >
              Clear
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {slugs.map((s) => (
              <span
                key={s}
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--text)]"
              >
                <span className="truncate">{s}</span>
              </span>
            ))}
          </div>

          <div className="mt-2 text-xs text-[var(--text-muted)]">Tip: select up to 3 vendors.</div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={href}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-4 focus:ring-[rgba(139,92,246,0.25)]"
            aria-label="Open vendor compare"
          >
            Compare
          </Link>
          <Link
            href="/vendors"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-1)]"
            aria-label="Continue browsing vendors"
          >
            Keep browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
