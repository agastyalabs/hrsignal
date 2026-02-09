# HRSignal — Deploy Log

This file tracks production deployments for UX plan work.

## 2026-02-09

- **Deployment URL:** https://hrsignal.vercel.app
- **Resolved production deployment (Vercel):** https://hrsignal-jcdzt8iut-agastyalabs-projects.vercel.app

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
- `3a572af` — docs: deploy log entry for P0 dark theme readability.
