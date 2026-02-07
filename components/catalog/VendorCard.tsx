import Link from "next/link";
import * as React from "react";

import { Card } from "@/components/ui/Card";
import { ResolvedLogo } from "@/components/brand/ResolvedLogo";
import { vendorLogoCandidates } from "@/lib/brand/logo";

export type VendorCardModel = {
  id: string;
  slug: string;
  name: string;
  websiteUrl: string | null;
  toolsCount: number;
  categories: string[];
  tagline: string | null;
};

export function VendorCard({ vendor }: { vendor: VendorCardModel }) {
  return (
    <Link href={`/vendors/${vendor.id}`} className="block">
      <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-[#334155] hover:shadow-md motion-reduce:transition-none">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0F172A] ring-1 ring-[#1F2937]">
            <ResolvedLogo
              sources={vendorLogoCandidates({ slug: vendor.slug, websiteUrl: vendor.websiteUrl })}
              fallbackSrc="/placeholders/vendor.png"
              alt=""
              className="h-8 w-8 rounded-md"
            />
          </div>
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-[#F9FAFB]">{vendor.name}</div>
            {vendor.tagline ? <div className="mt-1 text-sm leading-relaxed text-[#CBD5E1]">{vendor.tagline}</div> : null}
          </div>
        </div>

        <div className="mt-3 text-sm text-[#CBD5E1]">{vendor.toolsCount} tools</div>

        {vendor.categories.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {vendor.categories.slice(0, 2).map((c) => (
              <span
                key={c}
                className="rounded-full border border-[#1F2937] bg-[#0F172A] px-2 py-0.5 text-xs text-[#CBD5E1]"
              >
                {c}
              </span>
            ))}
            {vendor.categories.length > 2 ? (
              <span className="rounded-full border border-[#1F2937] bg-[#111827] px-2 py-0.5 text-xs text-[#94A3B8]">
                +{vendor.categories.length - 2}
              </span>
            ) : null}
          </div>
        ) : null}

        {vendor.websiteUrl ? (
          <div className="mt-3 text-sm text-[#94A3B8]">{vendor.websiteUrl.replace(/^https?:\/\//, "")}</div>
        ) : null}

        <div className="mt-4 text-sm font-medium text-[#CBD5E1]">View vendor →</div>
      </Card>
    </Link>
  );
}
