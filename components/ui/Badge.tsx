import * as React from "react";

type Variant = "neutral" | "verified";

const variants: Record<Variant, string> = {
  neutral: "border border-zinc-200 bg-zinc-50 text-zinc-700",
  verified: "border border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function Badge({
  children,
  variant = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
