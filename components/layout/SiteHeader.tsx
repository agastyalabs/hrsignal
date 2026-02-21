"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BRAND } from "@/config/brand";

const NAV = [
  { label: "Explore", href: "/tools" },
  { label: "Compare", href: "/compare" },
  { label: "Guides", href: "/guides" },
  { label: "For Vendors", href: "/submit" },
] as const;

function navItemClass(active: boolean) {
  return (
    "relative inline-flex h-10 items-center radius-pill px-4 text-sm font-semibold transition-all duration-200 " +
    (active
      ? "text-slate-900"
      : "text-slate-600 hover:-translate-y-0.5 hover:text-[var(--primary-blue)] hover:shadow-[var(--shadow-soft)]")
  );
}

export function SiteHeader() {
  const pathnameRaw = usePathname() || "/";
  const pathname = pathnameRaw !== "/" ? pathnameRaw.replace(/\/+$/, "") : pathnameRaw;

  const active = useMemo(() => {
    const is = (prefix: string) => pathname === prefix || pathname.startsWith(prefix + "/");
    return {
      explore: is("/tools") || is("/categories"),
      compare: is("/compare"),
      guides: is("/guides") || is("/resources") || is("/methodology") || is("/compliance"),
      vendors: is("/submit") || is("/vendors/claim"),
    };
  }, [pathname]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "shadow-soft" : "shadow-none"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" className="shrink-0" aria-label="HRSignal home" onClick={() => setMobileOpen(false)}>
          <span className="flex items-center">
            <Image
              src="/assets/logos/hrsignal-logo-light.svg"
              alt={BRAND.name}
              width={192}
              height={192}
              priority
              className="logo-light h-10 w-auto sm:h-11"
            />
            <Image
              src="/assets/logos/hrsignal-logo-v6.svg?v=6"
              alt={BRAND.name}
              width={192}
              height={192}
              priority
              className="logo-dark h-10 w-auto sm:h-11"
            />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <Link href="/tools" className={navItemClass(active.explore)}>
            Explore
          </Link>
          <Link href="/compare" className={navItemClass(active.compare)}>
            Compare
          </Link>
          <Link href="/guides" className={navItemClass(active.guides)}>
            Guides
          </Link>
          <Link href="/submit" className={navItemClass(active.vendors)}>
            For Vendors
          </Link>
        </nav>

        {/* Visible hamburger (<lg) */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-pill)] border border-slate-200 bg-white text-slate-900 shadow-soft hover:scale-[1.03] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Full-screen mobile menu */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            aria-label="Close menu backdrop"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute inset-0 bg-white/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold text-slate-900">Menu</div>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center radius-pill border border-slate-200 bg-white text-slate-900 shadow-soft"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                {NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMobileOpen(false)}
                    className="radius-card border border-slate-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-float"
                  >
                    <div className="text-base font-extrabold text-slate-900">{n.label}</div>
                    <div className="mt-1 text-sm text-slate-600">{n.href}</div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 text-xs text-slate-500">Tip: Use the bottom bar for one-tap navigation.</div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
