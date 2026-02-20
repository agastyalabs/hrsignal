# Phase 6D — Release readiness checklist

This is a **pre-launch, go/no-go checklist** for HRSignal.

Constraints
- This phase is **documentation only** (no code changes).
- Do **not** touch `main`.

---

## A) Routes smoke test list (manual)

Open each route on **both domains** (if both are live):
- `https://hrsignal.in/...`
- `https://hrsignal.vercel.app/...`

Checklist (core)
- [ ] `/` Home loads (no console errors, header/footer visible, CTAs clickable)
- [ ] `/tools` directory loads (search in header works; filters submit; tool cards render)
- [ ] `/tools/[slug]` pick 3–5 slugs (includes at least one payroll tool)
- [ ] `/vendors` directory loads (filters apply; cards render)
- [ ] `/vendors/[slug]` pick 3–5 vendors (including `freshteam` special-case)
- [ ] `/categories` loads (category cards + counts render)
- [ ] `/categories/[slug]` pick: `payroll-india`, `hrms`, `attendance`, `ats`
- [ ] `/compare` empty state loads
- [ ] `/compare?tools=<slug1>,<slug2>` compare table renders
- [ ] `/compare/vendors` loads
- [ ] `/resources` lists articles, featured card renders (or graceful if none featured)
- [ ] `/resources/[slug]` open 2–3 articles
- [ ] `/compliance` loads
- [ ] `/compliance/[slug]` open each of:
  - [ ] `/compliance/pf-compliance-guide`
  - [ ] `/compliance/esi-complete-guide`
  - [ ] `/compliance/pt-multi-state-guide`
  - [ ] `/compliance/tds-payroll-guide`
- [ ] `/recommend` loads, form is usable, completion navigates to success state
- [ ] `/recommend/success` loads
- [ ] `/india-payroll-risk-checklist` loads and download path works
- [ ] `/payroll-risk-scanner` loads
- [ ] `/hrms-fit-score` loads
- [ ] `/methodology` loads
- [ ] `/privacy` loads
- [ ] `/terms` loads

Admin (only if intended for prod access)
- [ ] `/admin/login` loads
- [ ] `/admin` access control behaves as intended
- [ ] `/admin/mission-control` loads
- [ ] `/admin/leads` loads

---

## B) Key CTAs (click-path verification)

Header
- [ ] Primary CTA in header ("Get my shortlist") → `/recommend`
  - Source: `/components/layout/SiteHeader.tsx`
- [ ] Header search (desktop) submits to `/tools?q=...`
  - Source: `/components/layout/SiteHeader.tsx`

Home
- [ ] Hero email capture → submits to `/recommend` with `email` + `source=hero_email`
  - Source: `/app/page.tsx`
- [ ] “Compare tools →” goes to `/compare`
  - Source: `/app/page.tsx`

Directories
- [ ] Tools page CTA “Get recommendations” → `/recommend`
  - Source: `/app/tools/page.tsx`
- [ ] Resources page CTA “Get recommendations” → `/recommend`
  - Source: `/app/resources/page.tsx`

Sticky / floating elements
- [ ] Floating “Get my shortlist” CTA appears after scroll on non-home pages and doesn’t overlap Compare tray
  - Source: `/components/marketing/FloatingShortlistCta.tsx`
- [ ] Compare tray actions work: “Compare now”, “Clear”, removing individual tools
  - Source: `/components/compare/CompareTray.tsx`

---

## C) Lead flow tests (forms → `/api/leads` → Resend)

### C1) API contract sanity
Endpoint
- `POST /api/leads`
  - Source: `/app/api/leads/route.ts`

Expected payload
```json
{
  "type": "shortlist" | "checklist" | "report" | "vendor_claim" | "generic",
  "email": "user@company.com",
  "metadata": { "any": "object" }
}
```

Response (success)
- `{ success: true, leadId, emailSent, errorCode, resendStatus }`

Checklist
- [ ] Invalid JSON → 400
- [ ] Invalid email → 400 with helpful message
- [ ] Honeypot field `website` present → returns `{success:true}` (anti-spam)
- [ ] DB insert happens **before** Resend (Resend failure must not lose lead)

### C2) Manual lead submissions (local or staging)

Using curl (adjust BASE):
```bash
BASE="http://localhost:3000"

curl -sS "$BASE/api/leads" \
  -H 'content-type: application/json' \
  -d '{"type":"checklist","email":"qa@example.com","metadata":{"sourcePage":"homepage","role":"HR","companySize":"51-200"}}'
```

Checklist
- [ ] Returns `success:true` and a `leadId`
- [ ] If Resend is configured: internal notification email received by allowed recipients
- [ ] If type=`checklist`: buyer email contains download link
- [ ] Confirm PDF path exists and loads:
  - `/public/downloads/india-payroll-risk-checklist.pdf`

### C3) Resend configuration checks
- [ ] `RESEND_API_KEY` set
- [ ] `RESEND_FROM_EMAIL` set
- [ ] Internal recipients are correct
  - Code allowlist: `/app/api/leads/route.ts` (`ALLOWED_NOTIFY`)

### C4) UI entry points that should trigger lead capture
Checklist
- [ ] Checklist download form → posts to `/api/leads` type=`checklist`
  - Source: `/components/lead/ChecklistDownloadCard.tsx`
- [ ] Vendor claim form → posts to `/api/leads` type=`vendor_claim`
  - Source: `/app/vendors/claim/page.tsx`
- [ ] Recommendation flow: ensure at least one step creates a lead (confirm where it happens)
  - Source candidates: `/app/recommend/*`, `/components/recommend/*`, `/app/recommend/submit/route.ts`

Note
- The home hero form currently **GETs** `/recommend` (does not POST `/api/leads`). Decide if that’s intended.

---

## D) SEO checks (titles/descriptions/canonicals)

### D1) Metadata consistency
Global metadata
- [ ] `metadataBase` points to the correct canonical domain for production
  - Source: `/app/layout.tsx` (currently hardcoded to `https://hrsignal.vercel.app`)
- [ ] Title + description match the final brand (and brand spacing: “HR Signal” vs “HRSignal”)
  - Sources: `/app/layout.tsx`, `/config/brand.ts`

Page-level canonicals
- [ ] Each core directory page declares canonical
  - Sources:
    - `/app/tools/page.tsx`
    - `/app/vendors/page.tsx`
    - `/app/categories/page.tsx`
    - `/app/resources/page.tsx`
- [ ] Dynamic pages use canonical URLs correctly
  - Sources:
    - `/app/tools/[slug]/page.tsx`
    - `/app/vendors/[slug]/page.tsx`
    - `/app/categories/[slug]/page.tsx`
    - `/app/resources/[slug]/page.tsx`

Checklist
- [ ] Titles are unique and descriptive
- [ ] Descriptions are not duplicated sitewide
- [ ] Canonical URLs point to **one** domain (avoid mixing vercel + hrsignal.in)

### D2) OpenGraph/Twitter cards
- [ ] `/public/og.png` exists and renders
- [ ] `openGraph.images` and `twitter.images` are correct
  - Source: `/app/layout.tsx`

---

## E) Sitemap checks

### E1) Implementation
- [ ] `GET /sitemap.xml` returns 200 and includes key routes
  - Source: `/app/sitemap.ts`

Checklist
- [ ] Sitemap uses the correct base domain
  - Current: `/app/sitemap.ts` hardcodes `const BASE = "https://hrsignal.vercel.app"`
- [ ] Includes:
  - Home, directories, static guides, resources
  - Tool detail pages (if DB connected)
  - Vendor pages (derived slug)
  - Category pages

### E2) robots.txt
- [ ] `GET /robots.txt` returns 200 and points to correct sitemap URL
  - Source: `/app/robots.ts` (currently hardcoded to vercel)

---

## F) JSON-LD checks

Global org JSON-LD
- [ ] Organization JSON-LD present once
  - Source: `/app/layout.tsx` (`orgJsonLd`)
- [ ] `url` and `logo` use the canonical domain

Page JSON-LD
- [ ] Tools directory emits ItemList schema
  - Source: `/app/tools/page.tsx`
- [ ] Vendors directory emits ItemList schema
  - Source: `/app/vendors/page.tsx`
- [ ] Categories emits ItemList schema
  - Source: `/app/categories/page.tsx`
- [ ] Vendor detail emits SoftwareApplication (+ optional FAQPage)
  - Source: `/app/vendors/[slug]/page.tsx`

Checklist (validation)
- [ ] Validate 3–5 representative pages in Google Rich Results Test
- [ ] No console errors for JSON-LD injection

---

## G) Lighthouse run instructions

Run Lighthouse against **production** and **preview** deployments.

### G1) Chrome DevTools
1. Open the page in Chrome (Incognito recommended)
2. DevTools → Lighthouse
3. Categories: Performance, Accessibility, Best Practices, SEO
4. Device: Mobile + Desktop
5. Run for:
   - [ ] `/`
   - [ ] `/tools`
   - [ ] `/vendors`
   - [ ] `/resources`
   - [ ] `/recommend`

### G2) CLI (optional)
```bash
npm i -g lighthouse
lighthouse https://hrsignal.in/ --view --preset=desktop
lighthouse https://hrsignal.in/tools --view --preset=mobile
```

Checklist
- [ ] No CLS regressions from sticky header/trays
- [ ] Images optimized (size + format)
- [ ] Good contrast + focus indication

---

## H) Dual-domain-safe URL building (hrsignal.in vs hrsignal.vercel.app)

Goal
- The app should be safe to serve from either domain, but SEO/canonicals/sitemap/robots should consistently prefer the **production canonical**.

### H1) What is currently domain-safe
- [ ] Leads email download origin is derived from `NEXT_PUBLIC_SITE_URL` or request origin
  - Source: `/app/api/leads/route.ts` (`originFrom(req)`) ✅

### H2) What is currently hardcoded to `hrsignal.vercel.app` (needs review)
These will be wrong if canonical domain is `hrsignal.in`:
- [ ] Global metadata base + JSON-LD URLs
  - Source: `/app/layout.tsx` (hardcoded metadataBase + orgJsonLd url/logo)
- [ ] Sitemap base
  - Source: `/app/sitemap.ts` (`const BASE = "https://hrsignal.vercel.app"`)
- [ ] Robots sitemap URL
  - Source: `/app/robots.ts`
- [ ] `absUrl()` helper uses a constant SITE_URL
  - Sources: `/lib/seo/url.ts`, used by `/app/resources/[slug]/page.tsx`, `/app/vendors/[slug]/page.tsx`, etc.
- [ ] Multiple pages hardcode canonicals to `https://hrsignal.vercel.app/...`
  - Examples: `/app/tools/page.tsx`, `/app/vendors/page.tsx`, `/app/categories/page.tsx`, `/app/resources/page.tsx`

Release checklist decision
- [ ] Decide canonical production domain (likely `https://hrsignal.in`)
- [ ] Ensure **all** canonicals + sitemap + robots + JSON-LD use that domain
- [ ] Ensure internal navigation still works on both domains

---

## I) Final go/no-go

P0 (block release)
- [ ] Any route 500s
- [ ] Lead capture fails to insert into DB
- [ ] Sitemap/robots/canonicals point to the wrong domain
- [ ] Major accessibility failures (unreadable text, no keyboard navigation)

P1 (ship with plan)
- [ ] Minor design inconsistencies
- [ ] Non-critical SEO polish (description duplication)

