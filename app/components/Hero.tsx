"use client";

import Link from "next/link";
import { motion } from "framer-motion";

function DemoLoop() {
  // Three states: form -> verification -> vendor cards
  const base = {
    border: "1px solid rgba(100,116,139,0.25)",
    borderRadius: "16px",
    background: "#FFFFFF",
  } as const;

  return (
    <div className="relative mx-auto w-full max-w-md">
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(420px 240px at 30% 10%, rgba(11,95,111,0.18), transparent 60%), radial-gradient(420px 240px at 80% 40%, rgba(212,165,116,0.14), transparent 60%)",
          filter: "blur(18px)",
          borderRadius: 24,
        }}
        aria-hidden
      />

      <div className="relative grid gap-3">
        {/* Form */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: [1, 0, 0], y: [0, -8, -8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.33, 1] }}
          style={base}
          className="p-4"
        >
          <div className="text-xs font-bold text-[var(--color-primary)]">Form</div>
          <div className="mt-2 space-y-2">
            <div className="h-9 w-full rounded-lg bg-[rgba(100,116,139,0.10)]" />
            <div className="h-9 w-10/12 rounded-lg bg-[rgba(100,116,139,0.10)]" />
            <div className="h-9 w-9/12 rounded-lg bg-[rgba(100,116,139,0.10)]" />
          </div>
        </motion.div>

        {/* Verification */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: [0, 1, 0], y: [8, 0, -8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
          style={base}
          className="p-4"
        >
          <div className="text-xs font-bold text-[var(--color-primary)]">Verification</div>
          <div className="mt-3 grid gap-2">
            {[
              { label: "Compliance signals", ok: true },
              { label: "Evidence links", ok: true },
              { label: "Freshness checks", ok: true },
            ].map((x) => (
              <div key={x.label} className="flex items-center justify-between rounded-lg bg-[rgba(240,249,250,0.90)] px-3 py-2">
                <div className="text-sm text-[var(--color-dark)]">{x.label}</div>
                <div className="text-xs font-bold text-[var(--color-verified)]">OK</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Vendor cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: [0, 0, 1], y: [12, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.66, 1] }}
          style={base}
          className="p-4"
        >
          <div className="text-xs font-bold text-[var(--color-primary)]">Vendor cards</div>
          <div className="mt-3 grid gap-2">
            {["Shortlist pick #1", "Shortlist pick #2", "Shortlist pick #3"].map((t) => (
              <div key={t} className="rounded-lg border border-[rgba(100,116,139,0.20)] bg-white px-3 py-2">
                <div className="text-sm font-semibold text-[var(--color-dark)]">{t}</div>
                <div className="mt-1 text-xs text-[var(--color-neutral)]">Fit score + reasons</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="bg-[linear-gradient(180deg,var(--color-white),var(--color-light-bg))]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-20">
        {/* Left */}
        <div className="lg:col-span-6">
          <h1
            className="text-[var(--color-primary)]"
            style={{ fontSize: "var(--size-h1)", fontWeight: "var(--weight-bold)", lineHeight: 1.05 }}
          >
            Shortlist HRMS tools without compliance surprises.
          </h1>

          <p className="mt-4 max-w-[60ch] text-[var(--color-neutral)]" style={{ fontSize: "var(--size-body)" }}>
            India-first procurement guidance: evidence-backed listings, verification signals, and demo checklists that catch PF/ESI/PT/TDS edge cases.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/recommend"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[var(--color-accent)] px-6 text-sm font-bold text-white transition-all duration-200 hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            >
              Find My Tool
            </Link>

            <Link
              href="/methodology"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-[rgba(11,95,111,0.35)] bg-transparent px-6 text-sm font-semibold text-[var(--color-primary)] transition-all duration-200 hover:bg-[rgba(11,95,111,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              See How It Works
            </Link>
          </div>

          <div className="mt-4 text-sm text-[var(--color-neutral)]">
            Deterministic scoring. No paid ranking. Designed for HR + Finance.
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-6">
          <DemoLoop />
        </div>
      </div>
    </section>
  );
}
