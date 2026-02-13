"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  return <Image src={`/icons/${name}.svg`} alt="" width={24} height={24} className={className} aria-hidden />;
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--color-primary)] transition-all duration-200 hover:bg-[rgba(11,95,111,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
    >
      {children}
    </Link>
  );
}

function MenuLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-md px-3 py-2 text-sm text-[var(--color-dark)] transition-all duration-200 hover:bg-[rgba(11,95,111,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      role="menuitem"
    >
      {children}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState<null | "browse" | "learn">(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!headerRef.current?.contains(t)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Mobile: lock scroll
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [mobileOpen]);

  const desktopMenuClass =
    "absolute left-1/2 top-full mt-2 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-[rgba(100,116,139,0.25)] bg-[var(--color-white)] p-2 shadow-[0_16px_60px_rgba(0,0,0,0.12)] transition-all duration-200";

  const logo = useMemo(() => {
    // If you have a v2 logo file, change it here.
    return "/assets/logos/new-hrsignal.svg";
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-[rgba(100,116,139,0.20)] bg-[var(--color-white)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-white)]/80"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 sm:px-6">
        {/* Left: logo */}
        <Link href="/" aria-label="HRSignal home" className="shrink-0">
          <Image src={logo} alt="HRSignal" width={180} height={40} priority className="h-10 w-auto" />
        </Link>

        {/* Center: primary nav */}
        <nav className="hidden min-w-0 items-center justify-center gap-2 md:flex" aria-label="Primary">
          <NavLink href="/recommend">Find Your Tool</NavLink>

          <div className="relative">
            <button
              type="button"
              className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--color-primary)] transition-all duration-200 hover:bg-[rgba(11,95,111,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              aria-haspopup="menu"
              aria-expanded={open === "browse"}
              onClick={() => setOpen((v) => (v === "browse" ? null : "browse"))}
            >
              Browse
              <span className="ml-2 inline-flex align-middle">
                <Icon name="chevron-down" className="h-4 w-4" />
              </span>
            </button>
            {open === "browse" ? (
              <div role="menu" className={desktopMenuClass}>
                <MenuLink href="/tools" onClick={() => setOpen(null)}>
                  Tools
                </MenuLink>
                <MenuLink href="/vendors" onClick={() => setOpen(null)}>
                  Vendors
                </MenuLink>
                <MenuLink href="/categories" onClick={() => setOpen(null)}>
                  Categories
                </MenuLink>
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--color-primary)] transition-all duration-200 hover:bg-[rgba(11,95,111,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              aria-haspopup="menu"
              aria-expanded={open === "learn"}
              onClick={() => setOpen((v) => (v === "learn" ? null : "learn"))}
            >
              Learn
              <span className="ml-2 inline-flex align-middle">
                <Icon name="chevron-down" className="h-4 w-4" />
              </span>
            </button>
            {open === "learn" ? (
              <div role="menu" className={desktopMenuClass}>
                <MenuLink href="/methodology" onClick={() => setOpen(null)}>
                  Methodology
                </MenuLink>
                <MenuLink href="/resources" onClick={() => setOpen(null)}>
                  Guides
                </MenuLink>
                <MenuLink href="/india-payroll-risk-checklist" onClick={() => setOpen(null)}>
                  Checklist
                </MenuLink>
                <MenuLink href="/payroll-risk-scanner" onClick={() => setOpen(null)}>
                  Scanner
                </MenuLink>
              </div>
            ) : null}
          </div>
        </nav>

        {/* Right: account + CTA */}
        <div className="hidden items-center justify-end gap-3 md:flex">
          <button
            type="button"
            aria-label="Account"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(100,116,139,0.25)] text-[var(--color-neutral)] transition-all duration-200 hover:bg-[rgba(11,95,111,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            <Icon name="user" className="h-6 w-6" />
          </button>

          <Link
            href="/recommend"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--color-accent)] px-5 text-sm font-bold text-[var(--color-white)] transition-all duration-200 hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[rgba(100,116,139,0.25)] text-[var(--color-primary)] transition-all duration-200 hover:bg-[rgba(11,95,111,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => {
            setOpen(null);
            setMobileOpen((v) => !v);
          }}
        >
          <Icon name={mobileOpen ? "x-close" : "menu"} className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Close menu backdrop"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-[420px] bg-[var(--color-white)] p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-[var(--color-primary)]">Menu</div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(100,116,139,0.25)] text-[var(--color-primary)] transition-all duration-200 hover:bg-[rgba(11,95,111,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <Icon name="x-close" className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <Link
                href="/recommend"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[var(--color-accent)] px-6 text-sm font-bold text-[var(--color-white)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                Get Started
              </Link>

              <details className="rounded-xl border border-[rgba(100,116,139,0.25)] p-4" open>
                <summary className="cursor-pointer list-none text-sm font-bold text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
                  Browse
                </summary>
                <div className="mt-3 space-y-1">
                  <MenuLink href="/tools" onClick={() => setMobileOpen(false)}>
                    Tools
                  </MenuLink>
                  <MenuLink href="/vendors" onClick={() => setMobileOpen(false)}>
                    Vendors
                  </MenuLink>
                  <MenuLink href="/categories" onClick={() => setMobileOpen(false)}>
                    Categories
                  </MenuLink>
                </div>
              </details>

              <details className="rounded-xl border border-[rgba(100,116,139,0.25)] p-4">
                <summary className="cursor-pointer list-none text-sm font-bold text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
                  Learn
                </summary>
                <div className="mt-3 space-y-1">
                  <MenuLink href="/methodology" onClick={() => setMobileOpen(false)}>
                    Methodology
                  </MenuLink>
                  <MenuLink href="/resources" onClick={() => setMobileOpen(false)}>
                    Guides
                  </MenuLink>
                  <MenuLink href="/india-payroll-risk-checklist" onClick={() => setMobileOpen(false)}>
                    Checklist
                  </MenuLink>
                  <MenuLink href="/payroll-risk-scanner" onClick={() => setMobileOpen(false)}>
                    Scanner
                  </MenuLink>
                </div>
              </details>

              <div className="rounded-xl border border-[rgba(100,116,139,0.25)] p-4">
                <div className="text-sm font-bold text-[var(--color-primary)]">Account</div>
                <div className="mt-3 flex items-center gap-3 text-sm text-[var(--color-neutral)]">
                  <Icon name="user" className="h-6 w-6" />
                  <span>Sign in / manage profile</span>
                </div>
              </div>

              <div className="text-xs text-[var(--color-neutral)]">
                WCAG AA: focus rings enabled, keyboard accessible summaries, and large tap targets.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
