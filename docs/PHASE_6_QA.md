# Phase 6A — Sitewide QA Audit (Launch)

Reference inputs used
- Reference HTML: `/reference/design-reference.html`
- Design/QA spec markdowns (latest set):
  - `/hr_signal_golive_UIUXcontent.md`
  - `/hr_signal_final_prelaunch_UIUX.md`
  - `/DESIGN_SYSTEM.md`

Scope
- Audited repo pages/components (app routes) against the reference HTML + the above specs.
- This is a QA checklist (no code changes in this phase).

---

## 1) Visual polish issues (spacing, radius, shadows, section contrast, inconsistent card styles)

- [ ] **Hardcoded “dark section” styling clashes with the global light theme**
  - Where: `/app/tools/page.tsx`, `/app/resources/page.tsx`, `/app/vendors/page.tsx` (DB-not-configured card), `/app/recommend/page.tsx` (top heading)
  - Symptom: Pages are rendered with `bg-[var(--bg)]` (white) but many inner panels and headings use hardcoded dark palette tokens like `bg-[#111827]` with text `text-[#F9FAFB]`. This creates inconsistent “night mode islands” (and in some places, low contrast/invisible text if the dark panel isn’t present).
  - Suggested change:
    - Replace hardcoded `#111827/#0F172A/#1F2937/#F9FAFB/#CBD5E1/#8B5CF6` usage with CSS variables from `/app/globals.css` (e.g., `bg-[var(--surface-1)]`, `bg-[var(--surface-2)]`, `text-[var(--text)]`, `text-[var(--text-muted)]`, `border-[var(--border-soft)]`).
    - If certain pages truly need a dark theme, set a consistent theme wrapper (e.g., set `data-theme="dark"` and define dark tokens) rather than mixing palettes ad-hoc.

- [ ] **Card radius/shadow inconsistency (reference uses radius-card=32px + shadow-soft/float)**
  - Where: mix across `/components/ui/Card.tsx` (and usages), `/app/page.tsx`, `/app/categories/page.tsx`, `/app/tools/page.tsx`, `/app/resources/page.tsx`
  - Symptom: Some cards use `rounded-2xl`, some use `rounded-[var(--radius-lg)]`, some use `radius-card` class, shadows vary from `shadow-none` to `shadow-sm` to `shadow-float`.
  - Suggested change:
    - Centralize “default card” style in `/components/ui/Card.tsx` to match reference (radius + subtle border + optional shadow-soft).
    - Use variants: `Card variant="soft"|"float"|"flat"` rather than one-off tailwind classes per page.

- [ ] **Surface contrast in footer doesn’t match spec (“contrasting dark or semi-transparent panel”)**
  - Where: `/components/layout/SiteFooter.tsx`
  - Symptom: Footer uses `bg-[var(--surface-grey)]` and light text; spec suggests a contrasting dark/semi-transparent footer panel for trust/visual anchor.
  - Suggested change: introduce a footer surface token (e.g., `--footer-bg`) or use `bg-[var(--surface-2)]` + stronger border/shadow, OR implement the spec’s dark footer consistently.

- [ ] **Button contrast issues (primary background with dark text)**
  - Where: `/app/categories/page.tsx` (“Browse tools” button), also several dark-panel CTAs use `text-[#0B1220]` on violet.
  - Symptom: `bg-[var(--primary)]` (blue) combined with `text-[var(--text)]` (dark) reduces contrast and looks off-brand.
  - Suggested change: ensure primary buttons are always `text-white` (or define `--on-primary` token) and have consistent hover states.

- [ ] **Featured resources card uses dark styling but sits on light page (jarring)**
  - Where: `/app/resources/page.tsx`
  - Symptom: Featured badge + sidebar use `bg-[#0F172A]` etc; feels like a different product theme than the rest.
  - Suggested change: restyle to token-based light surfaces (or make the whole Resources page intentionally dark, but then apply it consistently).

---

## 2) Header/nav issues (logo visibility, dropdown alignment, hover/focus states)

- [ ] **Brand name mismatch with spec (“HR Signal” vs “HRSignal”)**
  - Where: `/config/brand.ts` (`BRAND.name`), `/app/layout.tsx` metadata/title/JSON-LD, header aria-label uses “HRSignal home”
  - Spec: `/hr_signal_golive_UIUXcontent.md` explicitly requests “HR Signal” with a space.
  - Suggested change:
    - Update `BRAND.name` and any SEO strings to the canonical brand name.
    - Confirm the logo assets in `/public/assets/logos/*` match the final brand pack.

- [ ] **Logo variant logic exists, but theme is always light (dark logo never shown)**
  - Where: `/app/layout.tsx` (`<html data-theme="light">`), `/app/globals.css` logo rules, `/components/layout/SiteHeader.tsx` renders both `.logo-light` and `.logo-dark`
  - Symptom: Only `.logo-light` displays; `.logo-dark` is never used. If the “light” logo has low contrast on the glass header, brand visibility suffers.
  - Suggested change:
    - Either remove unused dark logo rendering, or implement actual theme switching and test both.
    - Ensure the displayed logo has sufficient contrast against `bg-white/80 + backdrop-blur`.

- [ ] **Dropdown menu alignment/overflow risks on small desktop widths**
  - Where: `/components/layout/SiteHeader.tsx` (dropdown panel width uses `min(840px,calc(100vw-2rem))` and absolute positioning)
  - Risk: At certain widths, the centered dropdown can clip against viewport edges, and `maxHeight: 70vh` with internal scroll can feel cramped.
  - Suggested change:
    - Add collision handling (flip/shift) or clamp left/right positions based on viewport.
    - Consider anchoring all dropdowns consistently (either left-aligned or centered) for predictability.

- [ ] **Focus ring styles are inconsistent across header controls**
  - Where: `/components/layout/SiteHeader.tsx` and global focus rules in `/app/globals.css`
  - Symptom: Some elements use `focus-visible:ring-2`, others rely on `:focus-visible` global `box-shadow`, some use `focus:ring-4` (non-`focus-visible`).
  - Suggested change: standardize on `focus-visible` only (keyboard) and use one ring token `--ring`.

---

## 3) Overlaps / z-index / scroll issues (menus, floating CTA, modals)

- [ ] **Compare tray and Floating CTA share the same z-index and bottom placement**
  - Where:
    - `/components/compare/CompareTray.tsx` (`fixed bottom-0 z-50`)
    - `/components/marketing/FloatingShortlistCta.tsx` (`fixed bottom-... right-... z-50`)
  - Symptom: When compare tray is visible, the floating CTA can overlap tray content or become partially hidden depending on viewport.
  - Suggested change:
    - Either raise compare tray above CTA, or hide the floating CTA when compare tray is open.
    - Alternatively, position CTA above tray height on pages where tray can appear.

- [ ] **Header dropdown closes on scroll; can feel “twitchy” with trackpads**
  - Where: `/components/layout/SiteHeader.tsx` (`window.addEventListener("scroll", onScrollClose)` when menu open)
  - Suggested change: close only when scroll passes a threshold (e.g., > 16px) or when a pointer event occurs outside.

- [ ] **Mobile menu uses fixed overlay + locks `documentElement.style.overflow`**
  - Where: `/components/layout/SiteHeader.tsx`
  - Risk: If any exception prevents cleanup, scroll can remain locked.
  - Suggested change: ensure cleanup runs on route change too (e.g., listen for pathname change and force `mobileOpen=false`).

---

## 4) Accessibility basics (contrast, focus rings)

- [ ] **/recommend heading text is hardcoded to near-white on a white background (potentially invisible)**
  - Where: `/app/recommend/page.tsx`
  - Evidence: `div className="min-h-screen bg-[var(--bg)]"` and `h1 className="... text-[#F9FAFB]"`
  - Suggested change: use `text-[var(--text)]` and `text-[var(--text-muted)]` for body copy unless the page is explicitly dark-themed.

- [ ] **Error text color likely too light for light surfaces**
  - Where: `/components/lead/ChecklistDownloadCard.tsx` (`text-red-300`)
  - Suggested change: use a stronger semantic color (e.g., `text-red-600` on light backgrounds) or define `--danger` tokens.

- [ ] **Buttons/links: inconsistent `focus` vs `focus-visible` patterns**
  - Where: `/components/compare/CompareTray.tsx` (uses `focus:ring-4`), plus various pages.
  - Suggested change: prefer `focus-visible` ring (keyboard) to avoid always-on rings for mouse users; align with global rule in `/app/globals.css`.

---

## 5) Copy consistency (titles/subheaders)

- [ ] **Brand string consistency across UI + SEO**
  - Where: `/config/brand.ts`, `/app/layout.tsx` metadata/title/JSON-LD, `/components/layout/SiteFooter.tsx` (“© {BRAND.name}”)
  - Suggested change: decide canonical (“HR Signal” per spec) and update everywhere, including:
    - `metadata.title` and `openGraph.title`
    - JSON-LD org name/logo URL
    - Header aria labels

- [ ] **CTA text is inconsistent (Get my shortlist / Get recommendations / Analyze Fit / Get recommendations)**
  - Where: `/app/page.tsx`, `/components/layout/SiteHeader.tsx`, `/components/marketing/FloatingShortlistCta.tsx`, `/app/tools/page.tsx`, `/app/resources/page.tsx`
  - Suggested change: standardize to 1 primary CTA label sitewide (e.g., “Get my shortlist”) + 1 secondary (e.g., “Browse tools”).

- [ ] **“India-first mode is ON by default” copy may be inaccurate depending on query param default**
  - Where: `/app/tools/page.tsx`
  - Suggested change: confirm the actual default state from `indiaOnlyFromSearchParams(sp)` and adjust copy accordingly (or explicitly set default `india=1` when absent).

---

## 6) Broken links / routes (internal)

- [ ] **Verify all nav/footer routes exist and render without DB**
  - Where:
    - Header NAV: `/components/layout/SiteHeader.tsx`
    - Footer links: `/components/layout/SiteFooter.tsx`
  - Checklist:
    - [ ] `/tools` (renders in fallback mode if no DB)
    - [ ] `/vendors` (currently renders empty list when no DB; ensure empty-state card uses readable colors)
    - [ ] `/categories` (renders FALLBACK)
    - [ ] `/resources` and `/resources/[slug]` (ensure listResourceArticles returns at least 1 featured/normal article)
    - [ ] `/compliance` and `/compliance/[slug]` (slugs match `/lib/compliance/guides.ts`)
    - [ ] `/india-payroll-risk-checklist` (ensure download asset exists and page links to it)
    - [ ] `/payroll-risk-scanner`, `/hrms-fit-score`, `/methodology`, `/compare`, `/compare/vendors`
    - [ ] `/privacy`, `/terms`

- [ ] **Potential route mismatch: vendor slugs on /recommend ranking**
  - Where: `/app/recommend/page.tsx` links to `/vendors/${v.slug}`
  - Risk: `canonicalVendorSlug()` may generate a slug that does not match actual vendor route assumptions if vendor page expects a DB slug vs derived slug.
  - Suggested change: confirm vendor detail route lookup logic in `/app/vendors/[slug]/page.tsx` (ensure it can resolve canonical slug).

---

## 7) Lead capture flow sanity (forms → /api/leads → Resend)

- [ ] **Confirm all lead capture entry points hit `/api/leads` with the expected `type`**
  - Where:
    - Home hero form: `/app/page.tsx` (GETs `/recommend` with email; does NOT post to `/api/leads`)
    - Checklist download: `/components/lead/ChecklistDownloadCard.tsx` (POST `/api/leads` type=`checklist`)
    - Vendor claim: `/app/vendors/claim/page.tsx` (likely POST `/api/leads` type=`vendor_claim`)
    - Results pages: `/app/results/[id]/results-client.tsx` (check any POSTs)
  - Suggested change:
    - Decide whether the hero form should also create a lead immediately (POST), or only after user completes /recommend.

- [ ] **Resend configuration: best-effort is correct, but UX doesn’t reflect “email skipped”**
  - Where: `/app/api/leads/route.ts`
  - Behavior: If `RESEND_API_KEY` or `RESEND_FROM_EMAIL` missing, logs “skipping email” and returns success.
  - Suggested change:
    - If email is skipped, surface a mild UI message in the client (using `errorCode=resend_not_configured`) so internal QA doesn’t misinterpret missing emails as broken form submissions.

- [ ] **Recipient allowlist is strict (good), but environment var names are inconsistent**
  - Where: `/app/api/leads/route.ts` reads `LEAD_NOTIFY_EMAILS` or `LEAD_EMAIL_TO`
  - Suggested change: consolidate to one env var name in docs/config, and ensure production uses it.

---

## Quick P0 (launch-blocking) shortlist

- [ ] Fix `/app/recommend/page.tsx` text contrast (currently white text on white background).
- [ ] Unify theming (remove hardcoded dark palette islands or make the theme intentional).
- [ ] Resolve brand name mismatch (“HR Signal” vs “HRSignal”) across `/config/brand.ts` + metadata.
- [ ] Prevent compare tray and floating CTA overlap (`z-index`/positioning logic).

