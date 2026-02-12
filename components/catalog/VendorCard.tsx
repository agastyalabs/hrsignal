import * as React from "react";

import { TrackedLink } from "@/components/analytics/TrackedLink";

import { Card } from "@/components/ui/Card";
import { VendorLogo } from "@/components/VendorLogo";
import { domainFromUrl } from "@/lib/brand/logo";
import { TrustRatingRow } from "@/components/trust/TrustRatingRow";

export type VendorCardModel = {
  id: string;
  slug: string;
  name: string;
  websiteUrl: string | null;
  toolsCount: number;
  categories: string[];
  tagline: string | null;
  pricingType?: import("@/lib/pricing/format").PricingType;
  pricingText?: string;

  // Optional UI ranking metadata (list page only)
  rank?: number;

  // Trust mini-row
  verifiedInIndia?: boolean;
  trustLevel?: "verified" | "partial" | "unverified";
  sourcesCount?: number | null;
  lastCheckedAt?: string | Date | null;
  // Back-compat (avoid breaking callers)
  freshnessLabel?: string | null;

  // HRSignal Readiness Score™ (0–100) when available
  readinessIndex?: number | null;
};

export function VendorCard({ vendor }: { vendor: VendorCardModel }) {
  const trustLevel = vendor.trustLevel ?? (vendor.verifiedInIndia ? "verified" : "unverified");

  const maxChips = 2;
  const chips = vendor.categories.slice(0, maxChips);
  const extraCount = Math.max(0, vendor.categories.length - chips.length);

  return (
    <Card className="h-full border-[rgba(255,255,255,0.10)] bg-[var(--surface-1)] p-4 sm:p-5">
      {/* (1) Logo + name row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.12)] bg-[var(--surface-2)]">
            <VendorLogo
              slug={vendor.slug}
              name={vendor.name}
              domain={domainFromUrl(vendor.websiteUrl)}
              className="h-8 w-8 rounded-md"
              size={32}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <TrackedLink
                event="click_vendor"
                eventData={{ vendor: vendor.slug, from: "vendor_card" }}
                href={`/vendors/${vendor.slug}`}
                className="truncate text-base font-semibold text-[var(--text)] hover:underline"
              >
                {vendor.name}
              </TrackedLink>
              <span className="text-xs font-semibold text-[var(--text-muted)]">• {vendor.toolsCount} tools</span>

              {typeof vendor.rank === "number" ? (
                <span className="rounded-full border border-[rgba(124,77,255,0.24)] bg-[rgba(124,77,255,0.14)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text)]">
                  #{vendor.rank}
                </span>
              ) : null}

              {typeof vendor.readinessIndex === "number" ? (
                <span
                  className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text)]"
                  title="India-specific payroll compliance + verification intelligence score (0–100)"
                >
                  HRSignal Readiness Score™ {vendor.readinessIndex}
                </span>
              ) : vendor.verifiedInIndia ? (
                <span
                  className="rounded-full border border-[rgba(39,211,188,0.30)] bg-[rgba(39,211,188,0.12)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text)]"
                  title="India-specific payroll compliance + verification intelligence score (0–100)"
                >
                  HRSignal Readiness Score™
                </span>
              ) : null}
            </div>

            {/* (2) 1-line descriptor */}
            <div className="mt-1 line-clamp-1 text-sm text-[var(--text-muted)]">
              {vendor.tagline ?? "HR software vendor listing"}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* keep compare toggle as a secondary control; primary CTA is below */}
        </div>
      </div>

      {/* (3) Compact trust row */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <TrustRatingRow level={trustLevel} sourcesCount={null} lastCheckedAt={vendor.lastCheckedAt ?? vendor.freshnessLabel} />
        {vendor.websiteUrl ? (
          <span className="hidden max-w-[45%] truncate text-xs text-[var(--text-muted)] sm:inline">
            {vendor.websiteUrl.replace(/^https?:\/\//, "")}
          </span>
        ) : null}
      </div>

      {/* (4) Chips shown ONCE (max 2 +N) */}
      {vendor.categories.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <span
              key={c}
              className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text)]"
            >
              {c}
            </span>
          ))}
          {extraCount ? (
            <span className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-muted)]">
              +{extraCount}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* (5) Single clear primary CTA */}
      <div className="mt-4">
        <TrackedLink
          event="click_vendor"
          eventData={{ vendor: vendor.slug, from: "vendor_card_cta" }}
          href={`/vendors/${vendor.slug}`}
          className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary)] px-4 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(0,0,0,0.30)] hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-4 focus:ring-[var(--ring)]"
        >
          View vendor
        </TrackedLink>
      </div>
    </Card>
  );
}
