"use client";

import * as React from "react";

export function Progress({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(148,163,184,0.18)]">
      <div
        className="h-full rounded-full bg-emerald-500 transition-[width] duration-300 motion-reduce:transition-none"
        style={{ width: `${v}%` }}
        aria-hidden="true"
      />
      <span className="sr-only">Progress: {v}%</span>
    </div>
  );
}
