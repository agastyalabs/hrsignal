# HRSignal Filters & Taxonomy v1 (India HR software)

Status: **SPEC + implementation plan (no code changes in this doc)**

Goals:
- Make filters predictable for Indian HR buyers.
- Keep compatible with the **current data model** (Prisma enums/fields) and existing routes.
- Remove ambiguity (e.g., random size ranges, unclear pricing units, “verified” meaning).

Non-goals:
- Do **not** change recommendation logic here.
- Do **not** redesign pages.

---

## 0) Current data model reality (what we have today)

From `prisma/schema.prisma`:
- **Company size**
  - `BuyerSizeBand` enum has: `EMP_20_200`, `EMP_50_500`, `EMP_100_1000`.
  - `Tool.bestForSizeBands: BuyerSizeBand[]`
  - `Vendor.supportedSizeBands: BuyerSizeBand[]`
  - `QuestionnaireSubmission.sizeBand: BuyerSizeBand?`
  - `Lead.sizeBand: BuyerSizeBand?`
- **Deployment**
  - `ToolDeployment` enum: `CLOUD | ONPREM | HYBRID`
  - `Tool.deployment: ToolDeployment?`
- **Pricing**
  - `PricingPlan.priceNote` and `PricingPlan.setupFeeNote` are free text.
  - Pricing *type inference* exists in `lib/pricing/format.ts` via regex heuristics and `deployment` hint.
- **Evidence / Freshness**
  - `Tool.lastVerifiedAt: DateTime?` exists.
  - Vendor pages and listings also derive a “freshness” label from vendor briefs (non-DB content), but the **DB-backed truth** is `lastVerifiedAt`.
- **Modules**
  - Modules are represented by **categories** (`Category.slug`, `ToolCategory` join).
  - Questionnaire stores `categoriesNeeded: string[]` (category slugs).

### Gaps we must acknowledge
- Size bands enum is **not** SMB/MM/Enterprise; it’s 3 overlapping ranges.
- No structured AMC field; on-prem “one-time + AMC” can’t be represented cleanly without parsing or schema changes.
- “Verified” is not a boolean; it’s a timestamp (`lastVerifiedAt`) and sometimes external brief freshness.

This spec defines a filter taxonomy that can be implemented *safely* by mapping onto these fields.

---

## 1) Company size buckets (India): SMB / Mid-Market / Enterprise

### The taxonomy (buyer-facing)
We will expose **three** primary buckets:

| Bucket | Employee range (inclusive) | Why this boundary is justified |
|---|---:|---|
| **SMB** | **20–200** | Aligns with India payroll reality where statutory complexity becomes non-trivial once you’re at the common PF applicability threshold (~20). Also matches existing enum boundary `EMP_20_200`. |
| **Mid‑Market** | **201–1000** | Matches the upper edge of the existing enum (`EMP_100_1000`). Above ~200, multi-location policies, approvals, and payroll edge cases typically become “process heavy”. |
| **Enterprise** | **1001+** | Boundary matches the current schema’s max band (1000) and reflects where procurement/security, integrations, and governance typically shift materially. |

Notes:
- We are intentionally **not** inventing new ranges like 50–500 unless the product can represent them cleanly.
- We can optionally show **“<20 employees”** in copy (micro/startup), but **v1 filters** should remain SMB/MM/Enterprise to avoid schema churn.

### Mapping to current schema (required)
Because the DB uses `BuyerSizeBand`, we need a stable mapping:

- **SMB (20–200)** → `EMP_20_200`
- **Mid‑Market (201–1000)** → `EMP_100_1000`
- **Enterprise (1001+)** → **cannot be represented** today

#### Enterprise gap (explicit)
We currently cannot store “1001+” in `BuyerSizeBand`.

Safe options:
1) **(Preferred for v1)**: Keep UI buckets to SMB/MM only *until* schema adds enterprise, but still use the term “Enterprise” in marketing copy only (not as a filter).
2) Add new enum value `EMP_1000_PLUS` (schema migration required) and backfill where needed.

This doc assumes we want the **filter** to support Enterprise; therefore it requires a schema change later.

---

## 2) Pricing filter logic

### Buyer-facing pricing logic (v1)
Pricing filter must reflect procurement reality:

- **Cloud (SaaS)**: **PEPM** (Per Employee Per Month)
- **On‑prem**: **One‑time license** + **AMC** (optional)

We will expose pricing as a **two-part** concept:
1) **Pricing metric** (unit/type)
2) **On‑prem extras** (AMC presence)

### Compatible representation with current model
Current model has only free-text notes:
- `PricingPlan.priceNote`
- `PricingPlan.setupFeeNote`

And an inferred type:
- `pricingTypeFromNote(note, deployment)` → `per_employee_month | per_company_month | one_time | quote_based`

#### What we can support without schema changes
- **Pricing metric filter** can remain the inferred `PricingType` (already in use on listing pages).
- On‑prem “AMC” can be represented as **a derived boolean** using text parsing:
  - `hasAmc = /(amc|annual\s*maintenance|maintenance\s*fee)/i.test(priceNote + setupFeeNote)`

#### What we cannot represent cleanly today
- AMC as a structured number/value and currency.
- Separating one-time license vs setup fees vs implementation fees.

### Proposed filter UI (v1)
- **Pricing metric** (single-select):
  - PEPM (maps to `per_employee_month`)
  - One-time (maps to `one_time`)
  - Quote-based (maps to `quote_based`)
  - (Optional) Per company / month (maps to `per_company_month`) — keep available because it already exists in code.

- **On-prem extras** (optional toggle):
  - “Includes AMC / maintenance” (maps to derived `hasAmc === true`)

### Safety rules
- **Do not override** pricing metric based only on deployment.
  - Today the code infers `one_time` when `deployment === ONPREM`. That’s acceptable as a fallback but should be treated as a heuristic.
- In UI: if a tool is ONPREM and pricing is unknown, show **Quote-based** or **Info pending**; do not fabricate AMC.

---

## 3) Deployment filter

### Buyer-facing options
- **Cloud / SaaS**
- **On‑prem**
- **Hybrid**

### Mapping
Direct mapping to `ToolDeployment`:
- `CLOUD` → cloud
- `ONPREM` → onprem
- `HYBRID` → hybrid

### Data gap
`Tool.deployment` is optional (`ToolDeployment?`). Many rows may be null.

Implementation implication:
- Filtering by deployment should treat null as “Unknown” and exclude it when a deployment filter is applied.
- UI should display “Unknown” when missing (but not as a filter option in v1 unless needed).

---

## 4) Must-have modules filter normalization

### Principle
In HRSignal, “modules” must map to **Category slugs** (single source of truth).

### Canonical module set (v1)
Use these canonical slugs (existing or to be aligned with existing `Category.slug`):
- `hrms`
- `payroll`
- `attendance` (leave/time)
- `ats`
- `performance`

(We can add later: `recruitment` vs `ats`, `lms`, `engagement`, `expenses`, etc., but v1 must stay consistent.)

### Normalization rules
When ingesting text (admin entry, vendor research, future imports), normalize to canonical modules:
- “Leave” / “Leave management” / “Time off” → `attendance`
- “Time & attendance” / “Shift management” → `attendance`
- “Hiring” / “Recruitment” → `ats`
- “OKR” → `performance`
- “Core HR” / “HRIS” → `hrms`

### Mapping to current model
- Catalog: `Tool.categories` is already a join to categories.
- Questionnaire: `QuestionnaireSubmission.categoriesNeeded: string[]` stores category slugs.

Implementation implication:
- The filter should operate on `Category.slug` and not on free text.

---

## 5) Evidence / Freshness filter (Verified vs Needs validation)

### Definitions (v1, schema-compatible)
We need two states:

- **Verified**: tool has a non-null verification timestamp.
  - Condition: `Tool.lastVerifiedAt != null`

- **Needs validation**: tool has no verification timestamp.
  - Condition: `Tool.lastVerifiedAt == null`

This avoids guessing recency windows (e.g., “verified in last 90 days”), which would require choosing an arbitrary threshold.

### Freshness display
Freshness can be displayed (not filtered) as:
- “Verified: YYYY-MM-DD” when `lastVerifiedAt` exists.
- “Needs validation” when null.

### Known gap
Vendor pages also use “brief updatedAt” to compute freshness. That is useful for content freshness but should not be conflated with tool verification unless we model it explicitly.

---

## 6) What changes are required in code (plan only)

> **Do not implement in this step.** This is the safe migration plan.

### A) Company size buckets (schema + UI)

**Problem:** Current `BuyerSizeBand` overlaps and cannot represent Enterprise.

**Plan:**
1) Add explicit enum values (non-breaking approach):
   - Add `EMP_1_19` (optional)
   - Keep `EMP_20_200`
   - Add `EMP_201_1000` (or rename existing `EMP_100_1000` to avoid breaking — renames are risky)
   - Add `EMP_1001_PLUS`
2) Leave existing values in place for backward compatibility; map old → new in UI until backfill is complete.

**Files likely impacted later:**
- `prisma/schema.prisma` (enum + migration)
- Admin create/edit forms for tools/vendors
- Questionnaire size band pickers
- Listing pages where `sizeLabel()` is currently hardcoded (e.g. `app/vendors/page.tsx`)

**Safe migration steps:**
- Step 1: Schema adds new enum values (no removals).
- Step 2: UI switches to new labels/buckets but still supports old enum values.
- Step 3: Data backfill script (Prisma) to convert old bands to new canonical ones.
- Step 4: Remove old values (optional, future major cleanup).

### B) Pricing filter logic

**Problem:** Need Cloud PEPM vs On-prem one-time + AMC; AMC not structured.

**Plan:**
- Keep `PricingType` inference as the primary metric filter.
- Add derived `hasAmc` via regex on `priceNote + setupFeeNote`.
- Optionally later: add structured fields to `PricingPlan`:
  - `amcNote` or `amcAmount` / `amcPeriod`.

**Files likely impacted later:**
- `lib/pricing/format.ts` (extend parsing + expose helpers)
- Listing pages:
  - `app/vendors/page.tsx`
  - `app/tools/page.tsx`
  - `app/categories/[slug]/page.tsx`
- Tool/vendor cards where pricing pill is displayed

**Safe migration steps:**
- Step 1: Add `hasAmcFromNotes(...)` helper (pure, non-breaking).
- Step 2: Add filter UI toggle but default off.
- Step 3: Backfill/clean pricing notes gradually (no breaking routes).

### C) Deployment filter

**Plan:**
- Keep direct mapping to `Tool.deployment`.
- Ensure null deployment is treated as unknown.

**Files likely impacted later:**
- Listing pages filters (already present on vendors)

### D) Must-have modules normalization

**Plan:**
- Define canonical module slugs list once (shared constant).
- Add a normalizer mapping synonyms → canonical slugs.

**Files likely impacted later:**
- Questionnaire UI (module selection)
- Category filter UI
- Any future import pipelines

### E) Evidence / Freshness filter

**Plan:**
- Filter based on `Tool.lastVerifiedAt` presence.
- Do not introduce time-window “fresh” thresholds in v1.

**Files likely impacted later:**
- Tools/vendors listing filter controls
- `components/trust/*` and vendor page headers if they show freshness badges

---

## 7) Migration safety checklist

- Do not break existing query params (`size`, `pricing`, `deployment`, etc.).
- Add new enum values without removing existing ones.
- Keep UI mapping functions tolerant of unknown/legacy values.
- Prefer additive fields and derived logic over rewriting stored data.
- Add telemetry/logging (server-side) if a filter param is unrecognized.

---

## Appendix: Recommended canonical labels (UI)

- Size:
  - SMB: **20–200**
  - Mid‑Market: **201–1000**
  - Enterprise: **1001+** (only when schema supports it)

- Pricing:
  - **PEPM**
  - **One-time**
  - **Quote-based**
  - (Optional) **Per company / month**

- Deployment:
  - **Cloud**
  - **On‑prem**
  - **Hybrid**

- Evidence:
  - **Verified**
  - **Needs validation**
