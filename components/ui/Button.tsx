import Link from "next/link";
import * as React from "react";

type Variant = "primary" | "secondary" | "tertiary";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[rgba(116,65,242,0.45)] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none";

const variants: Record<Variant, string> = {
  // Primary CTA: purple bg + off-white text
  primary:
    "bg-[#7441F2] text-[#F9FAFB] hover:bg-[#825AE0] active:bg-[#5E2FDE] disabled:bg-[#2A2E55] disabled:text-[#94A3B8]",
  // Secondary CTA: outlined
  secondary:
    "border border-[#1F2937] bg-transparent text-[#F9FAFB] hover:bg-[#0F172A] active:bg-[#111827] disabled:text-[#94A3B8]",
  tertiary:
    "text-[#CBD5E1] hover:bg-[#0F172A] hover:text-[#F9FAFB] active:bg-[#111827] disabled:text-[#94A3B8]",
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
