# UI_IMPLEMENTATION — HRSignal (consistent UI per UI_SPEC/PAGES/INSPIRATION)

Sources:
- `docs/UI_SPEC.md`
- `docs/PAGES.md`
- `docs/INSPIRATION.md`

Goal: Implement a consistent, trust-forward marketplace UI (SoftwareSuggest-style patterns) across Home and Tools directory first, by introducing a shared layout system + reusable components.

Constraints:
- **No breaking changes** (existing routes continue to work; minimal churn).
- **No secret leakage** (no env values in UI or commits).
- Keep changes incremental and shippable in small commits on branch `dev`.

---

## Implementation PR plan (small, shippable)

### PR A — Layout system + design tokens (foundation)
**Outcome:** Shared layout primitives that enforce container width, spacing rhythm, and consistent header/footer.

Changes:
- Add layout primitives:
  - `components/layout/Container.tsx` (max width + responsive padding)
  - `components/layout/Section.tsx` (vertical rhythm: `py-10 sm:py-14`)
  - `components/layout/SiteHeader.tsx` (sticky header + nav + primary CTA)
  - `components/layout/SiteFooter.tsx` (multi-column footer)
- Keep backward compatibility:
  - Continue exporting `SiteHeader` and `SiteFooter` from the existing paths (`components/SiteHeader.tsx`, `components/SiteFooter.tsx`) as thin wrappers/re-exports.
- Add spacing/color/typography conventions in code comments and standardize Tailwind classes.

Acceptance:
- Header/footer appear consistent on existing pages.
- Container width is consistent (`max-w-6xl`), padding is consistent (`px-4 sm:px-6 lg:px-8`).

---

### PR B — Core UI components (reusable primitives)
**Outcome:** Canonical component styles per `docs/UI_SPEC.md`.

Add:
- `components/ui/Button.tsx` (primary/secondary/tertiary + sizes)
- `components/ui/Card.tsx` (single card style; optional header/footer slots)
- `components/ui/Badge.tsx` (verified + neutral)
- `components/ui/SectionHeading.tsx` (H2/H3 patterns + supporting text)

Add feature modules:
- `components/marketing/FeatureGrid.tsx`
- `components/marketing/TrustStrip.tsx`
- `components/marketing/TestimonialStrip.tsx` (can be placeholder content)

Acceptance:
- Components match the spec: restrained shadows, consistent radius (`rounded-xl`), border (`zinc-200`), primary color (`indigo-600`).

---

### PR C — Marketplace cards + placeholder image strategy
**Outcome:** Consistent cards for categories/tools + repeatable placeholder visuals.

Add:
- `components/catalog/CategoryCard.tsx`
- `components/catalog/ToolCard.tsx`
- Placeholder strategy:
  - Local SVG placeholders in `public/placeholders/*` (e.g. `tool.svg`, `vendor.svg`) OR consistent Lucide icons.
  - Prefer `next/image` for non-trivial images; fall back to icons where no assets exist.

Notes:
- Keep vendor logos/screenshots optional; do not block on real assets.

Acceptance:
- CategoryCard + ToolCard render with stable layouts even without images.

---

### PR D — Rebuild Home (`/`) to match UI spec
**Outcome:** Home follows the blueprint in `docs/UI_SPEC.md` and route requirements in `docs/PAGES.md`.

Implement on Home:
- Sticky header
- Hero (left text + CTAs) + right search module + popular category chips
- Trust strip (3–4 bullets w/ icons)
- Category grid (5 locked categories)
- Trending/recently verified tools (tool cards)
- “How it works” (3 steps)
- Social proof/testimonials (lightweight, original copy)
- Final CTA band
- Footer

Acceptance:
- CTAs:
  - Primary: Get recommendations → existing `/stack-builder` (until rename/redirect later)
  - Secondary: Browse tools → `/tools`

---

### PR E — Rebuild Tools directory (`/tools`) to match UI spec
**Outcome:** Tools directory matches `docs/PAGES.md` sections: page header, search, filters (MVP), results grid, trust module.

Implement on `/tools`:
- Page header + helper text
- Search + category selector (reusing shared SearchBar-like markup)
- Filters (MVP):
  - Category (already)
  - Company size (can be UI-only placeholder if data isn’t available yet)
  - Integrations (placeholder chips if needed)
  - Sort (relevance / name / recently verified — initially name + recently verified)
- Results grid of `ToolCard`
- Pagination placeholder (or “showing N tools”)
- Trust module below results (methodology + privacy)

Acceptance:
- Remove duplicate grids (current page renders tools twice).
- Zero regression in DB-backed query behavior.

---

## Coding approach (small commits)

Commit cadence (suggested):
1) Add layout primitives + refactor existing `SiteHeader/SiteFooter` to wrappers.
2) Add UI primitives: Button/Card/Badge/SectionHeading.
3) Add marketing modules: FeatureGrid/TrustStrip.
4) Add marketplace cards: CategoryCard/ToolCard.
5) Add placeholders to `public/placeholders/*`.
6) Rebuild Home using components.
7) Rebuild Tools using components and remove duplication.

Each commit should:
- compile (`next build` optional but preferred)
- pass `npm run lint`

---

## Non-breaking notes
- Keep legacy routes working (especially `/stack-builder`, `/tools`, `/tools/[slug]`).
- No copy/paste competitor text; only layout patterns.
- No changes to DB schema or API behavior in this UI-only effort.
