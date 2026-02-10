import Link from "next/link";
import * as React from "react";

import { Card } from "@/components/ui/Card";
import { VendorLogo } from "@/components/VendorLogo";
import { domainFromUrl } from "@/lib/brand/logo";

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
};

function pseudoVendorQuality(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 1000;
  const rating = 4.1 + (h % 7) / 10; // 4.1–4.7
  const reviews = 30 + (h % 220);
  return { rating, reviews };
}

export function VendorCard({ vendor }: { vendor: VendorCardModel }) {
  const { rating, reviews } = pseudoVendorQuality(vendor.slug);

  return (
    <Link href={`/vendors/${vendor.slug}`} className="block">
      <Card className="h-full p-6">
        <div className="flex items-start gap-3">
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
            {vendor.tagline ? (
              <div className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{vendor.tagline}</div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-semibold text-[var(--text)]">
            {vendor.toolsCount} tools
          </span>
          <span className="text-xs font-semibold text-[var(--text)]">★ {rating.toFixed(1)}</span>
          <span className="text-xs text-[var(--text-muted)]">({reviews} reviews)</span>
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

        <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text)]">Pricing:</span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text)]">
              {vendor.pricingType ?? "Quote-based"}
            </span>
            <span className="truncate">{vendor.pricingText ?? "Contact vendor / request quote"}</span>
          </div>

          {vendor.websiteUrl ? (
            <div className="text-xs text-[var(--text-muted)]">{vendor.websiteUrl.replace(/^https?:\/\//, "")}</div>
          ) : null}
        </div>

        <div className="mt-5 text-sm font-semibold text-[color:var(--accent)]">View vendor →</div>
      </Card>
    </Link>
  );
}
