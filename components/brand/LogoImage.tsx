"use client";

import * as React from "react";

export function LogoImage({
  src,
  fallbackSrc,
  alt,
  className = "",
  width,
  height,
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  const [imgSrc, setImgSrc] = React.useState(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => {
        if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
      }}
    />
  );
}
