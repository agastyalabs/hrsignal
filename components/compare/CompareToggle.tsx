"use client";

import { useMemo } from "react";
import { useCompare } from "@/lib/compare/useCompare";

export function CompareToggle({ slug }: { slug: string }) {
  const { slugs, toggle } = useCompare();
  const active = useMemo(() => slugs.includes(slug), [slugs, slug]);

  return (
    <button
      type="button"
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors motion-reduce:transition-none ${
        active ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
      }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
    >
      {active ? "Added" : "Compare"}
    </button>
  );
}
