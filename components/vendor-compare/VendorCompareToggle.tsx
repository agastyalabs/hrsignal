"use client";

import { useId } from "react";

import { useVendorCompare } from "@/lib/vendor-compare/useVendorCompare";

export function VendorCompareToggle({ slug, label }: { slug: string; label: string }) {
  const { slugs, toggle } = useVendorCompare();
  const checked = slugs.includes(slug);
  const id = useId();

  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={() => toggle(slug)}
        className="h-4 w-4 rounded border-[var(--border)] bg-[var(--surface-2)] text-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[rgba(139,92,246,0.25)]"
        aria-label={`Select ${label} for vendor compare`}
      />
      <label htmlFor={id} className="text-xs font-semibold text-[var(--text-muted)] select-none cursor-pointer">
        Compare
      </label>
    </div>
  );
}
