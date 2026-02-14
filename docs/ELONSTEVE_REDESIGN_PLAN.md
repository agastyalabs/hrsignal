# ElonSteve Redesign Plan (Content/Flow Frozen)

**Non-negotiable constraint:** keep content, page flow, routing, and data logic **100% intact**. This plan is strictly a **visual + component-system** redesign.

## Goals
- Premium “black/blue/green” ElonSteve system: minimal, sharp contrast, high trust.
- Consistent component library (buttons/inputs/cards/badges/nav) used everywhere.
- Scannability: dense pages become easier to parse without removing content.
- Performance-safe: avoid heavy UI deps; prefer Tailwind + existing primitives.
- Accessibility: WCAG AA as baseline (contrast, focus, keyboard nav).

## Scope boundaries
- **No route changes** (must not break `/tools`, `/vendors`, `/categories`, `/recommend`, `/tools/[slug]`, `/compare`, `/resources`, results flow).
- **No copy changes** except microcopy required for accessibility (e.g., aria labels) or truncation fixes.
- **No backend/schema changes**.

---

## Phase 0 — Baseline & guardrails (0.5 day)

### Checklist
- [ ] `npm run lint` and `npm run build` must stay green after each phase.
- [ ] Visual regression checklist pages:
  - `/` `/tools` `/vendors` `/vendors/[slug]` `/categories` `/categories/[slug]` `/compare` `/recommend` `/results/[id]` `/resources` `/resources/[slug]`
- [ ] Keyboard navigation pass: header, menus, drawers, forms.

### Deliverables
- “Before” screenshots (desktop + mobile) stored in `docs/redesign/before/` (optional).

---

## Phase 1 — Design system tokens (1 day)

**Single source of truth** lives in CSS variables + Tailwind theme mapping.

### 1.1 Tokens in `app/globals.css`
Define/lock:
- Base:
  - `--bg`, `--surface-1`, `--surface-2`, `--text`, `--text-muted`
- Brand:
  - `--primary` (CTA green), `--primary-hover`
  - `--link` (blue), `--link-hover`
- Borders/rings:
  - `--border`, `--border-soft`, `--ring`
- Radii:
  - `--radius-sm`, `--radius-md`, `--radius-lg`
- Elevation/glow (subtle, consistent):
  - `--shadow-1`, `--shadow-2`

Acceptance
- No per-page token overrides.
- Links are blue; CTAs are green (avoid same-color confusion).

### 1.2 Tailwind mapping in `tailwind.config.ts`
- Map `brand` palette to CSS vars or fixed values.
- Ensure typography scale utilities match system sizes.

---

## Phase 2 — Component library hardening (1–2 days)

Goal: everything looks premium by upgrading shared primitives only.

### 2.1 Buttons
File: `components/ui/Button.tsx`
- Variants: `primary`, `secondary`, `ghost`, `danger` (optional)
- Sizes: `sm`, `md`, `lg`
- States: hover/active/disabled/loading
- Ensure Safari/iPad alignment stays fixed.

### 2.2 Inputs / Select
File: `app/globals.css` + `components/ui/Input.tsx`
- Unified `.input` class for input/select/textarea.
- Error state class (border + help text pattern).

### 2.3 Cards
File: `components/ui/Card.tsx`
- Standard padding + border + hover behavior.
- Optional `u-card-hover` utility for consistent “pop”.

### 2.4 Badges / Pills
File: `components/ui/Badge.tsx`
- Neutral, success, warning states.

### 2.5 Navigation primitives
- `components/layout/SiteHeader.tsx` and mobile drawer
- Breadcrumbs for inner pages

Acceptance
- 80%+ pages look consistent without page-specific CSS.

---

## Phase 3 — Page-by-page polish (2–3 days)

Keep content order identical; only adjust layout rhythm, spacing, hierarchy.

### Homepage (`app/page.tsx`)
- Maintain current section order.
- Improve rhythm:
  - consistent section spacing
  - reduce repeated border stacking
  - stronger H1/H2 scale consistency

### Directory pages (`/tools`, `/vendors`, `/categories`)
- Consistent filters bar spacing
- Grid gutter rhythm
- Card hover state consistency

### Detail pages (`/tools/[slug]`, `/vendors/[slug]`, `/categories/[slug]`)
- Clear “above the fold” summary + trust signals
- Evidence links rendered consistently
- Breadcrumbs visible

### Recommend (`/recommend`)
- Form readability (label contrast, spacing)
- Progress indication consistent

### Results (`/results/[id]`)
- Preserve trust-first panels
- Make “primary vs alternatives” hierarchy even clearer
- Ensure verification freshness pill remains prominent

Acceptance
- No content removed/reordered.
- No props/route changes required for functionality.

---

## Phase 4 — Motion + delight (optional; 0.5–1 day)

Prefer CSS transitions; only add `framer-motion` if truly needed.
- Section reveal: subtle translate + fade
- Reduce motion for `prefers-reduced-motion`

Acceptance
- No jank on mobile.

---

## QA & Launch criteria
- Lighthouse (mobile) baseline improvement or no regression.
- Contrast checks on:
  - body text
  - muted text
  - links
  - focus rings
- iPad Safari spot check:
  - Buttons baseline
  - Inputs/select alignment
  - Header menu alignment

---

## Implementation order (smallest safe steps)
1) Tokens + Tailwind mapping
2) Buttons + inputs + cards
3) Header + mobile drawer + breadcrumbs
4) Page polish in this order: homepage → directories → detail pages → recommend → results

---

## Notes / Open questions
- Confirm whether “Compliance Guides” should point to `/resources` or a new landing page (keep route same for now).
- Confirm whether we want CTA label changes on results (“Refine shortlist”).
