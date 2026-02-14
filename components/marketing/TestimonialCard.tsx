"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/Card";

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  company?: string;
};

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <Card className="relative overflow-hidden p-6">
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[rgba(111,66,193,0.14)] blur-3xl" />

      <div className="relative">
        <motion.blockquote
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="text-sm leading-7 text-[var(--text-muted)]"
        >
          <span className="text-[var(--text)]">“</span>
          {t.quote}
          <span className="text-[var(--text)]">”</span>
        </motion.blockquote>

        <div className="mt-5 flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-[var(--text)]">{t.name}</div>
            <div className="mt-1 text-xs text-[var(--text-muted)]">
              {t.title}
              {t.company ? <span> · {t.company}</span> : null}
            </div>
          </div>

          <div className="shrink-0 rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
            India payroll
          </div>
        </div>
      </div>
    </Card>
  );
}
