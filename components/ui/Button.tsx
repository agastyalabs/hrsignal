import Link from "next/link";
import * as React from "react";

type Variant = "primary" | "secondary" | "tertiary";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-[var(--radius-sm)] font-semibold transition-all duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--primary)] text-white shadow-[0_10px_30px_rgba(0,0,0,0.22)] hover:bg-[var(--primary-hover)] hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(124,77,255,0.18)] active:translate-y-0 active:shadow-[0_10px_30px_rgba(0,0,0,0.22)] disabled:bg-[rgba(255,255,255,0.10)] disabled:text-[rgba(247,249,255,0.55)]",
  secondary:
    "border border-[var(--border)] bg-[var(--surface-1)] text-[var(--text)] hover:bg-[var(--surface-2)] hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.18)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.30)] active:translate-y-0 disabled:text-[var(--text-muted)]",
  tertiary:
    "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] active:bg-[var(--surface-2)]",
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
