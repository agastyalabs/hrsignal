"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export type HotCarouselItem = {
  slug: string;
  name: string;
  weekly: number;
  tagline?: string | null;
};

export function HotCarousel({ items }: { items: HotCarouselItem[] }) {
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const doubled = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let raf = 0;
    let x = 0;

    const tick = () => {
      if (!paused) {
        x += 0.5;
        // wrap around half the track
        const half = el.scrollWidth / 2;
        if (x >= half) x = 0;
        el.style.transform = `translateX(${-x}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  return (
    <div
      className="overflow-hidden radius-card border border-slate-200 bg-white shadow-soft"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-extrabold text-slate-900">Hot this week</div>
            <div className="mt-1 text-xs text-slate-500">Auto-scroll. Hover to pause.</div>
          </div>
          <div className="text-sm font-bold text-emerald-600">🔥</div>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <div ref={trackRef} className="flex w-max gap-3 will-change-transform">
            {doubled.map((t, idx) => (
              <Link
                key={`${t.slug}-${idx}`}
                href={`/tools/${t.slug}`}
                className="min-w-[260px] radius-inner border border-slate-200 bg-slate-50 p-4 transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate text-sm font-extrabold text-slate-900">{t.name}</div>
                  <span className="radius-pill bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700">+{t.weekly}</span>
                </div>
                {t.tagline ? <div className="mt-2 text-xs leading-relaxed text-slate-600">{t.tagline}</div> : null}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
