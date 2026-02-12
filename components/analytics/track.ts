"use client";

import { track as vercelTrack } from "@vercel/analytics";

export type UtmState = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  ref?: string;
  landing_path?: string;
  first_seen_at?: string;
};

const KEY = "hrsignal_utm_v1";

function safeJsonParse(v: string | null): unknown {
  try {
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

export function readUtm(): UtmState {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(KEY);
  const parsed = safeJsonParse(raw);
  if (!parsed || typeof parsed !== "object") return {};
  return parsed as UtmState;
}

export function writeUtm(next: UtmState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function mergeUtm(fromUrl: URL): UtmState {
  const params = fromUrl.searchParams;

  const existing = readUtm();
  const firstSeenAt = existing.first_seen_at ?? new Date().toISOString();

  const next: UtmState = {
    ...existing,
    first_seen_at: firstSeenAt,

    utm_source: params.get("utm_source") ?? existing.utm_source,
    utm_medium: params.get("utm_medium") ?? existing.utm_medium,
    utm_campaign: params.get("utm_campaign") ?? existing.utm_campaign,
    utm_term: params.get("utm_term") ?? existing.utm_term,
    utm_content: params.get("utm_content") ?? existing.utm_content,
    gclid: params.get("gclid") ?? existing.gclid,
    fbclid: params.get("fbclid") ?? existing.fbclid,
    ref: params.get("ref") ?? existing.ref,
    landing_path: existing.landing_path ?? (fromUrl.pathname + (fromUrl.search ? fromUrl.search : "")),
  };

  // If we see any campaign parameter, treat this as authoritative for this session.
  const hasAny =
    Boolean(params.get("utm_source")) ||
    Boolean(params.get("utm_medium")) ||
    Boolean(params.get("utm_campaign")) ||
    Boolean(params.get("utm_term")) ||
    Boolean(params.get("utm_content")) ||
    Boolean(params.get("gclid")) ||
    Boolean(params.get("fbclid")) ||
    Boolean(params.get("ref"));

  if (hasAny) writeUtm(next);

  return next;
}

export function trackEvent(
  event: string,
  props?: Record<string, string | number | boolean | null | undefined>
) {
  const utm = readUtm();

  // Ensure all UTM values are primitives (Vercel Analytics constraint)
  const utmProps: Record<string, string> = {};
  (Object.entries(utm) as Array<[string, unknown]>).forEach(([k, v]) => {
    if (typeof v === "string" && v) utmProps[k] = v;
  });

  const merged: Record<string, string | number | boolean | null | undefined> = {
    ...utmProps,
    ...(props ?? {}),
  };

  vercelTrack(event, merged);
}
