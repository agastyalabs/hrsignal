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
      className={`rounded-xl border border-[#1F2937] bg-[#111827] p-5 shadow-sm transition-all duration-200 motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
}
