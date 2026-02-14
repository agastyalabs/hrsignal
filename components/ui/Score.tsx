import * as React from "react";

export function Score({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const tone = v > 80 ? "text-emerald-500" : v >= 55 ? "text-amber-300" : "text-slate-200";
  return <span className={`text-2xl font-bold ${tone}`}>{v}</span>;
}
