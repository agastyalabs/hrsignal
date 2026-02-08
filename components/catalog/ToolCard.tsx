import Link from "next/link";
import * as React from "react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CompareToggle } from "@/components/compare/CompareToggle";
import { VendorLogo } from "@/components/VendorLogo";
import { domainFromUrl } from "@/lib/brand/logo";

export type ToolCardModel = {
  slug: string;
  name: string;
  vendorName?: string;
  vendorWebsiteUrl?: string;
  vendorSlug?: string;
  categories: string[];
  tagline?: string;
  verified?: boolean;
  bestFor?: string[];
  keyFeatures?: string[];
  implementationTime?: string;
  pricingHint?: string;
};

export function ToolCard({ tool }: { tool: ToolCardModel }) {
  const { rating, reviews } = pseudoRating(tool.slug);

  return (
    <Link href={`/tools/${tool.slug}`} className="block">
      <Card className="h-full p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
              <VendorLogo
                slug={tool.vendorSlug ?? tool.slug}
                name={tool.vendorName ?? tool.name}
                domain={domainFromUrl(tool.vendorWebsiteUrl)}
                className="h-8 w-8 rounded-md"
                size={32}
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-[var(--text)]">{tool.name}</div>
              {tool.vendorName ? (
                <div className="mt-1 truncate text-sm text-[var(--text-muted)]">by {tool.vendorName}</div>
              ) : null}
            </div>
          </div>
          {tool.verified ? <Badge variant="verified">Verified</Badge> : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <Stars value={rating} />
          <span className="font-semibold text-[var(--text)]">{rating.toFixed(1)}</span>
          <span className="text-[var(--text-muted)]">({reviews} reviews)</span>
          <span className="ml-auto rounded-full border border-[rgba(39,211,188,0.35)] bg-[rgba(39,211,188,0.10)] px-2.5 py-1 text-xs font-semibold text-[var(--text)]">
            India-ready
          </span>
        </div>

        {tool.tagline ? (
          <div className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{tool.tagline}</div>
        ) : null}

        {tool.keyFeatures?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tool.keyFeatures.slice(0, 3).map((x) => (
              <span
                key={x}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
              >
                {x}
              </span>
            ))}
          </div>
        ) : null}

        {tool.categories?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tool.categories.slice(0, 3).map((c) => (
              <span
                key={c}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
              >
                {c}
              </span>
            ))}
            {tool.categories.length > 3 ? (
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                +{tool.categories.length - 3}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-[var(--text-muted)] sm:grid-cols-2">
          <div>
            <span className="font-semibold text-[var(--text)]">Implementation:</span> {tool.implementationTime ?? "2–4 weeks"}
          </div>
          <div>
            <span className="font-semibold text-[var(--text)]">Pricing:</span> {tool.pricingHint ?? "Quote-based"}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <CompareToggle slug={tool.slug} />
          <div className="inline-flex items-center gap-2">
            <span className="hidden text-xs font-semibold text-[var(--text-muted)] sm:inline">Need pricing?</span>
            <span className="inline-flex h-11 items-center rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] hover:shadow-[0_12px_36px_rgba(111,66,193,0.22)] motion-reduce:transition-none">
              Request demo
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function pseudoRating(slug: string) {
  // Deterministic placeholder ratings (until we add real reviews).
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 1000;
  const rating = 3.9 + (h % 11) / 10; // 3.9–5.0
  const reviews = 35 + (h % 260); // 35–294
  return { rating: Math.min(4.9, rating), reviews };
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const total = 5;

  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-label={`Rating ${value.toFixed(1)} out of 5`}>
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const on = idx <= full || (idx === full + 1 && half);
        return (
          <span key={idx} className={on ? "opacity-100" : "opacity-20"}>
            ★
          </span>
        );
      })}
    </div>
  );
}
