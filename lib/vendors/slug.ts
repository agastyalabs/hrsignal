export function slugifyName(name: string) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

// Aliases we want to support explicitly.
const ALIASES: Record<string, string> = {
  "freshteam-freshworks": "freshteam",
  "freshworks-freshteam": "freshteam",
};

export function normalizeVendorSlug(raw: string) {
  const s = slugifyName(raw);
  return ALIASES[s] ?? s;
}

export function canonicalVendorSlug(input: {
  vendorName: string;
  toolSlugs?: string[];
}) {
  const toolSet = new Set((input.toolSlugs ?? []).map((t) => String(t).toLowerCase()));

  // Freshteam must resolve to /vendors/freshteam.
  if (toolSet.has("freshteam") || slugifyName(input.vendorName).includes("freshteam")) return "freshteam";

  // NOTE: Ideally this comes from vendor.slug in the catalog.
  // Our current schema does not have vendor.slug, so we fall back to a stable derived slug.
  return slugifyName(input.vendorName);
}

export function resolveSlugRedirect(input: {
  requestedSlug: string;
  canonicalSlug: string;
}) {
  const req = normalizeVendorSlug(input.requestedSlug);
  const canon = normalizeVendorSlug(input.canonicalSlug);
  if (req !== canon) return canon;
  return null;
}
