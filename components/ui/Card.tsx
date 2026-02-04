import * as React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`rounded-xl border border-zinc-200 bg-white p-5 ${className}`}>{children}</div>;
}
