"use client";

import * as React from "react";

import { VendorResultCard, type VendorResultCardModel } from "@/components/vendors/VendorResultCard";

export function VendorResultGrid({ vendors }: { vendors: VendorResultCardModel[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vendors.map((v) => (
        <VendorResultCard key={v.slug} vendor={v} />
      ))}
    </div>
  );
}
