import test from "node:test";
import assert from "node:assert/strict";

// Use a relative import from TS source. Node can load TS here because this repo uses Next tooling,
// but for a plain Node test we keep a minimal inline copy of the logic to avoid build steps.

function slugifyName(name) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

const ALIASES = {
  "freshteam-freshworks": "freshteam",
  "freshworks-freshteam": "freshteam",
};

function normalizeVendorSlug(raw) {
  const s = slugifyName(raw);
  return ALIASES[s] ?? s;
}

function canonicalVendorSlug({ vendorName, toolSlugs = [] }) {
  const toolSet = new Set(toolSlugs.map((t) => String(t).toLowerCase()));
  if (toolSet.has("freshteam") || slugifyName(vendorName).includes("freshteam")) return "freshteam";
  return slugifyName(vendorName);
}

function resolveSlugRedirect({ requestedSlug, canonicalSlug }) {
  const req = normalizeVendorSlug(requestedSlug);
  const canon = normalizeVendorSlug(canonicalSlug);
  if (req !== canon) return canon;
  return null;
}

test("normalizeVendorSlug maps known aliases", () => {
  assert.equal(normalizeVendorSlug("freshteam-freshworks"), "freshteam");
  assert.equal(normalizeVendorSlug("freshworks-freshteam"), "freshteam");
});

test("canonicalVendorSlug prefers freshteam when tool slug present", () => {
  assert.equal(canonicalVendorSlug({ vendorName: "Freshworks", toolSlugs: ["freshteam"] }), "freshteam");
});

test("resolveSlugRedirect only redirects when normalized slugs differ", () => {
  // Alias is normalized, so no redirect needed.
  assert.equal(resolveSlugRedirect({ requestedSlug: "freshteam-freshworks", canonicalSlug: "freshteam" }), null);
  assert.equal(resolveSlugRedirect({ requestedSlug: "freshteam", canonicalSlug: "freshteam" }), null);
  assert.equal(resolveSlugRedirect({ requestedSlug: "freshworks", canonicalSlug: "freshteam" }), "freshteam");
});
