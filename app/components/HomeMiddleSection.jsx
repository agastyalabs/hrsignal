"use client";

import * as React from "react";
import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ShieldCheck, Link as LinkIcon, Sparkles, CheckCircle2, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

function CollapsibleCard({ icon: Icon, title, subtitle, children, defaultOpen = false }) {
  // Critical: correct state hook syntax (fixes the common Card bug)
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="radius-card border border-slate-200 bg-white shadow-soft">
      <Collapsible.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between gap-4 px-6 py-5 text-left",
            "transition-all hover:-translate-y-0.5 hover:shadow-glow",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
          )}
          aria-expanded={open}
        >
          <div className="flex min-w-0 items-start gap-4">
            <span className="mt-0.5 inline-flex h-11 w-11 items-center justify-center radius-pill border border-slate-200 bg-slate-50">
              <Icon className="h-5 w-5 text-[var(--primary-blue)]" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <div className="truncate text-base font-extrabold tracking-tight text-slate-900">{title}</div>
              <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
            </span>
          </div>

          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-slate-400 transition-transform",
              open ? "rotate-180" : "rotate-0",
            )}
            aria-hidden="true"
          />
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content className="px-6 pb-6">
        <div className="radius-inner border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-700">
          {children}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function TrustChip({ icon: Icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 radius-pill border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-soft">
      <Icon className="h-4 w-4 text-emerald-600" aria-hidden="true" />
      {label}
    </div>
  );
}

export default function HomeMiddleSection() {
  return (
    <section className="border-t border-[var(--border-soft)]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">How we keep it brutally useful</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              No hype. No paid ranking. Just India-first verification signals and demo-ready checklists.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <TrustChip icon={CheckCircle2} label="India-first" />
            <TrustChip icon={LinkIcon} label="Evidence links" />
            <TrustChip icon={ShieldCheck} label="Risk flags" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <CollapsibleCard
            icon={Sparkles}
            title="Shortlist with reasons"
            subtitle="Fit score + why it fits (and what’s unknown)."
            defaultOpen
          >
            We highlight the signals that actually change outcomes: compliance scope, integrations visibility, and freshness.
            Anything missing is explicitly marked as “validate” — so you don’t discover surprises at month-end.
          </CollapsibleCard>

          <CollapsibleCard icon={ShieldCheck} title="India compliance depth" subtitle="PF / ESI / PT / TDS edge cases." >
            India payroll fails at the edges. We push demos towards arrears, reversals, cutoffs, statutory exports,
            and multi-state exceptions — not feature checkboxes.
          </CollapsibleCard>

          <CollapsibleCard icon={LinkIcon} title="Evidence-first listings" subtitle="Primary links, not vibes." >
            When we can, we attach source links (docs, pricing, security, support). That makes internal review faster and
            vendor calls tighter.
          </CollapsibleCard>
        </div>

        <div className="mt-10 radius-card border border-slate-200 bg-white p-6 shadow-soft">
          <div className="text-sm font-extrabold text-slate-900">What you get</div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { t: "Clean directory", d: "Tools, vendors, and categories with sane defaults." },
              { t: "Hot this week", d: "Signal from weekly upvotes — fast, not perfect." },
              { t: "Stealth submissions", d: "Founders can submit tools for review." },
            ].map((x) => (
              <div key={x.t} className="radius-inner border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-extrabold text-slate-900">{x.t}</div>
                <div className="mt-2 text-sm text-slate-600">{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
