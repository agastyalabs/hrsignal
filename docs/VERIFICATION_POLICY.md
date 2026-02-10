# HRSignal — Verification Policy (Verified Vendor)

This policy defines the **exact rules** for marking a vendor as **Verified** on HRSignal.
It is derived from (and must stay consistent with) `docs/CONTENT_SPEC.md`.

---

## 0) Definitions

### Verification levels
- **Verified** — evidence-backed, current, and complete enough to compare.
- **Partially verified** — some evidence exists, but key fields are missing or stale.
- **Unverified** — listing exists, but evidence and/or key fields are missing.

### Key artifacts
- **Vendor profile** — the vendor page content (overview, India readiness, sources).
- **Tool listings** — the published tools associated with the vendor.
- **Evidence** — URLs and citations used to justify claims.

---

## 1) Verified Vendor: minimum required fields (must be present)

A vendor can be labeled **Verified** only if *all* required fields below are present.

### 1.1 Vendor identity & basics
- `vendor.slug` (stable)
- `vendor.name`
- `vendor.websiteUrl` (must be a valid HTTPS URL)
- `vendor.categorySlugs[]` (>= 1)

### 1.2 Product coverage
- `vendor.toolSlugs[]` (>= 1) **AND** at least one corresponding tool is **PUBLISHED** on HRSignal.
  - Rationale: a “verified vendor” without any verified/published tools is not decision-useful.

### 1.3 Trust signals
- `vendor.verificationLevel = "Verified"`
- `vendor.lastCheckedAt` (date; ISO `YYYY-MM-DD`)
- `vendor.sources[]` with at least **1** source URL (see evidence rules)

### 1.4 India-first readiness fields
All must be present (values may be `UNKNOWN` but must be explicitly set):
- `vendor.dataResidency` ∈ {`INDIA`, `GLOBAL`, `CONFIGURABLE`, `UNKNOWN`}
- `vendor.whatsappSupport` ∈ {`YES`, `NO`, `UNKNOWN`}
- `vendor.localPartners` ∈ {`YES`, `NO`, `UNKNOWN`}
- `vendor.gstInvoicing` ∈ {`YES`, `NO`, `UNKNOWN`}

If vendor offers payroll tools/services, additionally require:
- `vendor.payrollComplianceCoverage[]` (may be empty if explicitly not supported, but must exist)

### 1.5 Support channels
- `vendor.supportChannels[]` must exist (can be empty only if explicitly `UNKNOWN` is represented elsewhere; preferred is >= 1 channel).

---

## 2) Evidence rules (minimum, and what qualifies)

### 2.1 Minimum evidence set
To qualify as **Verified**, a vendor must have:
- **>= 1** credible source URL in `vendor.sources[]`.

Recommended (strongly preferred) evidence URLs:
- Official vendor website pages:
  - Pricing page / plans
  - Product page(s)
  - Compliance/security/privacy page
  - Data residency / hosting page
  - Support/contact page (WhatsApp mention if applicable)
- Official documentation / help center pages

### 2.2 Evidence must map to claims
Each “important claim” shown in the UI should be backed by at least one source (best effort):
- India readiness (data residency, GST invoicing, WhatsApp support)
- Payroll compliance tags (PF/ESI/PT/TDS/LWF etc)
- Pricing model (PEPM/per-user/quote-based/one-time)

If a claim cannot be evidenced:
- Mark the field as `UNKNOWN` (do not guess)
- Or downgrade verification (see downgrade rules)

### 2.3 Disallowed evidence
Do **not** use as primary evidence for verification:
- Unattributed blog posts
- Affiliate listicles without vendor citations
- Screenshots without linkable context

(These may be used as discovery inputs, but not as “verification-grade” evidence.)

---

## 3) Source citation format (how sources must be stored)

### 3.1 URL format
Store sources as full URLs:
- Must be `https://...`
- Prefer canonical pages (avoid tracking params)

### 3.2 Recommended citation metadata (optional v1, required v2)
If/when we extend schema, each source should become an object:
```ts
{
  url: string;
  label?: string; // e.g., "Pricing", "Security", "Support"
  capturedAt?: string; // YYYY-MM-DD
  notes?: string;
}
```

Until then (v1), keep:
- `vendor.sources[]: string[]`
- Maintain human-readable mapping in content/briefs (e.g., “Sources & data quality” section)

---

## 4) Freshness rules (how recent “Verified” must be)

### 4.1 Freshness window
- A Verified vendor must have `lastCheckedAt` within **90 days**.

### 4.2 Staleness thresholds
- **> 90 days** since last checked → **downgrade to Partially verified**
- **> 180 days** since last checked → **downgrade to Unverified**

### 4.3 What counts as “checked”
A check should include at minimum:
- Website availability and product pages still live
- Support/contact channel review
- Evidence URLs still valid
- Any pricing/compliance notes reviewed for drift

---

## 5) Downgrade rules (automatic or editorial)

A vendor must be downgraded if any of these occur:

### 5.1 Missing required trust signals
- `sources[]` missing or empty → **Unverified**
- `lastCheckedAt` missing → **Unverified**

### 5.2 Missing minimum India-first fields
If any of these are missing entirely (not set, not UNKNOWN):
- `dataResidency`, `gstInvoicing`, `whatsappSupport`, `localPartners`
→ **Partially verified** at best; **Unverified** if multiple missing.

### 5.3 No published tools
If vendor has 0 published tools on HRSignal:
- Verification cannot be “Verified”. Downgrade to **Partially verified** (or keep Unverified) until at least one tool is published.

### 5.4 Evidence mismatch
If the UI displays a claim that cannot be backed by any source:
- Set that field to `UNKNOWN`.
- If the claim is central (pricing model, data residency, payroll compliance), downgrade to **Partially verified**.

### 5.5 Freshness breach
- Stale beyond thresholds → downgrade per section 4.

---

## 6) Relationship to Tool verification

A Vendor may be Verified even if not all its tools are Verified, **but**:
- At least **one** associated tool must be published and meet minimum completeness.
- If all published tools are Unverified, vendor should generally be **Partially verified**.

---

## 7) Operational checklist (editorial)

Before labeling a vendor Verified:
1. Confirm `websiteUrl` resolves and matches vendor name.
2. Add at least 1 evidence URL (prefer Pricing/Security/Support pages).
3. Set India-first fields explicitly (YES/NO/UNKNOWN).
4. Ensure at least 1 tool is published.
5. Set `lastCheckedAt` to today.
6. Re-check: UI does not show unsupported claims.

---

## 8) Notes & future tightening

Planned v2 improvements:
- Structured sources objects + per-claim mapping.
- Separate “Verified in India” vs “Verified metadata completeness” flags.
- Automated link checker for evidence URLs.
