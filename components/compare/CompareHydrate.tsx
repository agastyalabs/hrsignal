"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useCompare } from "@/lib/compare/useCompare";

// Ensures /compare can be opened directly (reads localStorage selection and reflects it in the URL).
export function CompareHydrate() {
  const { slugs } = useCompare();
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const existing = sp.get("tools") || sp.get("slugs");
    if (existing) return;
    if (!slugs.length) return;
    router.replace(`/compare?tools=${encodeURIComponent(slugs.join(","))}`);
  }, [router, slugs, sp]);

  return null;
}
