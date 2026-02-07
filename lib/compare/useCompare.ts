"use client";

import { useEffect, useState } from "react";
import { getCompareSlugs, setCompareSlugs, toggleCompareSlug } from "@/lib/compare/storage";

export function useCompare() {
  const [slugs, setSlugs] = useState<string[]>(() => getCompareSlugs());

  useEffect(() => {
    function refresh() {
      setSlugs(getCompareSlugs());
    }

    function onStorage(e: StorageEvent) {
      if (e.key && e.key.includes("hrsignal.compare")) refresh();
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("hrsignal_compare_change", refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("hrsignal_compare_change", refresh);
    };
  }, []);

  return {
    slugs,
    count: slugs.length,
    toggle: (slug: string) => {
      const r = toggleCompareSlug(slug);
      setSlugs(r.slugs);
      return r;
    },
    set: (next: string[]) => {
      setCompareSlugs(next);
      setSlugs(next.slice(0, 5));
    },
  };
}
