import Link from "next/link";
import * as React from "react";

import { Card } from "@/components/ui/Card";
import { TrustRatingRow } from "@/components/trust/TrustRatingRow";
import { CompareToggle } from "@/components/compare/CompareToggle";
import { VendorLogo } from "@/components/VendorLogo";
import { domainFromUrl } from "@/lib/brand/logo";
import { pricingTypeLabel } from "@/lib/pricing/format";
import { UpvoteButton } from "@/components/upvote/UpvoteButton";

export type ToolCardModel = {
  id?: string;
  upvotes?: number;
  upvotesWeek?: number;

  slug: string;
  name: string;
  vendorName?: string;
  vendorWebsiteUrl?: string;
  vendorSlug?: string;
  categories: string[];
  tagline?: string;
  verified?: boolean;
  trustLevel?: "verified" | "partial" | "unverified";
  sourcesCount?: number | null;
  lastCheckedAt?: string | Date | null;

  bestFor?: string[];
  keyFeatures?: string[];
  implementationTime?: string;
  pricingHint?: string;
  pricingType?: import("@/lib/pricing/format").PricingType;
};

export function ToolCard({ tool }: { tool: ToolCardModel }) {
  const trustLevel = tool.trustLevel ?? (tool.verified ? "verified" : "unverified");

  return (
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
              <Link href={`/tools/${tool.slug}`} className="truncate text-base font-semibold text-[var(--text)] hover:underline">
                {tool.name}
              </Link>
              {tool.vendorName ? (
                <div className="mt-1 flex flex-wrap items-center gap-2 truncate text-sm text-[var(--text-muted)]">
                  <span>by {tool.vendorName}</span>
                  {tool.verified ? (
                    <span className="radius-pill bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">Verified</span>
                  ) : null}
                </div>
              ) : tool.verified ? (
                <div className="mt-1">
                  <span className="radius-pill bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">Verified</span>
                </div>
              ) : null}
            </div>
          </div>

          {tool.id ? <UpvoteButton toolId={tool.id} initial={tool.upvotes ?? 0} /> : null}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <TrustRatingRow level={trustLevel} sourcesCount={tool.sourcesCount} lastCheckedAt={tool.lastCheckedAt} />
          {typeof tool.upvotesWeek === "number" ? (
            <span className="radius-pill bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700">+{tool.upvotesWeek} this week</span>
          ) : null}
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
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text)]">Pricing:</span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text)]">
              {tool.pricingType ? pricingTypeLabel(tool.pricingType) : "Quote-based"}
            </span>
            <span className="truncate">{tool.pricingHint ?? "Contact vendor / request quote"}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <CompareToggle slug={tool.slug} />
          <div className="inline-flex items-center gap-2">
            <span className="hidden text-xs font-semibold text-[var(--text-muted)] sm:inline">Need pricing?</span>
            <Link
              href={`/vendors/${tool.vendorSlug ?? tool.slug}`}
              className="inline-flex h-11 items-center radius-pill bg-[var(--primary-blue)] px-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--primary-dark)] motion-reduce:transition-none"
            >
              Request demo
            </Link>
          </div>
        </div>
      </Card>
  );
}

