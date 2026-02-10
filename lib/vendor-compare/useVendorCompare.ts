"use client";

import { useEffect, useState } from "react";
import {
  getVendorCompareSlugs,
  setVendorCompareSlugs,
  toggleVendorCompareSlug,
  clearVendorCompare,
  VENDOR_COMPARE_STORAGE_KEY,
  VENDOR_COMPARE_CHANGE_EVENT,
} from "@/lib/vendor-compare/storage";

export function useVendorCompare() {
  const [slugs, setSlugs] = useState<string[]>(() => getVendorCompareSlugs());

  useEffect(() => {
    function refresh() {
      setSlugs(getVendorCompareSlugs());
    }

    function onStorage(e: StorageEvent) {
      if (e.key && e.key.includes(VENDOR_COMPARE_STORAGE_KEY)) refresh();
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener(VENDOR_COMPARE_CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(VENDOR_COMPARE_CHANGE_EVENT, refresh);
    };
  }, []);

  return {
    slugs,
    count: slugs.length,
    toggle: (slug: string) => {
      const r = toggleVendorCompareSlug(slug);
      setSlugs(r.slugs);
      return r;
    },
    set: (next: string[]) => {
      setVendorCompareSlugs(next);
      setSlugs(next.slice(0, 3));
    },
    clear: () => {
      clearVendorCompare();
      setSlugs([]);
    },
  };
}
