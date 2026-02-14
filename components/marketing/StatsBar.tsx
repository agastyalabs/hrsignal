"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

function useCountUp(to: number, durationMs = 900) {
  const reduce = useReducedMotion();
  const [val, setVal] = React.useState(reduce ? to : 0);

  React.useEffect(() => {
    if (reduce) {
      setVal(to);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, durationMs, reduce]);

  return val;
}

export type StatItem = {
  label: string;
  value: number;
  suffix?: string;
  detail?: string;
};

export function StatsBar({
  items,
  title = "Proof, not hype",
  subtitle = "A few signals we show openly so buyers can verify claims.",
}: {
  items: StatItem[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-base font-semibold text-[var(--text)]">{title}</div>
          <div className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</div>
        </div>
        <div className="text-xs font-semibold tracking-wide text-[var(--text-muted)]">UPDATED REGULARLY</div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((it) => (
          <StatCard key={it.label} item={it} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ item }: { item: StatItem }) {
  const v = useCountUp(item.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4"
    >
      <div className="text-3xl font-extrabold tracking-tight text-[var(--text)]">
        {v}
        {item.suffix ?? ""}
      </div>
      <div className="mt-1 text-xs font-semibold text-[var(--text-muted)]">{item.label}</div>
      {item.detail ? <div className="mt-2 text-xs text-[var(--text-muted)]">{item.detail}</div> : null}
    </motion.div>
  );
}
