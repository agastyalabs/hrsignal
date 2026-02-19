"use client";

import Link from "next/link";
import * as React from "react";

type Variant = "primary" | "secondary" | "tertiary";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-[var(--radius-sm)] font-semibold leading-none whitespace-nowrap select-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--primary-blue)] text-white shadow-[var(--shadow-soft)] hover:bg-[var(--primary-dark)] hover:shadow-[var(--shadow-glow)] active:translate-y-px",
  secondary:
    "border border-[var(--border-soft)] bg-white/70 text-[var(--text-main)] shadow-[0_1px_0_rgba(255,255,255,0.7)_inset] hover:bg-white hover:border-[rgba(15,23,42,0.18)]",
  tertiary:
    "text-[rgba(15,23,42,0.72)] hover:bg-[rgba(37,99,235,0.06)] hover:text-[var(--text-main)]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  onClick,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link href={href} onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </Link>
  );
}
