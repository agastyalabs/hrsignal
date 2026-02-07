/*
  Fetch vendor logos deterministically into /public/vendor-logos/{slug}.png.

  Fallback order:
  - Clearbit logo endpoint (best quality for many domains)
  - DuckDuckGo icon endpoint (often returns .ico)

  Note: This file is TypeScript for readability, but the runnable script is
  scripts/fetch-logos.mjs (Node). Keep logic in sync.
*/

export type VendorSeed = {
  name: string;
  slug?: string;
  domain?: string | null;
  website_url?: string | null;
};

export function domainFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function slugify(name: string) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
