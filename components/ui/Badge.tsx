import * as React from "react";

type Variant = "neutral" | "verified";

const variants: Record<Variant, string> = {
  neutral: "border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]",
  verified: "border border-[rgba(39,211,188,0.35)] bg-[rgba(39,211,188,0.12)] text-[var(--text)]",
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
