"use client";

import Link from "next/link";
import * as React from "react";

import { trackEvent } from "@/components/analytics/track";

export function TrackedLink({
  event,
  eventData,
  onClick,
  ...props
}: {
  event: string;
  eventData?: Record<string, string | number | boolean | null | undefined>;
} & React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent(event, eventData);
        onClick?.(e);
      }}
    />
  );
}
