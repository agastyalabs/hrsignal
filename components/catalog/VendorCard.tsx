import Link from "next/link";
import * as React from "react";

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

  // Trust mini-row
  verifiedInIndia?: boolean;
  trustLevel?: "verified" | "partial" | "unverified";
  sourcesCount?: number | null;
  lastCheckedAt?: string | Date | null;
  // Back-compat (avoid breaking callers)
  freshnessLabel?: string | null;
};

export function VendorCard({ vendor }: { vendor: VendorCardModel }) {
  const trustLevel = vendor.trustLevel ?? (vendor.verifiedInIndia ? "verified" : "unverified");

  return (
    <Link href={`/vendors/${vendor.slug}`} className="block">
      <Card className="h-full p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
              <VendorLogo
                slug={vendor.slug}
                name={vendor.name}
                domain={domainFromUrl(vendor.websiteUrl)}
                className="h-8 w-8 rounded-md"
                size={32}
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-[var(--text)]">{vendor.name}</div>
              <div className="mt-1 line-clamp-1 text-sm text-[var(--text-muted)]">
                {vendor.tagline ?? "HR software vendor listing"}
              </div>
            </div>
          </div>

          <div className="shrink-0 text-right text-xs text-[var(--text-muted)]">
            {vendor.websiteUrl ? vendor.websiteUrl.replace(/^https?:\/\//, "") : "—"}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text)]">
            {vendor.toolsCount} tools
          </span>
          <TrustRatingRow
            level={trustLevel}
            sourcesCount={vendor.sourcesCount}
            lastCheckedAt={vendor.lastCheckedAt ?? vendor.freshnessLabel}
          />
        </div>

        {vendor.categories.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {vendor.categories.slice(0, 3).map((c) => (
              <span
                key={c}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
              >
                {c}
              </span>
            ))}
            {vendor.categories.length > 3 ? (
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                +{vendor.categories.length - 3}
              </span>
            ) : null}
          </div>
        ) : null}

        {vendor.categories.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {vendor.categories.slice(0, 3).map((c) => (
              <span
                key={c}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
              >
                {c}
              </span>
            ))}
            {vendor.categories.length > 3 ? (
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                +{vendor.categories.length - 3}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-[var(--text-muted)]">
          <div className="flex flex-wrap items-center gap-2">
            <TrustRatingRow
              level={trustLevel}
              sourcesCount={vendor.sourcesCount}
              lastCheckedAt={vendor.lastCheckedAt ?? vendor.freshnessLabel}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text)]">Pricing:</span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text)]">
              {vendor.pricingType ?? "Quote-based"}
            </span>
            <span className="truncate">{vendor.pricingText ?? "Contact vendor / request quote"}</span>
          </div>
        </div>

        <div className="mt-5">
          <div className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]">
            View vendor
          </div>
        </div>
      </Card>
    </Link>
  );
}
