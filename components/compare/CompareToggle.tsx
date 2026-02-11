"use client";

import { useEffect, useMemo, useState } from "react";
import { useCompare } from "@/lib/compare/useCompare";

function maxCompareItems() {
  if (typeof window === "undefined") return 5;
  try {
    return window.matchMedia("(max-width: 640px)").matches ? 4 : 5;
  } catch {
    return 5;
  }
}

export function CompareToggle({ slug }: { slug: string }) {
  const { slugs, toggle } = useCompare();
  const active = useMemo(() => slugs.includes(slug), [slugs, slug]);

  const [max, setMax] = useState(() => maxCompareItems());
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    const onChange = () => setMax(maxCompareItems());
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  const full = !active && slugs.length >= max;

  return (
    <button
      type="button"
      disabled={full}
      aria-disabled={full}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors motion-reduce:transition-none focus:outline-none focus:ring-4 focus:ring-[var(--ring)] ${
        active
          ? "border-[rgba(124,77,255,0.35)] bg-[rgba(124,77,255,0.16)] text-[var(--text)]"
          : full
            ? "cursor-not-allowed border-[var(--border-soft)] bg-[var(--surface-1)] text-[rgba(247,249,255,0.45)]"
            : "border-[var(--border-soft)] bg-[var(--surface-1)] text-[var(--text)] hover:bg-[var(--surface-2)]"
      }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      title={full ? `You can compare up to ${max} tools on this device.` : undefined}
    >
      {active ? "Added" : "Compare"}
    </button>
  );
}
