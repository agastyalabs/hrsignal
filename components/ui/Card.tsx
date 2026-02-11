import * as React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`u-card-hover rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-none motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
}
