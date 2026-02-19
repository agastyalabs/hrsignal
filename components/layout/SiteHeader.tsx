"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { BRAND } from "@/config/brand";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { useCompare } from "@/lib/compare/useCompare";

function navItemClass(active: boolean) {
  return `relative rounded-md px-2 py-1 transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] after:absolute after:inset-x-2 after:-bottom-2 after:h-0.5 after:rounded-full after:opacity-0 after:transition-opacity after:duration-200 after:bg-emerald-500 hover:after:opacity-100 ${
    active
      ? "text-[var(--text)] bg-emerald-500/20 after:opacity-100"
      : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
  }`;
}

function activeUnderline(active: boolean) {
  // underline handled in navItemClass (active + hover)
  return active ? "" : "";
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

function MenuGroup({ title, children }: { title: string; children: React.ReactNode }) {
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
      role="menuitem"
    >
      {label}
    </Link>
  );
}

function HeaderInner({ pathname }: { pathname: string }) {
  const { count, slugs } = useCompare();

  const active = useMemo(() => {
    const is = (prefix: string) => pathname === prefix || pathname.startsWith(prefix + "/");
    return {
      tools: is("/tools"),
      vendors: is("/vendors"),
      categories: is("/categories"),
      resources:
        is("/resources") ||
        is("/methodology") ||
        is("/compliance") ||
        pathname === "/india-payroll-risk-checklist" ||
        pathname === "/payroll-risk-scanner" ||
        pathname === "/hrms-fit-score",
      compare: is("/compare"),
      recommend: is("/recommend"),
    };
  }, [pathname]);

  const compareHref = count ? `/compare?tools=${encodeURIComponent(slugs.join(","))}` : null;

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);

  // Desktop controlled menus (prevents overlap + improves stability)
  const [openMenu, setOpenMenu] = useState<null | "categories" | "resources">(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const categoriesMenuRef = useRef<HTMLDivElement | null>(null);
  const resourcesMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openMenu) return;

    const onDocMouseDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      const inHeader = headerRef.current?.contains(t as Node) ?? false;
      const inMenu =
        (categoriesMenuRef.current?.contains(t as Node) ?? false) ||
        (resourcesMenuRef.current?.contains(t as Node) ?? false);
      if (!inHeader && !inMenu) setOpenMenu(null);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };

    // Close on scroll to avoid jitter/misalignment.
    const onScrollClose = () => setOpenMenu(null);

    document.addEventListener("mousedown", onDocMouseDown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScrollClose, { passive: true });

    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScrollClose);
    };
  }, [openMenu]);

  // Mobile sheet: Esc to close
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Mobile sheet: lock scroll
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
      ref={headerRef}
      className={`sticky top-0 z-50 border-b border-[var(--border-soft)] bg-[var(--header-bg)] transition-shadow motion-reduce:transition-none ${
        scrolled ? "shadow-sm" : "shadow-none"
      }`}
    >
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link href="/" className="shrink-0" aria-label="HRSignal home" onClick={() => setOpenMenu(null)}>
          <span className="flex items-center">
            <Image
              src="/assets/logos/hrsignal-logo-v6.svg?v=6"
              alt={BRAND.name}
              width={192}
              height={192}
              priority
              className="h-14 w-56 sm:h-16 sm:w-64"
              style={{
                filter:
                  "drop-shadow(0 0 22px rgba(16,185,129,0.65)) drop-shadow(0 0 58px rgba(16,185,129,0.28))",
              }}
            />
          </span>
        </Link>

        {/* Header search (non-home pages only) */}
        {pathname !== "/" ? (
          <form action="/tools" className="hidden w-full max-w-md lg:flex" onSubmit={() => setOpenMenu(null)}>
            <input
              className="h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              name="q"
              placeholder="Search tools (e.g., payroll, attendance, Keka…)"
              aria-label="Search tools"
            />
          </form>
        ) : null}

        {/* Desktop nav */}
        <nav className="relative hidden shrink-0 items-center gap-1 text-sm lg:flex" aria-label="Primary">
          <NavLink href="/tools" active={active.tools} onClick={() => setOpenMenu(null)}>
            Tools
          </NavLink>
          <NavLink href="/vendors" active={active.vendors} onClick={() => setOpenMenu(null)}>
            Vendors
          </NavLink>

          {/* Categories menu */}
          <div className="relative">
            <button
              type="button"
              className={`${navItemClass(active.categories)} ${activeUnderline(active.categories)}`}
              aria-haspopup="menu"
              aria-expanded={openMenu === "categories"}
              onClick={() => setOpenMenu((v) => (v === "categories" ? null : "categories"))}
            >
              Categories
            </button>
            {openMenu === "categories" ? (
              <div
                ref={categoriesMenuRef}
                className="absolute left-1/2 mt-2 w-72 -translate-x-1/2 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-2 shadow-none transition-all duration-200 ease-out"
                role="menu"
              >
                <MenuGroup title="Browse categories">
                  <MenuLink href="/categories" label="View all categories" onClick={() => setOpenMenu(null)} />
                </MenuGroup>
                <div className="my-2 h-px w-full bg-[var(--border-soft)]" />
                <MenuGroup title="Popular categories">
                  <MenuLink href="/categories/payroll-india" label="Payroll & compliance" onClick={() => setOpenMenu(null)} />
                  <MenuLink href="/categories/hrms" label="HRMS / Core HR" onClick={() => setOpenMenu(null)} />
                  <MenuLink href="/categories/attendance" label="Attendance / Leave" onClick={() => setOpenMenu(null)} />
                  <MenuLink href="/categories/ats" label="ATS / Hiring" onClick={() => setOpenMenu(null)} />
                  <MenuLink href="/categories/performance" label="Performance / OKR" onClick={() => setOpenMenu(null)} />
                </MenuGroup>
              </div>
            ) : null}
          </div>

          {/* Resources menu */}
          <div className="relative">
            <button
              type="button"
              className={`${navItemClass(active.resources)} ${activeUnderline(active.resources)}`}
              aria-haspopup="menu"
              aria-expanded={openMenu === "resources"}
              onClick={() => setOpenMenu((v) => (v === "resources" ? null : "resources"))}
            >
              Resources
            </button>
            {openMenu === "resources" ? (
              <div
                ref={resourcesMenuRef}
                className="absolute left-1/2 mt-2 w-80 -translate-x-1/2 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-2 shadow-none transition-all duration-200 ease-out"
                role="menu"
              >
                <MenuGroup title="Buyer guides">
                  <MenuLink href="/resources" label="Browse all resources" onClick={() => setOpenMenu(null)} />
                  <MenuLink href="/methodology" label="Methodology" onClick={() => setOpenMenu(null)} />
                  <MenuLink href="/categories/payroll-india" label="Payroll India guide" onClick={() => setOpenMenu(null)} />
                  <MenuLink href="/best-payroll-software-small-business-india" label="Best payroll software (SMBs)" onClick={() => setOpenMenu(null)} />
                </MenuGroup>
                <div className="my-2 h-px w-full bg-[var(--border-soft)]" />
                <MenuGroup title="Compliance guides">
                  <MenuLink href="/compliance" label="Compliance Guides" onClick={() => setOpenMenu(null)} />
                  <MenuLink href="/compliance/pf-compliance-guide" label="PF Guide" onClick={() => setOpenMenu(null)} />
                  <MenuLink href="/compliance/esi-complete-guide" label="ESI Guide" onClick={() => setOpenMenu(null)} />
                  <MenuLink href="/compliance/pt-multi-state-guide" label="PT Multi-State" onClick={() => setOpenMenu(null)} />
                  <MenuLink href="/compliance/tds-payroll-guide" label="TDS Guide" onClick={() => setOpenMenu(null)} />
                </MenuGroup>
                <div className="my-2 h-px w-full bg-[var(--border-soft)]" />
                <MenuGroup title="Checklists & tools">
                  <MenuLink href="/india-payroll-risk-checklist" label="India payroll risk checklist" onClick={() => setOpenMenu(null)} />
                  <MenuLink href="/payroll-risk-scanner" label="Payroll risk scanner" onClick={() => setOpenMenu(null)} />
                  <MenuLink href="/hrms-fit-score" label="HRMS fit score" onClick={() => setOpenMenu(null)} />
                  <MenuLink href="/report" label="Decision report" onClick={() => setOpenMenu(null)} />
                </MenuGroup>
              </div>
            ) : null}
          </div>

          {compareHref ? (
            <Link
              className={`${navItemClass(active.compare)} ${activeUnderline(active.compare)}`}
              href={compareHref}
              aria-current={active.compare ? "page" : undefined}
              onClick={() => setOpenMenu(null)}
            >
              Compare
              <span className="ml-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-2 py-0.5 text-xs font-semibold text-[var(--text)]">
                {count}
              </span>
            </Link>
          ) : null}

          <div className="ml-2">
            <ButtonLink href="/recommend" variant="primary" size="sm" onClick={() => setOpenMenu(null)}>
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
          onClick={() => {
            setOpenMenu(null);
            setMobileOpen((v) => !v);
          }}
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
                    <MenuLink href="/categories/payroll-india" label="Payroll & compliance" onClick={() => setMobileOpen(false)} />
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
                    <MenuLink href="/compliance" label="Compliance Guides" onClick={() => setMobileOpen(false)} />
                    <div className="mt-2 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-2">
                      <MenuLink href="/compliance/pf-compliance-guide" label="PF Guide" onClick={() => setMobileOpen(false)} />
                      <MenuLink href="/compliance/esi-complete-guide" label="ESI Guide" onClick={() => setMobileOpen(false)} />
                      <MenuLink href="/compliance/pt-multi-state-guide" label="PT Multi-State" onClick={() => setMobileOpen(false)} />
                      <MenuLink href="/compliance/tds-payroll-guide" label="TDS Guide" onClick={() => setMobileOpen(false)} />
                    </div>
                  </div>
                </details>

                <details className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--text)]">Tools to speed evaluation</summary>
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

export function SiteHeader() {
  const rawPathname = usePathname() || "/";
  const pathname = rawPathname !== "/" ? rawPathname.replace(/\/+$/, "") : rawPathname;

  // Keyed remount ensures menus close on navigation without setState-in-effect.
  return <HeaderInner key={pathname} pathname={pathname} />;
}
