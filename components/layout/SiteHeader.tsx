"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { BRAND } from "@/config/brand";
// Note: header uses its own max-width (7xl) to match BASE navbar spec.
import { ButtonLink } from "@/components/ui/Button";
import { useCompare } from "@/lib/compare/useCompare";

type NavGroupKey = "explore" | "compare" | "guides" | "vendors";

type NavItem = {
  title: string;
  href: string;
  description?: string;
  section?: string;
};

type NavConfig = Record<NavGroupKey, NavItem[]>;

const NAV: NavConfig = {
  explore: [
    { title: "Tools", href: "/tools", description: "Browse verified HRMS & payroll tools." },
    { title: "Vendors", href: "/vendors", description: "Vendor profiles + evidence links." },
    { title: "Categories", href: "/categories", description: "Start from a module (Payroll, HRMS, ATS…)." },
  ],
  compare: [
    { title: "Compare tools", href: "/compare", description: "Side-by-side comparison with risk visibility." },
    { title: "Compare vendors", href: "/compare/vendors", description: "Compare vendors across categories." },
  ],
  guides: [
    { title: "Resources", href: "/resources", description: "Buyer-first evaluation guides and checklists." },
    { title: "Methodology", href: "/methodology", description: "How fit scores and verification work." },
    { title: "India payroll risk checklist", href: "/india-payroll-risk-checklist", description: "Printable checklist to carry into demos." },
    { title: "Payroll risk scanner", href: "/payroll-risk-scanner", description: "Quick risk tier + targeted validation questions." },
    { title: "HRMS fit score", href: "/hrms-fit-score", description: "Structured fit snapshot for HRMS buyers." },
  ],
  vendors: [
    { title: "Claim your vendor profile", href: "/vendors/claim", description: "Verify your listing and add evidence links." },
  ],
};

function navItemClass(active: boolean) {
  return `relative inline-flex h-10 items-center radius-pill px-4 text-sm font-semibold transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
    active ? "text-slate-900" : "text-slate-600 hover:text-[var(--primary-blue)]"
  }`;
}

function MenuLink({
  href,
  label,
  description,
  onClick,
}: {
  href: string;
  label: string;
  description?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative block radius-inner px-5 py-4 text-sm text-slate-700 hover:bg-blue-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      role="menuitem"
    >
      <div className="font-semibold text-slate-900">{label}</div>
      {description ? <div className="mt-1 text-xs leading-5 text-slate-500">{description}</div> : null}
    </Link>
  );
}

function groupBySection(items: NavItem[]) {
  const out = new Map<string, NavItem[]>();
  for (const item of items) {
    const key = item.section ?? "";
    out.set(key, [...(out.get(key) ?? []), item]);
  }
  return out;
}

function groupLabel(key: NavGroupKey) {
  return key === "explore" ? "Explore" : key === "compare" ? "Compare" : key === "guides" ? "Guides" : "For Vendors";
}

function panelCols(key: NavGroupKey) {
  // Keep panels compact to avoid clutter/overflow.
  if (key === "explore") return "lg:grid-cols-2";
  if (key === "guides") return "lg:grid-cols-2";
  return "lg:grid-cols-2";
}

function HeaderInner({ pathname }: { pathname: string }) {
  const { count, slugs } = useCompare();

  const active = useMemo(() => {
    const is = (prefix: string) => pathname === prefix || pathname.startsWith(prefix + "/");
    return {
      explore: is("/tools") || is("/vendors") || is("/categories"),
      compare: is("/compare"),
      guides:
        is("/resources") ||
        is("/methodology") ||
        is("/compliance") ||
        pathname === "/india-payroll-risk-checklist" ||
        pathname === "/payroll-risk-scanner" ||
        pathname === "/hrms-fit-score" ||
        pathname === "/report",
      vendors: pathname === "/vendors/claim",
      recommend: is("/recommend"),
    };
  }, [pathname]);

  const compareHref = count ? `/compare?tools=${encodeURIComponent(slugs.join(","))}` : "/compare";

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);

  // Desktop controlled menus
  const [openMenu, setOpenMenu] = useState<null | NavGroupKey>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const hoverCloseTimer = useRef<number | null>(null);

  const allowHoverOpen = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches ?? false;
  }, []);

  useEffect(() => {
    if (!openMenu) return;

    const onDocMouseDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      const inHeader = headerRef.current?.contains(t as Node) ?? false;
      const inMenu = menuRef.current?.contains(t as Node) ?? false;
      if (!inHeader && !inMenu) setOpenMenu(null);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };

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
      className={`sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md transition-all duration-300 motion-reduce:transition-none ${
        scrolled ? "shadow-soft" : "shadow-none"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" className="shrink-0" aria-label="HRSignal home" onClick={() => setOpenMenu(null)}>
          <span className="flex items-center">
            <Image
              src={BRAND.logo}
              alt={BRAND.name}
              width={192}
              height={40}
              priority
              className="h-10 w-auto sm:h-11"
            />
          </span>
        </Link>

        {/* Header search (single primary search entry point) */}
        <form action="/tools" className="hidden w-full max-w-md lg:flex" onSubmit={() => setOpenMenu(null)}>
          <input
            className="h-11 w-full rounded-[var(--radius-pill)] border border-[rgba(15,23,42,0.12)] bg-white/70 px-4 text-sm text-[var(--text-main)] placeholder:text-[rgba(100,116,139,0.85)] shadow-[0_1px_0_rgba(255,255,255,0.7)_inset] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.35)]"
            name="q"
            placeholder="Search tools (e.g., payroll, attendance, Keka…)"
            aria-label="Search tools"
          />
        </form>

        {/* Desktop nav */}
        <nav className="relative hidden shrink-0 items-center gap-1 text-sm lg:flex" aria-label="Primary">
          {(Object.keys(NAV) as NavGroupKey[]).map((key) => {
            const label = groupLabel(key);

            const isActive =
              key === "explore" ? active.explore : key === "compare" ? active.compare : key === "guides" ? active.guides : active.vendors;

            const panelId = `nav-panel-${key}`;
            const buttonId = `nav-button-${key}`;

            const items =
              key === "compare" && count
                ? [{ title: "Compare (selected)", href: compareHref, description: "Open compare with your selected tools." }, ...NAV[key]]
                : NAV[key];

            const sections = Array.from(groupBySection(items).entries());

            return (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => {
                  if (!allowHoverOpen) return;
                  if (hoverCloseTimer.current) window.clearTimeout(hoverCloseTimer.current);
                  setOpenMenu(key);
                }}
                onMouseLeave={() => {
                  if (!allowHoverOpen) return;
                  if (hoverCloseTimer.current) window.clearTimeout(hoverCloseTimer.current);
                  hoverCloseTimer.current = window.setTimeout(() => setOpenMenu(null), 120);
                }}
              >
                <button
                  id={buttonId}
                  type="button"
                  className={navItemClass(isActive)}
                  aria-haspopup="menu"
                  aria-expanded={openMenu === key}
                  aria-controls={panelId}
                  onClick={() => setOpenMenu((v) => (v === key ? null : key))}
                >
                  {label}
                  {key === "compare" && count ? (
                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-[var(--primary-blue)]">
                      {count}
                    </span>
                  ) : null}
                </button>

                {openMenu === key ? (
                  <div
                    id={panelId}
                    ref={menuRef}
                    className={`absolute mt-4 radius-card glass-panel p-4 shadow-float ${
                      key === "explore"
                        ? "left-0 w-[min(640px,calc(100vw-2rem))]"
                        : "left-1/2 w-[min(840px,calc(100vw-2rem))] -translate-x-1/2"
                    }`}
                    style={{ maxHeight: "70vh" }}
                    role="menu"
                    aria-labelledby={buttonId}
                  >
                    <div className="max-h-[70vh] overflow-auto p-1">
                      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${panelCols(key)}`}>
                        {sections.map(([section, sectionItems]) => (
                          <div key={section || "_"} className="min-w-0">
                            {section ? (
                              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                {section}
                              </div>
                            ) : null}
                            <div className="mt-1 space-y-1">
                              {sectionItems.map((item) => (
                                <MenuLink
                                  key={item.href}
                                  href={item.href}
                                  label={item.title}
                                  description={item.description}
                                  onClick={() => setOpenMenu(null)}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}

          <div className="ml-3">
            <ButtonLink
              href="/recommend"
              variant="primary"
              size="sm"
              onClick={() => setOpenMenu(null)}
              className="rounded-[var(--radius-pill)] px-5 py-3"
            >
              Get my shortlist
            </ButtonLink>
          </div>
        </nav>

        {/* Mobile trigger */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-pill)] border border-[rgba(15,23,42,0.12)] bg-white/70 text-[var(--text-main)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.35)] lg:hidden"
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
      </div>

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
                  Get my shortlist
                </ButtonLink>
                <div className="mt-2 text-xs text-[var(--text-muted)]">Privacy-first. No automatic vendor sharing.</div>
              </div>

              <div className="mt-4 space-y-3">
                {(Object.keys(NAV) as NavGroupKey[]).map((key) => {
                  const label = groupLabel(key);

                  const items =
                    key === "compare" && count
                      ? [{ title: "Compare (selected)", href: compareHref, description: "Open compare with your selected tools." }, ...NAV[key]]
                      : NAV[key];

                  return (
                    <details
                      key={key}
                      className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4"
                      open={key === "explore"}
                    >
                      <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--text)]">{label}</summary>
                      <div className="mt-3 space-y-1">
                        {items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-md px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </details>
                  );
                })}

                <details className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--text)]">Legal</summary>
                  <div className="mt-3 space-y-1">
                    <Link
                      href="/privacy"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    >
                      Privacy
                    </Link>
                    <Link
                      href="/terms"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    >
                      Terms
                    </Link>
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
