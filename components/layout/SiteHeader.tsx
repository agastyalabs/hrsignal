"use client";

import Image from "next/image";
import Link from "next/link";

import { BRAND } from "@/config/brand";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
// Theme is locked (single dark theme).
import { useCompare } from "@/lib/compare/useCompare";

function navItemClass(active: boolean) {
  return `relative rounded-md px-2 py-1 transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-[color:rgba(111,66,193,0.35)] ${
    active
      ? "text-[var(--text)]"
      : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
  }`;
}

function activeUnderline(active: boolean) {
  return active
    ? "after:absolute after:inset-x-2 after:-bottom-2 after:h-0.5 after:rounded-full after:bg-[var(--primary)]"
    : "";
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      className={`${navItemClass(active)} ${activeUnderline(active)}`}
      href={href}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const rawPathname = usePathname() || "/";
  const pathname = rawPathname !== "/" ? rawPathname.replace(/\/+$/, "") : rawPathname;
  const { count, slugs } = useCompare();

  const active = useMemo(() => {
    const is = (prefix: string) => pathname === prefix || pathname.startsWith(prefix + "/");
    return {
      tools: is("/tools"),
      vendors: is("/vendors"),
      categories: is("/categories"),
      resources: is("/resources"),
      recommend: is("/recommend"),
      compare: is("/compare"),
    };
  }, [pathname]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[var(--border-soft)] bg-[var(--header-bg)] transition-shadow motion-reduce:transition-none ${
        scrolled ? "shadow-sm" : "shadow-none"
      }`}
    >
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link href="/" className="shrink-0" aria-label="HRSignal home">
          <span className="flex items-center gap-3 whitespace-nowrap">
            <Image
              src={BRAND.logo}
              alt={BRAND.name}
              width={208}
              height={44}
              priority
              className="h-9 w-auto sm:h-10"
            />
            <span className="hidden text-base font-semibold tracking-tight text-[var(--text)] sm:inline">
              {BRAND.name}
            </span>
          </span>
        </Link>

        {/* Header search (for non-home pages only; homepage already has the primary search/CTA experience) */}
        {pathname !== "/" ? (
          <form action="/tools" className="hidden w-full max-w-md lg:flex">
            <input
              className="h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-4 focus:ring-[var(--ring)]"
              name="q"
              placeholder="Search tools (e.g., payroll, attendance, Keka…)"
              aria-label="Search tools"
            />
          </form>
        ) : null}

        <nav className="flex shrink-0 items-center gap-1 text-sm">
          <NavLink href="/tools" active={active.tools}>
            Tools
          </NavLink>
          <NavLink href="/vendors" active={active.vendors}>
            Vendors
          </NavLink>
          <NavLink href="/categories" active={active.categories}>
            Categories
          </NavLink>
          <NavLink href="/resources" active={active.resources}>
            Resources
          </NavLink>

          {count ? (
            <Link
              className={`${navItemClass(active.compare)} ${activeUnderline(active.compare)}`}
              href={`/compare?tools=${encodeURIComponent(slugs.join(","))}`}
              aria-current={active.compare ? "page" : undefined}
            >
              Compare
              <span className="ml-2 rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-semibold text-[var(--bg)]">                {count}
              </span>
            </Link>
          ) : null}

          {/* Theme toggle removed (single theme). */}

          <div className="ml-2">
            <ButtonLink href="/recommend" variant="primary" size="sm">
              Get recommendations
            </ButtonLink>
          </div>
        </nav>
      </Container>
    </header>
  );
}
