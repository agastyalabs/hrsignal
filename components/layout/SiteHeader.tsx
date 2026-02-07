"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { useCompare } from "@/lib/compare/useCompare";

function navItemClass(active: boolean) {
  return `relative rounded-md px-2 py-1 transition-colors motion-reduce:transition-none focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
    active
      ? "bg-indigo-50 text-indigo-700"
      : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
  }`;
}

function activeUnderline(active: boolean) {
  return active
    ? "after:absolute after:inset-x-2 after:-bottom-2 after:h-0.5 after:rounded-full after:bg-indigo-600"
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
      className={`sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur transition-shadow motion-reduce:transition-none ${
        scrolled ? "shadow-sm" : "shadow-none"
      }`}
    >
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link href="/" className="shrink-0 text-lg font-semibold tracking-tight text-zinc-900">
          HRSignal
        </Link>

        {/* Header search (UI-only for now; forwards to /tools query) */}
        <form action="/tools" className="hidden w-full max-w-md items-center gap-2 lg:flex">
          <input
            className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
            name="q"
            placeholder="Search tools (e.g., payroll, attendance, Keka…)"
            aria-label="Search tools"
          />
          <button className="h-10 rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-zinc-800">
            Search
          </button>
        </form>

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
              <span className="ml-2 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                {count}
              </span>
            </Link>
          ) : null}

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
