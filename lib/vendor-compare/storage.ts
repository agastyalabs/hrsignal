const KEY = "hrsignal.vendorCompare.v1";
const CHANGE_EVENT = "hrsignal_vendor_compare_change";

function safeParse(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.map(String).filter(Boolean);
  } catch {
    return [];
  }
}

export function getVendorCompareSlugs(): string[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(KEY)).slice(0, 3);
}

export function setVendorCompareSlugs(slugs: string[]) {
  if (typeof window === "undefined") return;
  const next = slugs.map(String).filter(Boolean).slice(0, 3);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearVendorCompare() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function toggleVendorCompareSlug(slug: string): { slugs: string[]; added: boolean; full: boolean } {
  const current = getVendorCompareSlugs();
  const s = String(slug);
  const exists = current.includes(s);

  if (exists) {
    const next = current.filter((x) => x !== s);
    setVendorCompareSlugs(next);
    return { slugs: next, added: false, full: false };
  }

  if (current.length >= 3) {
    return { slugs: current, added: false, full: true };
  }

  const next = [...current, s];
  setVendorCompareSlugs(next);
  return { slugs: next, added: true, full: false };
}

export const VENDOR_COMPARE_STORAGE_KEY = KEY;
export const VENDOR_COMPARE_CHANGE_EVENT = CHANGE_EVENT;
