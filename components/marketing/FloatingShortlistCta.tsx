"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useCompare } from "@/lib/compare/useCompare";
import { ShortlistModal } from "@/components/shortlist/ShortlistModal";

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
  const { count: compareCount } = useCompare();
  const [visible, setVisible] = useState(false);

  const hidden = useMemo(() => {
    if (!pathname) return false;
    if (compareCount > 0) return true;
    return pathname === "/" || pathname.startsWith("/recommend") || pathname.startsWith("/admin");
  }, [pathname, compareCount]);

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

  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-50"
        aria-hidden={false}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group inline-flex h-12 w-12 items-center justify-center radius-pill bg-[#6F42C1] text-white shadow-[0_18px_52px_rgba(111,66,193,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_18px_52px_rgba(111,66,193,0.26)]"
          aria-label="Get my shortlist"
        >
          <span className="text-lg font-extrabold">+</span>
        </button>
      </div>

      <ShortlistModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
