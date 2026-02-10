"use client";

import * as React from "react";

function initials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  const chars = parts.map((p) => p.replace(/[^a-zA-Z0-9]/g, "").slice(0, 1).toUpperCase());
  return chars.join("") || name.slice(0, 2).toUpperCase();
}

export function VendorLogo({
  slug,
  name,
  domain,
  className = "",
  size = 28,
}: {
  slug: string;
  name: string;
  domain?: string | null;
  className?: string;
  size?: number;
}) {
  const sources = React.useMemo(() => {
    const out: string[] = [`/vendor-logos/${slug}.png`];
    if (domain) out.push(`https://logo.clearbit.com/${domain}`);
    return out;
  }, [slug, domain]);

  const [idx, setIdx] = React.useState(0);
  const src = sources[Math.min(idx, sources.length - 1)];
  const showInitials = idx >= sources.length;

  if (showInitials) {
    return (
      <div
        className={`flex items-center justify-center rounded-md bg-[#0F172A] text-xs font-semibold text-[#CBD5E1] ring-1 ring-[#1F2937] ${className}`}
        style={{ width: size, height: size }}
        aria-label={name}
        title={name}
      >
        {initials(name)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setIdx((i) => i + 1)}
    />
  );
}
