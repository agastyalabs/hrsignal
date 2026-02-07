import Link from "next/link";
import * as React from "react";

type Variant = "primary" | "secondary" | "tertiary";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-purple-500/25 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none";

const variants: Record<Variant, string> = {
  // Primary CTA: purple bg + white text
  primary: "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 disabled:bg-purple-300",
  // Secondary CTA: neutral bg + dark text
  secondary:
    "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 disabled:bg-zinc-100 disabled:text-zinc-400",
  tertiary: "text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 disabled:text-zinc-400",
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
