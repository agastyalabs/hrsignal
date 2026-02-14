"use client";

import * as React from "react";
import Link from "next/link";

import { Card } from "@/components/ui/Card";

export type VendorResultCardModel = {
  slug: string;
  name: string;
  logoUrl?: string | null;

  fitScore: number; // 0-100
  verifiedAt?: string | null; // e.g. "Feb 2025" or ISO-ish display string

  bestForTags: string[];
  strengths: string[]; // 3 bullets
  validateChecklist: string[]; // PF/ESI edge cases

  evidenceLinks?: Array<{ label: string; href: string }>;
};

function clamp100(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreTone(score: number) {
  if (score >= 80) {
    return {
      badge: "border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.14)] text-emerald-200",
      bar: "bg-[rgba(34,197,94,0.75)]",
      label: "Strong fit",
    };
  }
  if (score >= 55) {
    return {
      badge: "border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.14)] text-amber-200",
      bar: "bg-[rgba(245,158,11,0.75)]",
      label: "Moderate fit",
    };
  }
  return {
    badge: "border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.10)] text-[var(--text)]",
    bar: "bg-[rgba(148,163,184,0.55)]",
    label: "Needs validation",
  };
}

function PlaceholderLogo({ name }: { name: string }) {
  const letter = name.trim().slice(0, 1).toUpperCase() || "V";
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)]">
      <span className="text-sm font-extrabold text-[var(--text)]">{letter}</span>
    </div>
  );
}

export function VendorResultCard({ vendor }: { vendor: VendorResultCardModel }) {
  const score = clamp100(vendor.fitScore);
  const tone = scoreTone(score);
  const verifiedLabel = vendor.verifiedAt ? `Verified: ${vendor.verifiedAt}` : "Verification: not listed";

  return (
    <Card className="group flex h-full flex-col gap-4 overflow-hidden p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {vendor.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={vendor.logoUrl}
              alt=""
              className="h-11 w-11 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] object-contain p-1"
              loading="lazy"
            />
          ) : (
            <PlaceholderLogo name={vendor.name} />
          )}

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-[var(--text)]">{vendor.name}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${tone.badge}`}
                title={tone.label}
              >
                Fit score: {score}
              </span>
              <span className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-1">
                {verifiedLabel}
              </span>
            </div>
          </div>
        </div>

        <Link
          href={`/vendors/${vendor.slug}`}
          className="shrink-0 text-xs font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 transition-all duration-200 hover:text-violet-100 hover:decoration-[rgba(124,77,255,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          View →
        </Link>
      </div>

      {/* Score bar */}
      <div className="-mt-1">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>{tone.label}</span>
          <span>{score}/100</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)]">
          <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${score}%` }} />
        </div>
      </div>

      {/* Best for tags */}
      <div>
        <div className="text-xs font-semibold text-[var(--text-muted)]">Best for</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {vendor.bestForTags.slice(0, 6).map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--text)]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
        <div className="text-xs font-semibold text-[var(--text-muted)]">Key strengths</div>
        <ul className="mt-2 space-y-1 text-sm text-[var(--text-muted)]">
          {vendor.strengths.slice(0, 3).map((s) => (
            <li key={s} className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[rgba(34,197,94,0.7)]" aria-hidden="true" />
              <span className="leading-6">{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Validate in demo */}
      <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-semibold text-[var(--text-muted)]">Validate in demo</div>
          <span className="text-xs text-[var(--text-muted)]">PF/ESI edge cases</span>
        </div>
        <ul className="mt-2 space-y-1 text-sm text-[var(--text-muted)]">
          {vendor.validateChecklist.slice(0, 4).map((s) => (
            <li key={s} className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[rgba(245,158,11,0.75)]" aria-hidden="true" />
              <span className="leading-6">{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Evidence links (expand on hover / focus within) */}
      <div className="mt-auto">
        <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold text-[var(--text-muted)]">Evidence</div>
            <div className="text-xs font-semibold text-violet-200">View evidence links</div>
          </div>

          <div className="mt-3 hidden space-y-2 group-hover:block group-focus-within:block">
            {vendor.evidenceLinks && vendor.evidenceLinks.length ? (
              <ul className="space-y-2">
                {vendor.evidenceLinks.slice(0, 4).map((l) => (
                  <li key={l.href} className="text-sm">
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[var(--link)] hover:text-[var(--link-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    >
                      {l.label}
                    </a>
                    <div className="mt-1 truncate text-xs text-[var(--text-muted)]">{l.href}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-[var(--text-muted)]">No evidence links attached yet.</div>
            )}

            <div className="pt-2">
              <Link
                href={`/vendors/${vendor.slug}`}
                className="text-sm font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 hover:text-violet-100 hover:decoration-[rgba(124,77,255,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                Open vendor profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
