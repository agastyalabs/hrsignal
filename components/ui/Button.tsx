import Link from "next/link";
import * as React from "react";

type Variant = "primary" | "secondary" | "tertiary";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none";

const variants: Record<Variant, string> = {
  // Primary CTA: purple bg + off-white text
  primary:
    "bg-[var(--primary)] text-[#F9FAFB] hover:bg-[var(--primary-hover)] active:bg-[var(--primary-hover)] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(116,65,242,0.20)] active:translate-y-0 disabled:bg-[#2A2E55] disabled:text-[#94A3B8]",
  // Secondary CTA: outlined
  secondary:
    "border border-[var(--border)] bg-transparent text-[#F9FAFB] hover:bg-[var(--surface-2)] active:bg-[var(--surface-2)] hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.14)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] active:translate-y-0 disabled:text-[#94A3B8]",
  tertiary:
    "text-[#CBD5E1] hover:bg-[var(--surface-2)] hover:text-[#F9FAFB] active:bg-[var(--surface-2)] disabled:text-[#94A3B8]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
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
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </Link>
  );
}
