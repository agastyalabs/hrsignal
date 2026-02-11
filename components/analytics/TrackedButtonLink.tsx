"use client";

import * as React from "react";
import { track } from "@vercel/analytics";

import { ButtonLink } from "@/components/ui/Button";

export function TrackedButtonLink({
  event,
  eventData,
  ...props
}: {
  event: string;
  eventData?: Record<string, string | number | boolean | null | undefined>;
} & React.ComponentProps<typeof ButtonLink>) {
  return (
    <ButtonLink
      {...props}
      onClick={() => {
        track(event, eventData);
      }}
    />
  );
}
