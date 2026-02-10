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
      <h2 className="text-[length:var(--h2-size)] font-semibold tracking-tight text-[var(--text)]">{title}</h2>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">{subtitle}</p>
      ) : null}
    </div>
  );
}
