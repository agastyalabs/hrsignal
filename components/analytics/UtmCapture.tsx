"use client";

import { useEffect } from "react";

import { mergeUtm } from "@/components/analytics/track";

export function UtmCapture() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      mergeUtm(new URL(window.location.href));
    } catch {
      // ignore
    }
  }, []);

  return null;
}
