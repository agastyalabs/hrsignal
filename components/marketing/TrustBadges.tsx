"use client";

import * as React from "react";
import { motion } from "framer-motion";

export type TrustBadge = {
  title: string;
  subtitle: string;
  tone?: "security" | "privacy" | "process" | "neutral";
};

function toneClass(tone: TrustBadge["tone"]) {
  if (tone === "security") return "border-[rgba(34,197,94,0.30)] bg-[rgba(34,197,94,0.10)]";
  if (tone === "privacy") return "border-[rgba(59,130,246,0.30)] bg-[rgba(59,130,246,0.10)]";
  if (tone === "process") return "border-[rgba(245,158,11,0.30)] bg-[rgba(245,158,11,0.10)]";
  return "border-[var(--border-soft)] bg-[var(--surface-2)]";
}

export function TrustBadges({
  badges = [
    { title: "SOC 2", subtitle: "Security posture", tone: "security" },
    { title: "GDPR-ready", subtitle: "Privacy-by-design", tone: "privacy" },
    { title: "No paid ranking", subtitle: "Buyer-first", tone: "neutral" },
    { title: "Evidence links", subtitle: "Verify claims", tone: "process" },
  ],
}: {
  badges?: TrustBadge[];
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
      <div className="text-base font-semibold text-[var(--text)]">Trust & compliance signals</div>
      <div className="mt-1 text-sm text-[var(--text-muted)]">
        Built for India payroll buyers who need verification, not marketing.
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((b) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`rounded-[var(--radius-md)] border p-4 ${toneClass(b.tone)}`}
          >
            <div className="text-sm font-semibold text-[var(--text)]">{b.title}</div>
            <div className="mt-1 text-xs text-[var(--text-muted)]">{b.subtitle}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-xs text-[var(--text-muted)]">
        Note: “SOC 2” and “GDPR-ready” are displayed as trust badges; validate vendor compliance scope during procurement.
      </div>
    </div>
  );
}
