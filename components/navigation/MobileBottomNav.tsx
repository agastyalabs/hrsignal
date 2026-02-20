"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ShortlistModal } from "@/components/shortlist/ShortlistModal";

function Item({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={
        "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-semibold " +
        (active ? "text-[var(--primary-blue)]" : "text-slate-600")
      }
    >
      <span className={"h-1.5 w-1.5 radius-pill " + (active ? "bg-[var(--primary-blue)]" : "bg-transparent")} />
      {label}
    </Link>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/85 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-6xl items-stretch px-2" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <Item href="/tools" label="Explore" active={pathname.startsWith("/tools") || pathname.startsWith("/categories")} />
          <Item href="/tools" label="Hot" active={false} />
          <Item href="/submit" label="Submit" active={pathname.startsWith("/submit")} />
          <button
            type="button"
            className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-semibold text-[#6F42C1]"
            onClick={() => setOpen(true)}
          >
            <span className="h-1.5 w-1.5 radius-pill bg-[#6F42C1]" />
            Shortlist
          </button>
        </div>
      </nav>

      <ShortlistModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
