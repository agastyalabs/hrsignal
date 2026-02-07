"use client";

const KEY = "hrsignal.compare.slugs.v1";

export function getCompareSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((x) => (typeof x === "string" ? x : "")).filter(Boolean).slice(0, 5);
  } catch {
    return [];
  }
}

export function setCompareSlugs(slugs: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(slugs.slice(0, 5)));
  window.dispatchEvent(new Event("hrsignal_compare_change"));
}

export function toggleCompareSlug(slug: string): { slugs: string[]; added: boolean } {
  const slugs = getCompareSlugs();
  const exists = slugs.includes(slug);
  if (exists) {
    const next = slugs.filter((s) => s !== slug);
    setCompareSlugs(next);
    return { slugs: next, added: false };
  }
  const next = [...slugs, slug].slice(0, 5);
  setCompareSlugs(next);
  return { slugs: next, added: true };
}

export function clearCompare() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("hrsignal_compare_change"));
}
