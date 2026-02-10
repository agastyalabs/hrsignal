"use client";

import * as React from "react";

export function ResolvedLogo({
  sources,
  fallbackSrc,
  alt,
  className = "",
}: {
  sources: string[];
  fallbackSrc: string;
  alt: string;
  className?: string;
}) {
  const all = React.useMemo(() => {
    const s = sources.filter(Boolean);
    return s.length ? s : [fallbackSrc];
  }, [sources, fallbackSrc]);

  const [idx, setIdx] = React.useState(0);
  const src = all[Math.min(idx, all.length - 1)] ?? fallbackSrc;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        if (idx < all.length - 1) setIdx((i) => i + 1);
      }}
    />
  );
}
