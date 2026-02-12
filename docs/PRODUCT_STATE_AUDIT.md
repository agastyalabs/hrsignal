# FULL PRODUCT AUDIT — HRSignal A–C41 State Report

Audit date: **2026-02-12**

Repo root: `/home/niranjan/projects/hrsignal`  
Production: https://hrsignal.vercel.app (Vercel, `main`)

This is a **factual repo + docs + git-history audit**. No redesign, no implementation.

---

## Executive summary (1 page)

### Current state (what’s true right now)
- The product has a full **browse → shortlist → results → compare → report** skeleton in place.
- Vendor pages are **premium-upgraded** with Evidence links and sticky CTAs.
- **Payroll risk checklist PDF** is present and serves correctly from production.

### Primary risks to launch readiness
1) **Lead capture is not unified** across all lead capture surfaces.
   - There are multiple endpoints with different semantics (`/api/leads`, `/api/leads/submit`, `/api/leads/checklist`).
   - This increases the chance that “email not arriving” happens depending on which page the user used.

2) **Decision report page `/report` is linked in navigation but is not safe as a standalone landing page.**
   - Live crawl shows `/report` can return **HTTP 500** when opened without expected query params.

3) **Category taxonomy mismatch** (spec vs implementation)
   - Header dropdown links legacy category slugs (`/categories/payroll`, `/categories/hrms`, …).
   - Architecture spec later introduced canonical slugs (`payroll-india`, `hrms-core`, …) but these are not the nav primary.

### Launch readiness score (0–100)
**72 / 100**

Scoring (high-level):
- Core flows exist and are navigable (+)
- Several high-impact reliability issues remain: lead-to-inbox unification, `/report` 500, taxonomy mismatch (–)

### What to fix next (highest ROI)
1) Unify all lead capture into **one capture pipeline** (shared Resend + consistent response contract).
2) Make `/report` safe as a standalone page (no 500) or remove it from nav until safe.
3) Align categories nav + content with the chosen canonical slugs (or document that legacy slugs are canonical for v1).

---

## Evidence sources used

### Repo scan
- `app/` routes
- `components/`
- `lib/`
- `public/`
- `docs/`

### Docs read (representative)
- `docs/DEPLOY_LOG.md` (note: contains unresolved merge conflict markers)
- `docs/DEPLOY_CHECKLIST.md`
- `docs/PAGES.md`
- `docs/ENV.md`, `docs/ENV_VARS.md`
- `docs/LEAD_CAPTURE_FUNNEL.md`, `docs/LEAD_MAGNET_*`

### Git history scan
- `git log --oneline -n 80` used to identify major feature commits (see section 2).

### Live-site verification used in this audit
- PDF availability check:
  - `https://hrsignal.vercel.app/downloads/india-payroll-risk-checklist.pdf` → **HTTP 200**
- Prior crawl output (from `docs/LIVE_SITE_AUDIT.md`): `/report` observed returning **HTTP 500**.

---

## 1) Repository structure (quick map)

- `app/` — Next.js App Router pages + API routes
- `components/` — UI primitives + product components
- `lib/` — Prisma/db, vendor briefs, SEO helpers, pricing inference, taxonomy normalizers
- `prisma/` — schema
- `public/` — brand assets + downloads (PDF)
- `scripts/` — seed/tests
- `docs/` — specs, QA, deploy logs

---

## 2) Major feature commits (from git history)

Not exhaustive, but the major product milestones visible in `main` history:

- `5eac514` — results clarity + trust (results client improvements)
- `338e48f` — SEO: sitemap + canonical + structured data
- `05698a4` — UI: premium product lock v1
- `cec193c` — vendor detail premium upgrade
- `607ab48` — homepage v5 narrative reset
- `3ce462d` — gated shortlist unlock v1
- `981175e` — export decision report v1
- `792885b` — payroll risk scanner v1
- `3c773aa` — payroll india category pillar v1
- `3d33633` — unified lead pipeline v1 (note: still split endpoints)
- `ff81056` — checklist PDF delivery + resend emails v1

---

## 3) Feature state by category

For each category:
- **Status**: COMPLETE / PARTIAL / MISSING / BROKEN
- **Where implemented**: key file paths
- **Reachable via navigation**: Header/Footer/internal links

### 3.1 Homepage
- **Status:** COMPLETE
- **Where implemented:**
  - `app/page.tsx`
  - `components/marketing/HomeSection.tsx`
- **Reachable via navigation:** Yes (`/` brand link in header)
- **Notes:** Homepage is intentionally narrative-focused with minimal hype per recent V5 reset.

### 3.2 Vendor pages

#### Vendors listing (`/vendors`)
- **Status:** COMPLETE
- **Where implemented:**
  - `app/vendors/page.tsx`
  - `components/catalog/VendorCard.tsx`
  - `lib/vendors/brief.ts` (evidence URLs/freshness)
- **Reachable via navigation:** Yes (Header “Vendors”, Footer “Vendors”)

#### Vendor detail (`/vendors/[slug]`)
- **Status:** COMPLETE
- **Where implemented:**
  - `app/vendors/[slug]/page.tsx`
  - `components/vendors/EvidenceLinks.tsx`
  - `components/vendors/StickyCtas.tsx` (compare / shortlist / print)
- **Reachable via navigation:** Yes (from listing cards; direct links in header/footer exist)
- **Notes:** Includes fit score heuristics, decision snapshot, comparison preview, sticky CTAs.

### 3.3 Category decision pages

#### Categories index (`/categories`)
- **Status:** COMPLETE
- **Where implemented:**
  - `app/categories/page.tsx`
- **Reachable via navigation:** Yes (Header “Categories”, Footer “Categories”)

#### Category detail (`/categories/[slug]`)
- **Status:** PARTIAL
- **Where implemented:**
  - `app/categories/[slug]/page.tsx`
  - `app/categories/payroll-india/page.tsx` (pillar)
- **Reachable via navigation:**
  - Legacy slugs reachable from header dropdown: `/categories/payroll`, `/categories/hrms`, `/categories/attendance`, `/categories/ats`, `/categories/performance`.
  - Payroll India pillar reachable under Resources menu and footer: `/categories/payroll-india`.
- **Gap:** Canonical taxonomy spec (later) defines different slugs (`payroll-india`, `hrms-core`, etc.) than those linked as “Popular categories” in header.

### 3.4 Comparison mode

#### Tool compare (`/compare`)
- **Status:** COMPLETE
- **Where implemented:**
  - `app/compare/page.tsx`
  - `components/compare/CompareTray.tsx`, `components/compare/CompareToggle.tsx`
  - `lib/compare/storage.ts`, `lib/compare/useCompare.ts`
- **Reachable via navigation:** Yes (Footer “Compare”, header compare count link derived)

#### Vendor compare (`/compare/vendors`)
- **Status:** PARTIAL
- **Where implemented:**
  - `app/compare/vendors/page.tsx`
  - `components/vendor-compare/VendorCompareTray` (exists as `components/vendor-compare/VendorCompareTray` usage in vendors page)
- **Reachable via navigation:**
  - Present in header **mobile** menu (link: `/compare/vendors`).
  - Not clearly exposed in primary desktop nav.

### 3.5 Shortlist flow

- **Status:** PARTIAL
- **Where implemented:**
  - Wizard entry: `app/recommend/page.tsx`
  - Submit route: `app/recommend/submit/route.ts` (creates submission + run)
  - Success: `app/recommend/success/page.tsx`
  - Results: `app/results/[id]/page.tsx` + `app/results/[id]/results-client.tsx`
- **Reachable via navigation:**
  - `/recommend` is in header CTA and footer
  - `/results/[id]` reachable via flow
- **Issues:**
  - Results has “unlock” gating and lead capture calls `/api/leads/submit` (separate pipeline from `/api/leads`).

### 3.6 Lead capture (Resend integration)

- **Status:** PARTIAL
- **Where implemented (current endpoints):**
  - `POST /api/leads` → `app/api/leads/route.ts` (**DB insert + best-effort email notify**)
  - `POST /api/leads/submit` → `app/api/leads/submit/route.ts` (**no DB insert; best-effort internal + buyer email; can skip if env missing**)
  - `POST /api/leads/checklist` → `app/api/leads/checklist/route.ts` (**hard-fails 500 if Resend not configured or send fails**)
- **Where called from (forms):**
  - `app/results/[id]/results-client.tsx` → `/api/leads/submit` (unlock + intro)
  - `app/recommend/submit/route.ts` → `/api/leads/submit`
  - `components/lead/ChecklistDownloadCard.tsx` → `/api/leads/checklist`
- **Verification requirement (“all lead forms call same Resend logic”):** ❌ **Not met**
  - Resend sending logic and recipient allowlist are duplicated across 3 routes with differing failure behavior.

### 3.7 Checklist PDF export

- **Status:** PARTIAL
- **What works:**
  - Static PDF exists: `public/downloads/india-payroll-risk-checklist.pdf`
  - Live production URL returns **HTTP 200**.
- **Where implemented:**
  - PDF asset: `public/downloads/india-payroll-risk-checklist.pdf`
  - Capture UI: `components/lead/ChecklistDownloadCard.tsx`
  - Email send: `app/api/leads/checklist/route.ts`
  - Landing page: `app/india-payroll-risk-checklist/page.tsx`
- **Risk:**
  - `/api/leads/checklist` returns 500 if Resend fails, which can block user from receiving link even though PDF is publicly accessible.

### 3.8 Risk scanner

- **Status:** COMPLETE
- **Where implemented:**
  - `app/payroll-risk-scanner/page.tsx`
- **Reachable via navigation:** Yes (Header Resources menu, Footer)

### 3.9 HRSignal Index (Readiness Score)

- **Status:** COMPLETE (as a displayed index; not necessarily as a formal product spec)
- **Where implemented:**
  - Vendors listing displays “HRSignal Readiness Score™”: `app/vendors/page.tsx`, `components/catalog/VendorCard.tsx`
  - Recommend ranking + report scoring logic: `app/recommend/page.tsx`, `app/report/page.tsx`
  - Vendor detail uses fit heuristics: `app/vendors/[slug]/page.tsx`
- **Reachable via navigation:** Yes (via vendors listing and recommend/report flows)

### 3.10 Payroll India page

- **Status:** COMPLETE
- **Where implemented:**
  - `app/categories/payroll-india/page.tsx`
- **Reachable via navigation:** Yes (Header Resources menu includes “Payroll India guide”)

---

## 4) Dead pages (no obvious internal navigation entry)

Based on static route list vs header/footer/homepage link scanning:

### Public-ish pages that are weakly linked or not linked
- `/stack-builder` → `app/stack-builder/page.tsx`
  - Not present in header/footer.
  - May be legacy (older recommend concept).

- `/vendors/claim` → `app/vendors/claim/page.tsx`
  - Not present in header/footer.
  - If intended for vendor claim flow, it needs a discoverable entry point or should be kept as “direct link only”.

### Pages reachable only through flows
- `/recommend/success` → reached only after `/recommend/submit`

### Internal-only pages (intentionally not in nav)
- `/admin/*` routes (protected by `middleware.ts`)

---

## 5) Duplicate UI blocks / logic duplication

### Lead / Resend duplication
Resend logic is duplicated (same concepts, different behavior) in:
- `app/api/leads/route.ts`
- `app/api/leads/submit/route.ts`
- `app/api/leads/checklist/route.ts`

Also duplicated:
- notify recipient allowlist + env parsing

Impact:
- inconsistent reliability and inconsistent UX error handling.

---

## 6) Inconsistent styling / content issues

### Styling inconsistency
- Several pages/components still use older Tailwind colors (e.g., `text-indigo-*`, `bg-black`) mixed with token-based theme usage.
  - Example occurrences (not exhaustive):
    - `app/compare/page.tsx` (older indigo utility usage still present)
    - `app/tools/[slug]/page.tsx` uses `text-[#8B5CF6]` in some links

### Hardcoded / dummy content
- `app/api/leads/submit/route.ts` includes “Download PDF (placeholder)” anchor text and hard-coded URL usage (not using request origin consistently).

### Docs quality issue
- `docs/DEPLOY_LOG.md` currently contains unresolved merge conflict markers (`<<<<<<< HEAD` / `>>>>>>> dev`).

---

## 7) Unused components (likely)

These components appear to have **no imports/usage** after the homepage rewrites:
- `components/marketing/MetricCard.tsx`
- `components/marketing/StepCard.tsx`
- `components/marketing/CompareRow.tsx`

This is not harmful but adds maintenance surface area.

---

## 8) Verification checks (explicit)

### 8.1 All lead forms call same Resend logic
- **Result:** ❌ FAIL
- **Reason:** Different forms call different endpoints:
  - Results + recommend submit → `/api/leads/submit`
  - Checklist capture → `/api/leads/checklist`
  - Other lead capture surfaces may call `/api/leads`
- **Fix direction (not implementing):** consolidate to one capture utility + one canonical API.

### 8.2 PDF download logic works in production
- **Checklist PDF:** ✅ PASS
  - `https://hrsignal.vercel.app/downloads/india-payroll-risk-checklist.pdf` returns **HTTP 200**.
- **Decision report “PDF export”:** ⚠️ PARTIAL
  - It is print-to-PDF (`window.print()`) and `/report` may error without params.

---

## Appendix: Key file paths referenced

- Homepage: `app/page.tsx`
- Vendors:
  - Listing: `app/vendors/page.tsx`
  - Detail: `app/vendors/[slug]/page.tsx`
- Categories:
  - Index: `app/categories/page.tsx`
  - Detail: `app/categories/[slug]/page.tsx`
  - Payroll India: `app/categories/payroll-india/page.tsx`
- Compare:
  - Tool compare: `app/compare/page.tsx`
  - Vendor compare: `app/compare/vendors/page.tsx`
- Shortlist:
  - Recommend: `app/recommend/page.tsx`
  - Submit: `app/recommend/submit/route.ts`
  - Results client: `app/results/[id]/results-client.tsx`
- Leads:
  - DB lead: `app/api/leads/route.ts`
  - Unified-ish: `app/api/leads/submit/route.ts`
  - Checklist: `app/api/leads/checklist/route.ts`
  - Checklist UI: `components/lead/ChecklistDownloadCard.tsx`
- PDFs:
  - Checklist: `public/downloads/india-payroll-risk-checklist.pdf`
- Report:
  - `app/report/page.tsx`
- Navigation:
  - Header: `components/layout/SiteHeader.tsx`
  - Footer: `components/layout/SiteFooter.tsx`
