import * as React from "react";

export function SectionHeading({
  title,
  subtitle,
  className = "",
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">{title}</h2>
      {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">{subtitle}</p> : null}
    </div>
  );
}
