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
      <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-[#334155] hover:shadow-md motion-reduce:transition-none">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0F172A] ring-1 ring-[#1F2937]">
              <VendorLogo
                slug={tool.vendorSlug ?? tool.slug}
                name={tool.vendorName ?? tool.name}
                domain={domainFromUrl(tool.vendorWebsiteUrl)}
                className="h-7 w-7 rounded-md"
                size={28}
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-[#F9FAFB]">{tool.name}</div>
              {tool.vendorName ? <div className="mt-1 truncate text-sm text-[#CBD5E1]">by {tool.vendorName}</div> : null}
            </div>
          </div>
          {tool.verified ? <Badge variant="verified">Verified</Badge> : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <Stars value={rating} />
          <span className="font-medium text-[#F9FAFB]">{rating.toFixed(1)}</span>
          <span className="text-[#94A3B8]">({reviews} reviews)</span>
        </div>

        {tool.tagline ? <div className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">{tool.tagline}</div> : null}

        {tool.bestFor?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {tool.bestFor.slice(0, 2).map((x) => (
              <span
                key={x}
                className="rounded-full border border-[#1F2937] bg-[#171C3F] px-2.5 py-1 text-xs font-semibold text-[#F5F7FF]"
              >
                Best for: {x}
              </span>
            ))}
          </div>
        ) : null}

        {tool.keyFeatures?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {tool.keyFeatures.slice(0, 3).map((x) => (
              <span key={x} className="rounded-full border border-[#1F2937] bg-[#0F172A] px-2 py-0.5 text-xs text-[#CBD5E1]">
                {x}
              </span>
            ))}
          </div>
        ) : null}

        {tool.categories?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tool.categories.slice(0, 3).map((c) => (
              <span key={c} className="rounded-full border border-[#1F2937] bg-[#0F172A] px-2 py-0.5 text-xs text-[#CBD5E1]">
                {c}
              </span>
            ))}
            {tool.categories.length > 3 ? (
              <span className="rounded-full border border-[#1F2937] bg-[#111827] px-2 py-0.5 text-xs text-[#94A3B8]">
                +{tool.categories.length - 3}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-[#94A3B8] sm:grid-cols-2">
          <div>
            <span className="font-medium text-[#CBD5E1]">Implementation:</span> {tool.implementationTime ?? "1–3 weeks"}
          </div>
          <div>
            <span className="font-medium text-[#CBD5E1]">Pricing:</span> {tool.pricingHint ?? "Quote-based"}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <CompareToggle slug={tool.slug} />
          <div className="inline-flex h-11 items-center rounded-lg bg-[#8B5CF6] px-4 text-sm font-medium text-[#0B1220] hover:bg-[#7C3AED]">
            Request Demo via HRSignal
          </div>
        </div>
      </Card>
    </Link>
  );
}

function pseudoRating(slug: string) {
  // Deterministic, placeholder ratings (until we add real reviews).
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 1000;
  const rating = 3.8 + (h % 12) / 10; // 3.8–4.9
  const reviews = 20 + (h % 180); // 20–199
  return { rating, reviews };
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const total = 5;

  return (
    <div className="flex items-center gap-0.5 text-amber-500" aria-label={`Rating ${value.toFixed(1)} out of 5`}>
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
