<<<<<<< HEAD
# DEPLOY_LOG

> Production deploy log (Vercel). Keep this file append-only.

## 2026-02-10
- **Resolved production deployment (Vercel):** https://hrsignal-292fn55nc-agastyalabs-projects.vercel.app
- **Alias:** https://hrsignal.vercel.app
- **Notes:**
  - Deployed `main` to production (no code changes in this deploy). Confirmed `/vendors/freshteam` renders. Freshteam vendor brief benchmark-format content is live.
  - Disabled caching for HTML routes (Cache-Control: no-store / max-age=0,must-revalidate) so Safari/iOS normal refresh picks up latest deploy without hard refresh; static hashed assets remain immutable-cached.
=======
# HRSignal — Deploy Log

This file tracks production deployments for UX plan work.

## 2026-02-14

- **Deployment URL:** https://hrsignal.vercel.app
- **Resolved production deployment (Vercel):** https://hrsignal-ln5m5q9mf-agastyalabs-projects.vercel.app

### Final launch redeploy (forced no build cache)

- **Action:** Purged Vercel CDN + data cache; forced redeploy with `VERCEL_FORCE_NO_BUILD_CACHE=1`.
- **Command:** `vercel deploy --prod --yes --force -b VERCEL_FORCE_NO_BUILD_CACHE=1`
- **Notes:** HTML is served with `cache-control: private, no-cache, no-store` and `x-vercel-cache: MISS` (verified via curl).
- **Audit limitation:** Lighthouse + responsive overlap checks require a real Chromium/Chrome binary; this environment does not have one installed.

## 2026-02-09

- **Deployment URL:** https://hrsignal.vercel.app
- **Resolved production deployment (Vercel):** https://hrsignal-79p9oda63-agastyalabs-projects.vercel.app

### Hotfix — vendor page crash digest 1288604524

- **Commit:** `c97bbbe` — hotfix: vendor page crash (digest 1288604524)
- **Root cause:** `pricingNotes` referenced inside `prosCons()` before the `const pricingNotes = ...` declaration (Temporal Dead Zone → runtime crash).
- **Fix:** compute `hasPricingNotes` directly from `v.tools[*].pricingPlans[*].priceNote` inside `prosCons()` (no TDZ).
- **Prod deployment:** https://hrsignal-8b2fsd0ra-agastyalabs-projects.vercel.app
- **Alias:** `vercel alias set hrsignal-8b2fsd0ra-agastyalabs-projects.vercel.app hrsignal.vercel.app`

### Commits included

- `d1b0b19` — P0(home): tokenized TrustStrip (dark theme tokens) + add `docs/UX_IMPLEMENTATION_PLAN.md`.
- `03c7324` — chore: ignore `.openclaw/**` workspaces in ESLint (prevents nested workspace lint hangs).
- `04c04b3` — docs: add `docs/DEPLOY_LOG.md` (this file).
- `77de031` — P0(home): remove redundant header search button so homepage has a single primary search input + the main CTA.
- `c9826af` — docs: append deploy log for P0 homepage search dedupe.
- `0c9a000` — P0(tools): logical employee size buckets in directory + categories intent filter (best-effort mapping to existing bands).
- `69e75bd` — P0: accept logical size buckets in /recommend (maps to legacy size bands; labels now use 51–200 / 201–500 / 501–1000).
- `f2561a2` — P0(home): remove duplicate homepage search UI by hiding the header search bar on `/` (no layout redesign).
- `09977e8` — P0(vendors): vendor detail pages now include full structured sections (overview, best for, features, pros/cons, pricing, integrations, onboarding, support/compliance, alternatives) with “Info pending” fallbacks.
- `9b5c6ab` — P0(pricing): enforce pricing type badges (PEPM / Per user/month / One-time / Quote-based) across tool cards, tool detail, compare, and vendor pages.
- `3a529a5` — P0(pricing): compare page pricing formatting tuned to show type badge as its own line (no ambiguous units).
- `c14021a` — P0(pricing): vendor cards now show pricing type badges + unit-labeled helper text (reuses shared pricing helpers).
- `1cec1ed` — P0(pricing): vendor detail pricing fallback now shows Quote-based badge + “Contact vendor / request quote”.
- `0996c8b` — P0(vendors): vendor detail pages now generate richer, non-thin content (modules/features, deployment summary, buyer checklists, less repetitive pros/cons) without changing layout.
- `2e25991` — P0(theme): dark theme readability polish using tokens only (lifted surfaces + muted text contrast; vendor page token colors + subtle section dividers).
- `97e9c40` — P0(vendors): vendor detail pages can render markdown briefs from `docs/vendors/<slug>.md` into existing sections + show Last updated.
- `8a049ac` — chore: revert package.json script change (vendor briefs require no package.json edits).
- `4df425a` — P0(vendors): vendor detail route now uses `/vendors/<slug>` and renders from markdown briefs when present (no 404 if `docs/vendors/<slug>.md` exists). Freshteam supported.
- `8120745` — P0(vendors): slug normalization + alias handling (e.g. freshteam-freshworks → freshteam) and canonical freshteam redirect; added dev unit test for normalization.
- `61b6fc1` — P0(vendors): implement UI_VENDOR_PAGE_BENCHMARK mapping (brief headings → cards), avoid full markdown dump, add Sources & data quality accordion.
- `f0cce37` — P0(vendors): remove any "Vendor brief" full-markdown blob; keep brief content mapped into cards only; move transparency into a collapsed Sources & data quality accordion; reduce repeated "Info pending" per card.
- `5c6d942` — P0(vendors): add product-family collision guardrail on Freshteam vendor page + display title "Freshteam (Freshworks)"; confirm alias slugs redirect to /vendors/freshteam.
- `9d255e8` — P0(vendors): resolve Freshteam catalog vendor by canonical slug (tool slug based), so /vendors/freshteam uses full vendor record when present.
- `9fb6332` — P0(vendors): always use the official Freshteam URL on the vendor page (not just freshworks.com root).
- `06cdd1b` — infra: set Cache-Control no-store/max-age=0,must-revalidate for HTML routes to avoid stale pages after deploy (Safari/iOS normal refresh); keep hashed static assets cached normally.
>>>>>>> dev
