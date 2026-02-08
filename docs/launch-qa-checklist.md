# Launch QA Checklist (HRSignal)

Date: 2026-02-08

## Scope
Full-site launch readiness QA:

- Readability (contrast, typography, spacing)
- Broken internal links / 404s
- Missing images (logos/placeholders)
- Consistent brand logo (header/footer)
- Mobile responsiveness (layout doesn’t break at small widths)
- No P0/P1 runtime errors
- Vercel/CI build passes (`next build`)

## Severity definitions
- **P0**: crash/500, broken core funnel, or dead-end navigation
- **P1**: major UX break (unreadable, mobile layout broken, key links missing)
- **P2**: polish (spacing, small copy, minor alignment)

---

## Pages QA (pass/fail)

### Homepage `/`
- Readability: **PASS**
- Brand logo/header/footer: **PASS**
- Mobile: **PASS** (stacking CTAs/modules)
- Links: **PASS**

### Tools directory `/tools`
- Readability: **PASS**
- Filters usable on mobile: **PASS**
- Compare tray interactions: **PASS** (no layout overlap)
- Links: **PASS**

### Tool detail `/tools/[slug]`
- Readability: **PASS**
- Vendor logo rendering: **PASS** (local-first + fallback)
- Links to vendor/site: **PASS**

### Vendors directory `/vendors`
- Readability: **PASS**
- Vendor logos: **PASS**
- Links: **PASS**

### Vendor detail `/vendors/[id]`
- Readability: **PASS**
- Links: **PASS**

### Categories `/categories`
- Runtime: **PASS** (after fix below)
- Readability: **PASS**
- Mobile: **PASS**

### Recommend `/recommend` → submit → `/recommend/success` → `/results/[id]`
- Core funnel: **PASS**
- Lead capture UX: **PASS** (email failures non-blocking)
- Mobile: **PASS**

### Compare `/compare`
- Readability: **PASS**
- Mobile: **PASS** (cards stack)
- Copy/share: **PASS**

### Resources `/resources` and `/resources/[slug]`
- Featured article block: **PASS**
- Reading time/category/tags visible: **PASS**
- Mobile: **PASS**

### Admin (basic smoke)
- `/admin/login`: **PASS**
- `/admin/leads`: **PASS**

---

## Issues found + fixes

### P0: `/categories` returned 500 in production build
- **Symptom**: `Element type is invalid: ... got undefined.`
- **Cause**: `CategoryCard` icon map only supported 5 slugs; new slugs (`bgv`, `lms`, `engagement`) rendered `undefined` icon component.
- **Fix**:
  - Expanded `CategoryCard` icon map to include `bgv`, `lms`, `engagement`.
  - Added safe fallback icon (`Sparkles`) for unknown slugs.
  - Removed hard-cast in `app/categories/page.tsx` so future categories don’t crash.

### P0: Footer resource links were dead
- **Symptom**: Footer linked to non-existent slugs (`/resources/hrms-selection-india-sme`, `/resources/payroll-compliance-checklist`).
- **Fix**: Updated footer links to existing slugs:
  - `/resources/best-hrms-india-sme-2026`
  - `/resources/payroll-compliance-checklist-india-2026`

### P1: Footer styling inconsistency on dark theme
- **Symptom**: “Resources” link in footer used light-theme classes (`text-gray-600`).
- **Fix**: Updated to dark-theme classes to match other footer links.

### P1: Dead-end legal links
- **Symptom**: `/privacy` and `/terms` linked in footer but returned 404.
- **Fix**: Added minimal v1 pages:
  - `app/privacy/page.tsx`
  - `app/terms/page.tsx`

---

## Build / deploy readiness

- ESLint: **PASS** (`npm run lint`)
- Next build: **PASS** (`npm run build`)
- Notes:
  - Next.js warning about middleware convention deprecation persists; not launch-blocking.

