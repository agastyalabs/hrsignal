"use client";

import Image from "next/image";
import Link from "next/link";

import { BRAND } from "@/config/brand";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useCompare } from "@/lib/compare/useCompare";

function navItemClass(active: boolean) {
  return `relative rounded-md px-2 py-1 transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/35 ${
    active
      ? "text-[#F9FAFB]"
      : "text-[#CBD5E1] hover:bg-[#0F172A] hover:text-[#F9FAFB]"
  }`;
}

function activeUnderline(active: boolean) {
  return active
    ? "after:absolute after:inset-x-2 after:-bottom-2 after:h-0.5 after:rounded-full after:bg-[#8B5CF6]"
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
      className={`sticky top-0 z-50 border-b border-[#1F2937] bg-[#0B1220]/90 backdrop-blur transition-shadow motion-reduce:transition-none ${
        scrolled ? "shadow-sm" : "shadow-none"
      }`}
    >
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link href="/" className="shrink-0" aria-label="HRSignal home">
          <span className="flex items-center gap-2">
            <Image src={BRAND.logo} alt={BRAND.name} width={160} height={32} priority className="h-8 w-auto" />
            <span className="hidden text-sm font-semibold text-[#F9FAFB] sm:inline">{BRAND.name}</span>
          </span>
        </Link>

        {/* Header search (UI-only for now; forwards to /tools query) */}
        <form action="/tools" className="hidden w-full max-w-md items-center gap-2 lg:flex">
          <input
            className="h-11 w-full rounded-lg border border-[#1F2937] bg-[#111827] px-3 text-sm text-[#F9FAFB] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/35"
            name="q"
            placeholder="Search tools (e.g., payroll, attendance, Keka…)"
            aria-label="Search tools"
          />
          <button className="h-11 rounded-lg border border-[#1F2937] bg-[#0F172A] px-3 text-sm font-medium text-[#F9FAFB] hover:bg-[#111827]">
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
              <span className="ml-2 rounded-full bg-[#8B5CF6] px-2 py-0.5 text-xs font-semibold text-[#0B1220]">
                {count}
              </span>
            </Link>
          ) : null}

          <div className="ml-2 hidden sm:block">
            <ThemeToggle />
          </div>

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
