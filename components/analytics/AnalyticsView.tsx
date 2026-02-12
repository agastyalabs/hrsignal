"use client";

import { useEffect } from "react";

import { trackEvent } from "@/components/analytics/track";

export function AnalyticsView({
  event,
  props,
}: {
  event: string;
  props?: Record<string, string | number | boolean | null | undefined>;
}) {
  useEffect(() => {
    trackEvent(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
