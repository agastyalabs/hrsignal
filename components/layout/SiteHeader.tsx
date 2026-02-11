"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BRAND } from "@/config/brand";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { useCompare } from "@/lib/compare/useCompare";

function navItemClass(active: boolean) {
  return `relative rounded-md px-2 py-1 transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
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
  onClick,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      className={`${navItemClass(active)} ${activeUnderline(active)}`}
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

function MenuGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="px-3 py-2 text-xs font-semibold tracking-wide text-[var(--text-muted)]">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function MenuLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-md px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      {label}
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
      resources: is("/resources") || is("/methodology") || pathname === "/india-payroll-risk-checklist" || pathname === "/payroll-risk-scanner" || pathname === "/hrms-fit-score",
      compare: is("/compare"),
      recommend: is("/recommend"),
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    // Lock scroll when mobile menu is open.
    if (!mobileOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [mobileOpen]);

  const compareHref = count ? `/compare?tools=${encodeURIComponent(slugs.join(","))}` : null;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[var(--border-soft)] bg-[var(--header-bg)] transition-shadow motion-reduce:transition-none ${
        scrolled ? "shadow-sm" : "shadow-none"
      }`}
    >
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link href="/" className="shrink-0" aria-label="HRSignal home">
          <span className="flex items-center gap-3 whitespace-nowrap">
            <Image src={BRAND.logo} alt={BRAND.name} width={208} height={44} priority className="h-9 w-auto sm:h-10" />
            <span className="hidden text-base font-semibold tracking-tight text-[var(--text)] sm:inline">{BRAND.name}</span>
          </span>
        </Link>

        {/* Header search (non-home pages only) */}
        {pathname !== "/" ? (
          <form action="/tools" className="hidden w-full max-w-md lg:flex">
            <input
              className="h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              name="q"
              placeholder="Search tools (e.g., payroll, attendance, Keka…)"
              aria-label="Search tools"
            />
          </form>
        ) : null}

        {/* Desktop nav */}
        <nav className="hidden shrink-0 items-center gap-1 text-sm lg:flex" aria-label="Primary">
          <NavLink href="/tools" active={active.tools}>
            Tools
          </NavLink>
          <NavLink href="/vendors" active={active.vendors}>
            Vendors
          </NavLink>

          {/* Categories dropdown */}
          <details className="relative">
            <summary
              className={`${navItemClass(active.categories)} ${activeUnderline(active.categories)} cursor-pointer list-none`}
            >
              Categories
            </summary>
            <div className="absolute left-0 mt-2 w-72 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-2 shadow-none">
              <MenuGroup title="Browse categories">
                <MenuLink href="/categories" label="View all categories" />
              </MenuGroup>
              <div className="my-2 h-px w-full bg-[var(--border-soft)]" />
              <MenuGroup title="Popular categories">
                <MenuLink href="/categories/payroll" label="Payroll & compliance" />
                <MenuLink href="/categories/hrms" label="HRMS / Core HR" />
                <MenuLink href="/categories/attendance" label="Attendance / Leave" />
                <MenuLink href="/categories/ats" label="ATS / Hiring" />
                <MenuLink href="/categories/performance" label="Performance / OKR" />
              </MenuGroup>
            </div>
          </details>

          {/* Resources dropdown */}
          <details className="relative">
            <summary
              className={`${navItemClass(active.resources)} ${activeUnderline(active.resources)} cursor-pointer list-none`}
            >
              Resources
            </summary>
            <div className="absolute left-0 mt-2 w-80 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-2 shadow-none">
              <MenuGroup title="Buyer guides">
                <MenuLink href="/resources" label="Browse all resources" />
                <MenuLink href="/methodology" label="Methodology" />
                <MenuLink href="/categories/payroll-india" label="Payroll India guide" />
                <MenuLink href="/best-payroll-software-small-business-india" label="Best payroll software (SMBs)" />
              </MenuGroup>
              <div className="my-2 h-px w-full bg-[var(--border-soft)]" />
              <MenuGroup title="Checklists & tools">
                <MenuLink href="/india-payroll-risk-checklist" label="India payroll risk checklist" />
                <MenuLink href="/payroll-risk-scanner" label="Payroll risk scanner" />
                <MenuLink href="/hrms-fit-score" label="HRMS fit score" />
                <MenuLink href="/report" label="Decision report" />
              </MenuGroup>
            </div>
          </details>

          {compareHref ? (
            <Link
              className={`${navItemClass(active.compare)} ${activeUnderline(active.compare)}`}
              href={compareHref}
              aria-current={active.compare ? "page" : undefined}
            >
              Compare
              <span className="ml-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-2 py-0.5 text-xs font-semibold text-[var(--text)]">
                {count}
              </span>
            </Link>
          ) : null}

          <div className="ml-2">
            <ButtonLink href="/recommend" variant="primary" size="sm">
              Get a shortlist
            </ButtonLink>
          </div>
        </nav>

        {/* Mobile trigger */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] text-[var(--text)] hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] lg:hidden"
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
      </Container>

      {/* Mobile menu sheet */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(0,0,0,0.55)]"
            aria-label="Close menu backdrop"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-[420px] border-l border-[var(--border-soft)] bg-[var(--bg)]">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
              <div className="text-sm font-semibold text-[var(--text)]">Menu</div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] text-[var(--text)] hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="h-[calc(100%-64px)] overflow-y-auto px-5 py-5">
              <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4">
                <ButtonLink
                  href="/recommend"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Get a shortlist
                </ButtonLink>
                <div className="mt-2 text-xs text-[var(--text-muted)]">Privacy-first. No automatic vendor sharing.</div>
              </div>

              <div className="mt-4 space-y-3">
                <details className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4" open>
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--text)]">Browse</summary>
                  <div className="mt-3 space-y-1">
                    <MenuLink href="/tools" label="Tools" onClick={() => setMobileOpen(false)} />
                    <MenuLink href="/vendors" label="Vendors" onClick={() => setMobileOpen(false)} />
                    <MenuLink href="/categories" label="Categories" onClick={() => setMobileOpen(false)} />
                  </div>
                </details>

                <details className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--text)]">Categories</summary>
                  <div className="mt-3 space-y-1">
                    <MenuLink href="/categories/payroll" label="Payroll & compliance" onClick={() => setMobileOpen(false)} />
                    <MenuLink href="/categories/hrms" label="HRMS / Core HR" onClick={() => setMobileOpen(false)} />
                    <MenuLink href="/categories/attendance" label="Attendance / Leave" onClick={() => setMobileOpen(false)} />
                    <MenuLink href="/categories/ats" label="ATS / Hiring" onClick={() => setMobileOpen(false)} />
                    <MenuLink href="/categories/performance" label="Performance / OKR" onClick={() => setMobileOpen(false)} />
                    <MenuLink href="/categories/payroll-india" label="Payroll India guide" onClick={() => setMobileOpen(false)} />
                  </div>
                </details>

                <details className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--text)]">Learn</summary>
                  <div className="mt-3 space-y-1">
                    <MenuLink href="/resources" label="Resources" onClick={() => setMobileOpen(false)} />
                    <MenuLink href="/methodology" label="Methodology" onClick={() => setMobileOpen(false)} />
                  </div>
                </details>

                <details className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--text)]">
                    Tools to speed evaluation
                  </summary>
                  <div className="mt-3 space-y-1">
                    <MenuLink
                      href="/india-payroll-risk-checklist"
                      label="India payroll risk checklist"
                      onClick={() => setMobileOpen(false)}
                    />
                    <MenuLink href="/payroll-risk-scanner" label="Payroll risk scanner" onClick={() => setMobileOpen(false)} />
                    <MenuLink href="/hrms-fit-score" label="HRMS fit score" onClick={() => setMobileOpen(false)} />
                    <MenuLink href="/report" label="Decision report" onClick={() => setMobileOpen(false)} />
                  </div>
                </details>

                {compareHref ? (
                  <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4">
                    <MenuLink href={compareHref} label="Compare" onClick={() => setMobileOpen(false)} />
                    <MenuLink href="/compare/vendors" label="Compare vendors" onClick={() => setMobileOpen(false)} />
                  </div>
                ) : null}

                <details className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--text)]">Legal</summary>
                  <div className="mt-3 space-y-1">
                    <MenuLink href="/privacy" label="Privacy" onClick={() => setMobileOpen(false)} />
                    <MenuLink href="/terms" label="Terms" onClick={() => setMobileOpen(false)} />
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
