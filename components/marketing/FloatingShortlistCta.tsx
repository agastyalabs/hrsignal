"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function getScrollProgress() {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
  const scrollHeight = doc.scrollHeight || document.body.scrollHeight || 0;
  const clientHeight = doc.clientHeight || window.innerHeight || 0;

  const denom = Math.max(1, scrollHeight - clientHeight);
  return scrollTop / denom;
}

export function FloatingShortlistCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const hidden = useMemo(() => {
    if (!pathname) return false;
    return pathname === "/" || pathname.startsWith("/recommend") || pathname.startsWith("/admin");
  }, [pathname]);

  useEffect(() => {
    if (hidden) return;

    const update = () => {
      const p = getScrollProgress();
      setVisible(p >= 0.4);
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [hidden]);

  if (hidden || !visible) return null;

  return (
    <div
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-50"
      aria-hidden={false}
    >
      <Link
        href="/recommend"
        className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        Get my shortlist
      </Link>
    </div>
  );
}
