# HRSignal — UX Implementation Plan (Safe, No Broken Flows)

This plan translates `figma/audit/HRSignal_UI_UX_Master_Audit_2026.md` into **small, reversible PRs** for the current repo.

## Guardrails (non‑negotiables)
- **Do not break existing flows/routes:** `/tools`, `/vendors`, `/categories`, `/recommend`, `/tools/[slug]`, `/compare`, `/resources`.
- Prefer **UI-only refactors** (components, styles, copy) over data model changes.
- Keep PRs **small and reversible**; each PR should be independently deployable.
- Avoid heavy dependencies; stick to Tailwind + existing UI components.

## Baseline: current state (what we already have)
- Global header/search: `components/layout/SiteHeader.tsx`
- Shared UI primitives: `components/ui/*` and global `.input` styling in `app/globals.css`
- Resources hub + 5 seeded articles: `lib/resources/articles.ts`, `app/resources/*`
- Tool cards currently use a placeholder icon (needs logo strategy): `components/catalog/ToolCard.tsx`

---

## PR-by-PR breakdown

### PR 1 — Homepage credibility + content integrity pass (P0)
**Goal:** eliminate “broken site” signals and tighten above-the-fold trust.

**Scope**
- Remove any stray/duplicated text artifacts.
- Ensure homepage sections are intentional: hero → trust → popular vendors → how it works → trending → pricing → FAQs.
- Add/verify consistent microcopy for “Verified / Explainable / Privacy-first / India-first SME fit”.

**Likely files**
- `app/page.tsx`
- `components/marketing/*` (e.g., `TrustStrip`, `TestimonialStrip`, `LogoStrip`)
- `components/ui/*` (only if a token/utility is missing)

**Risk notes**
- Low risk (content + layout). Main risk is accidental regression in spacing on mobile.

**Rollback**
- Revert PR; homepage is self-contained.

---

### PR 2 — Tools directory: filter comprehension + empty states (P0)
**Goal:** fix filter mental model mismatch and reduce dead-ends without changing backend logic.

**Scope**
- Reorder and relabel filters to match user mental models:
  - Primary: **Category (primary need)**
  - Secondary: **Modules** (optional)
  - Company size, deployment, budget language: add helper text (even if filters are partial).
- Improve empty states:
  - Show “No results” guidance and a “Reset filters” action.
- Add a clear result count line and sort explanation.

**Likely files**
- `app/tools/page.tsx`
- `components/catalog/*` (if the list rendering/empty state is shared)
- `components/ui/*` (Button/Badge/Card/Toast)

**Risk notes**
- Medium risk: UI changes can confuse users if labels change too abruptly.
- Avoid changing query param names or filter semantics in this PR.

**Rollback**
- Revert PR; the page should return to previous filter UI.

---

### PR 3 — Pricing/budget language normalization (P0)
**Goal:** standardize pricing semantics across cards + detail pages to preserve trust.

**Scope**
- Establish consistent display rules:
  - Prefer “PEPM” (per employee per month) where applicable.
  - Use “Quote-based” / “Annual contract (quote-based)” when numeric ranges are unknown.
  - Never show false precision.
- Update tool cards + detail sections to use the same labels.

**Likely files**
- `components/catalog/ToolCard.tsx`
- `app/tools/[slug]/page.tsx`
- `app/tools/page.tsx`
- `docs/*` (optional: add a short internal “pricing language rules” note)

**Risk notes**
- Low-medium risk: copy-only, but inconsistent data may surface “unknown”.

**Rollback**
- Revert PR; pricing copy is not schema-coupled.

---

### PR 4 — Recommend funnel: make steps legible + confidence-building (P0)
**Goal:** ensure recommendation flow is understandable, accessible, and doesn’t “feel thin”.

**Scope**
- Add server-rendered explanatory content around the existing form flow:
  - Step overview (“Company → Needs → Integrations → Contact”)
  - Privacy-first reassurance
  - Progress indicator (UI only)
- Improve error messaging (client toast + inline message) using returned API errors.

**Likely files**
- `app/recommend/page.tsx` (and any `/recommend/*` pages)
- `components/recommend/RecommendInner.tsx`
- `components/ui/Toast.tsx`

**Risk notes**
- Medium risk: changes in client form state can introduce regressions.
- Do not change the API payload shape in this PR.

**Rollback**
- Revert PR; recommendations endpoint unchanged.

---

### PR 5 — Tool detail template: “must-have” sections + trust/evidence blocks (P1)
**Goal:** make `/tools/[slug]` feel complete and decision-oriented.

**Scope**
- Add/standardize sections (display-only, no new DB required):
  - “Key facts” (pricing model, deployment, implementation)
  - “Why this tool” (if present in current data; else safe placeholder copy)
  - “Verified” meaning + “Last verified” if available
  - Evidence links block (use vendor website/pricing links if present; otherwise hide section)
  - FAQ block (static template)
- Ensure CTA copy is privacy-first.

**Likely files**
- `app/tools/[slug]/page.tsx`
- `components/ui/*` (Card/Badge/SectionHeading)

**Risk notes**
- Medium risk: detail pages are high traffic and tightly coupled to available data.
- Use **conditional rendering** for fields that may be null.

**Rollback**
- Revert PR.

---

### PR 6 — Vendors directory + vendor detail: credibility fixes (P1)
**Goal:** address “0 tools” credibility issue and strengthen vendor browsing.

**Scope**
- Vendors list:
  - If vendor has 0 published tools, either hide by default or label “Listing pending verification”.
  - Add clear subhead and consistent vendor cards.
- Vendor detail:
  - Ensure “Products on HRSignal” and categories served are clear.

**Likely files**
- `app/vendors/page.tsx`
- `app/vendors/[id]/page.tsx`
- `components/catalog/*` (if vendor card extracted)

**Risk notes**
- Medium risk: hiding vendors changes perceived directory size.
- Prefer labeling first; hiding can be gated behind a simple config flag.

**Rollback**
- Revert PR; no schema changes required.

---

### PR 7 — Resources hub polish: make it scan-friendly (P1)
**Goal:** ensure `/resources` is a polished hub (no “coming soon”) and ties content → action.

**Scope**
- Resources index:
  - Add search (client-side filter)
  - Add tag/category pills
  - Resource cards include type, reading time, updated date
  - Strong CTA back to recommendations
- Article detail:
  - Add “Who this is for” / “When to use this” blocks (content only)
  - End-of-article CTA section

**Likely files**
- `app/resources/page.tsx`
- `app/resources/[slug]/page.tsx`
- `lib/resources/articles.ts`
- `app/resources/Markdownish.tsx` (only if formatting needs minor enhancements)

**Risk notes**
- Low risk: resources are static content-driven.

**Rollback**
- Revert PR.

---

### PR 8 — Design system polish + contrast QA (P2 → can be pulled earlier if needed)
**Goal:** make the UI consistently premium across dark theme, especially inputs and chips.

**Scope**
- Define/confirm a small token set:
  - input background, text, placeholder, focus ring
  - button hover/active/disabled
  - card border/shadow/hover
- QA across:
  - header global search
  - `/tools` filters
  - `/recommend` form fields
  - lead capture forms

**Likely files**
- `app/globals.css`
- `components/ui/Button.tsx`
- `components/ui/Input.tsx`
- `components/ui/Badge.tsx`
- `components/ui/Card.tsx`

**Risk notes**
- Medium risk: token changes can ripple across all pages.
- Keep changes incremental; prefer adding CSS vars and migrating one component at a time.

**Rollback**
- Revert PR.

---

## Cross-cutting QA (run after every PR)
### Manual smoke tests (must not break)
1. `/` home renders
2. `/tools` loads, search works, filters UI works, tool cards clickable
3. `/tools/[slug]` loads for a known tool (e.g. `keka` if present)
4. `/vendors` loads
5. `/vendors/[id]` loads (pick a vendor from list)
6. `/categories` loads
7. `/recommend` can submit and redirects to `/results/[id]`
8. `/compare` works if tray/flow exists
9. `/resources` index loads and links to `/resources/[slug]`

### Automated checks
- `npm run lint`
- `npm run build`

---

## Deployment checklist (Vercel, cache, verification)

### Before deploy
- Ensure branch is `dev` and clean working tree.
- Run:
  - `npm run lint`
  - `npm run build`
- Confirm env vars in Vercel (minimum):
  - `DATABASE_URL`
  - `RESEND_API_KEY` (optional but recommended)
  - `RESEND_FROM_EMAIL` (optional)
  - `LEAD_NOTIFY_EMAILS` (optional)

### Deploy steps
1. **Preview deploy** (optional but recommended for each PR):
   - `vercel deploy`
   - verify preview URL manually
2. **Production deploy** (when ready):
   - `vercel --prod`

### Cache notes
- If brand/assets don’t update immediately:
  - hard refresh (cache bust)
  - verify filenames are stable and referenced correctly
  - if needed, rename assets with a version suffix (e.g. `logo-v2.svg`) and update references.

### Post-deploy verification
- Check the manual smoke tests list above on production.
- Confirm:
  - header search input is readable (text + placeholder + focus)
  - primary CTA buttons show correct states
  - resources index + one article page load
  - recommendations submit still redirects to results

---

## Notes on sequencing (ship-fast)
If you need a “ship this week” subset:
1) PR1 (Homepage integrity)
2) PR2 (Tools filter comprehension + empty states)
3) PR4 (Recommend funnel clarity)
4) PR5 (Tool detail completeness)
5) PR7 (Resources hub polish)

This order maximizes conversion and trust while minimizing risk of breaking flows.
