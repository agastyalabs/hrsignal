# HRSignal Repo Audit (as of 2026-02-12)

Scope: repo map, routes/pages, key components, API routes, and environment variables.

> Notes
> - This is an **audit / analysis only**. No code changes are proposed here.
> - Sensitive values are **not** reproduced (e.g., contents of `.env`).

---

## 1) High-level repo map

Top-level (key folders/files):

- `app/` — Next.js App Router (pages + API routes)
- `components/` — UI and product components
- `lib/` — server utilities (Prisma client, SEO, pricing parsing, vendor brief loader, compare storage)
- `prisma/` — Prisma schema + migrations
- `public/` — static assets (brand, icons, **PDF downloads**)
- `scripts/` — seed + test scripts
- `docs/` — product + engineering documentation
- `middleware.ts` — admin auth gate

---

## 2) Runtime + stack

- Next.js: `16.1.6` (Turbopack)
- React: `19.x`
- Prisma: `6.x`
- Auth: `next-auth`
- Email delivery: **Resend** (`resend` dependency) but implemented via direct `fetch("https://api.resend.com/emails")`

Key scripts (`package.json`):
- `npm run dev`
- `npm run lint`
- `npm run build` (runs `prisma generate && next build`)

---

## 3) App routes / pages (App Router)

### Core marketing / discovery
- `/` → `app/page.tsx` (homepage)
- `/categories` → `app/categories/page.tsx`
- `/categories/[slug]` → `app/categories/[slug]/page.tsx`
- `/categories/payroll-india` → `app/categories/payroll-india/page.tsx`
- `/tools` → `app/tools/page.tsx`
- `/tools/[slug]` → `app/tools/[slug]/page.tsx`
- `/vendors` → `app/vendors/page.tsx`
- `/vendors/[slug]` → `app/vendors/[slug]/page.tsx`
- `/resources` → `app/resources/page.tsx`
- `/resources/[slug]` → `app/resources/[slug]/page.tsx`

### Compare / report
- `/compare` → `app/compare/page.tsx`
- `/compare/vendors` → `app/compare/vendors/page.tsx`
- `/compare/[slug]` → `app/compare/[slug]/page.tsx`
- `/report` → `app/report/page.tsx` (print-to-PDF workflow)

### Recommendation flow / results
- `/recommend` → `app/recommend/page.tsx`
- `/recommend/success` → `app/recommend/success/page.tsx`
- `/results/[id]` → `app/results/[id]/page.tsx` + client UI in `app/results/[id]/results-client.tsx`

### Trust / methodology / risk content
- `/methodology` → `app/methodology/page.tsx`
- `/payroll-risk-scanner` → `app/payroll-risk-scanner/page.tsx`
- `/india-payroll-risk-checklist` → `app/india-payroll-risk-checklist/page.tsx`
- `/hrms-fit-score` → `app/hrms-fit-score/page.tsx`

### Static / platform
- `/privacy` → `app/privacy/page.tsx`
- `/terms` → `app/terms/page.tsx`
- `/robots.txt` → `app/robots.ts`
- `/sitemap.xml` → `app/sitemap.ts`

### Admin
- `/admin` → `app/admin/page.tsx`
- `/admin/login` → `app/admin/login/page.tsx`
- `/admin/tools` + `new` → `app/admin/tools/page.tsx`, `app/admin/tools/new/page.tsx`
- `/admin/vendors` + `new` → `app/admin/vendors/page.tsx`, `app/admin/vendors/new/page.tsx`
- `/admin/leads` + `new` → `app/admin/leads/page.tsx`, `app/admin/leads/new/page.tsx`
- `/admin/seed` → `app/admin/seed/page.tsx`

Middleware gate:
- `middleware.ts` protects `/admin/*` except `/admin/login`.

---

## 4) API routes

All API routes live under `app/api/*`:

### Lead capture
- `POST /api/leads` → `app/api/leads/route.ts`
  - **Best-effort** DB insert to `Lead` + best-effort Resend notify.
  - Returns **200** on non-validation failures.
- `POST /api/leads/submit` → `app/api/leads/submit/route.ts`
  - “Unified lead capture” style endpoint used by:
    - results unlock + results intro (client)
    - recommend submit (server action route)
  - **Does not write to DB**; logs lead payload; internal + buyer email are best-effort.
- `POST /api/leads/checklist` → `app/api/leads/checklist/route.ts`
  - Used by the checklist download capture card.
  - Buyer and internal email are **required**; returns 500 if Resend fails.

### Recommendations / tools
- `POST /api/recommendations` → `app/api/recommendations/route.ts`
- `POST /api/tools` → `app/api/tools/route.ts` (also used for `lastVerifiedAt` fetches)

### Auth / Telegram
- `GET|POST /api/auth/[...nextauth]` → `app/api/auth/[...nextauth]/route.ts`
- `POST /api/telegram/webhook` → `app/api/telegram/webhook/route.ts`

---

## 5) Key components (by responsibility)

### Layout
- `components/layout/SiteHeader.tsx`
- `components/layout/SiteFooter.tsx`
- `components/layout/Container.tsx`
- `components/layout/Section.tsx`

### UI primitives
- `components/ui/Button.tsx`
- `components/ui/Card.tsx`
- `components/ui/Badge.tsx`
- `components/ui/Input.tsx`
- `components/ui/Toast.tsx`

### Catalog cards
- `components/catalog/ToolCard.tsx`
- `components/catalog/VendorCard.tsx`
- `components/catalog/CategoryCard.tsx`

### Lead capture UI
- `components/lead/ChecklistDownloadCard.tsx` (posts to `/api/leads/checklist`)

### Vendor detail premium blocks
- `components/vendors/EvidenceLinks.tsx`
- `components/vendors/StickyCtas.tsx` (includes `window.print()` “Export PDF (print)” CTA)

### Compare
- `components/compare/*` (tray + toggle)
- `lib/compare/*` (storage + hook)

### Homepage V4/V5 utilities
- `components/marketing/HomeSection.tsx`

---

## 6) `lib/` highlights

- `lib/db.ts` — Prisma client setup
- `lib/pricing/format.ts` — pricing metric inference + normalized display
- `lib/vendors/brief.ts` — vendor brief loader (evidence URL extraction + updatedAt)
- `lib/vendors/researched.ts` — curated vendor research profiles (best-for/not-for/faqs/evidence links)
- `lib/vendors/slug.ts` — canonical slug logic
- `lib/filters/taxonomy.ts` — taxonomy param normalization + mapping utilities
- `lib/seo/url.ts` — canonical/absolute URL helpers
- `lib/recommendations/engine.ts` — recommendations engine

---

## 7) Static assets relevant to current issues

- Checklist PDF exists:
  - `public/downloads/india-payroll-risk-checklist.pdf`

---

## 8) Environment variables (observed + docs)

### Required
- `DATABASE_URL` (Prisma)

### Admin auth
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AUTH_SECRET`

### Lead / email delivery (Resend)
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `LEAD_NOTIFY_EMAILS` (preferred)
- `LEAD_EMAIL_TO` (back-compat)

### Site URL
- `NEXT_PUBLIC_SITE_URL` (used by `/api/leads/checklist` to form absolute download links)

### Telegram / forwarding
- `TELEGRAM_WEBHOOK_SECRET`
- `TELEGRAM_ALLOWED_USER_ID`
- `TELEGRAM_BOT_TOKEN`
- `OPENCLAW_FORWARD_URL`
- `OPENCLAW_FORWARD_TOKEN`

Docs:
- `docs/ENV.md`
- `docs/ENV_VARS.md`

---

## 9) Known mismatches / risk points surfaced in audit

1) **Lead capture is split across 3 endpoints** with different semantics:
   - `/api/leads` writes to DB and is best-effort for email.
   - `/api/leads/submit` does not write to DB and best-effort emails (can silently skip if env not set).
   - `/api/leads/checklist` fails hard (500) if Resend not configured / errors.

2) **PDF download link construction is inconsistent**:
   - `/api/leads/checklist` builds download URL from request origin + `NEXT_PUBLIC_SITE_URL`.
   - `/api/leads/submit` uses a hard-coded `https://hrsignal.vercel.app/...` URL and calls it “placeholder”.

3) **“Export report (PDF)” is print-to-PDF, not a direct download**:
   - `/recommend` links to `/report`.
   - `/report` requires user action to `window.print()`.

These connect directly to the prioritized NEXT_STEPS.
