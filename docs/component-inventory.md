# Component Inventory — HRSignal UI

This is a **where-used inventory** of UI components in the repo as of the prelaunch polish.

> Note: paths are approximate “primary usage” locations (not exhaustive). Use `rg -n "<ComponentName"` for full coverage.

---

## Layout / Shell

### `components/layout/SiteHeader.tsx` → `SiteHeader`
Used by:
- `components/SiteHeader.tsx` (re-export)
- Page shells:
  - `app/page.tsx`
  - `app/tools/page.tsx`
  - `app/tools/[slug]/page.tsx`
  - `app/vendors/page.tsx`
  - `app/vendors/[id]/page.tsx`
  - `app/categories/page.tsx`
  - `app/resources/page.tsx`
  - `app/resources/[slug]/page.tsx`
  - `app/recommend/page.tsx`
  - `app/recommend/success/page.tsx`
  - `app/compare/page.tsx`

### `components/layout/SiteFooter.tsx` → `SiteFooter`
Used by same page shells as header.

### `components/layout/Container.tsx` → `Container`
Used by:
- `SiteHeader`, `SiteFooter`
- Marketing/pages: `app/page.tsx`, `app/recommend/*`, `app/resources/*`, etc.

### `components/layout/Section.tsx` → `Section`
Used by:
- `app/page.tsx`
- `app/categories/page.tsx`
- `app/vendors/[id]/page.tsx`

---

## UI Primitives

### `components/ui/Card.tsx` → `Card`
Used across:
- Directory cards: `ToolCard`, `VendorCard`, category sections
- Pages: categories, vendors, tools, resources

### `components/ui/Button.tsx` → `Button`, `ButtonLink`
Used by:
- Header CTA: `SiteHeader`
- Homepage CTAs: `app/page.tsx`
- Recommend flow: `components/recommend/RecommendInner.tsx`, `app/recommend/RecommendTabs.tsx`
- Success page CTAs: `app/recommend/success/page.tsx`

### `components/ui/Input.tsx` → `Input` (and `.input` CSS class)
Used by:
- Filters/search forms: `app/tools/page.tsx`
- Recommend flow: `components/recommend/RecommendInner.tsx`, `app/recommend/RecommendTabs.tsx`
- Lead forms: `app/results/[id]/results-client.tsx`, admin pages

### `components/ui/Badge.tsx` → `Badge`
Used by:
- Tool/Vendor/Category cards (Verified / India-ready)

### `components/ui/SectionHeading.tsx` → `SectionHeading`
Used by:
- Homepage sections
- Categories page headers
- Resources index

### `components/ui/Toast.tsx` → `ToastViewport`
Used by:
- Recommend client flows (`RecommendInner`) and other interactive surfaces

---

## Catalog / Marketplace

### `components/catalog/ToolCard.tsx` → `ToolCard`
Used by:
- `app/tools/page.tsx` (grid)
- `app/page.tsx` (Trending tools)

### `components/catalog/VendorCard.tsx` → `VendorCard`
Used by:
- `app/vendors/page.tsx`

### `components/catalog/CategoryCard.tsx` → `CategoryCard`
Used by:
- `app/page.tsx` (category grid)
- `app/categories/page.tsx` (category grid)

### `components/VendorLogo.tsx` → `VendorLogo`
Used by:
- `ToolCard` (tool vendor logo)
- `VendorCard` (vendor logo)
- `app/tools/[slug]/page.tsx` (tool detail header)
- `app/vendors/[id]/page.tsx` (vendor detail header)

---

## Compare

### `components/compare/CompareToggle.tsx` → `CompareToggle`
Used by:
- `ToolCard`
- `app/tools/[slug]/page.tsx`

### `components/compare/CompareTray.tsx` → `CompareTray`
Used by:
- `SiteFooter` (rendered globally)

### `components/compare/CompareHydrate.tsx` → `CompareHydrate`
Used by:
- `app/compare/page.tsx` (hydrate from URL/localStorage)

### `lib/compare/useCompare.ts`, `lib/compare/storage.ts`
Used by:
- `SiteHeader` (compare badge)
- `CompareTray`

---

## Recommend Flow

### `components/recommend/RecommendInner.tsx` → multi-step detailed form
Used by:
- `app/stack-builder/page.tsx`
- `app/recommend/RecommendTabs.tsx` (Detailed mode embed)

### `app/recommend/RecommendTabs.tsx` → Quick vs Detailed wrapper
Used by:
- `app/recommend/page.tsx`

### `app/recommend/submit/route.ts` → POST handler
Redirects to:
- `/recommend/success?run=<id>`

### `app/recommend/success/page.tsx` → success/confirmation UI
Used by:
- redirect target after successful submit

---

## Resources

### `lib/resources/articles.ts`
Used by:
- `app/resources/page.tsx`
- `app/resources/[slug]/page.tsx`

---

## Brand / Assets

### `config/brand.ts` → `BRAND`
Used by:
- `SiteHeader`, `SiteFooter`

### Public assets
- `/public/logo.svg`, `/public/logo.png` — canonical brand
- `/public/vendor-logos/*.png` — cached vendor logos

---

## Scripts (supporting UI)

### `scripts/fetch-logos.mjs` / `scripts/fetch-logos.ts`
Purpose:
- Deterministically generate/download vendor logos into `public/vendor-logos/`.

### `scripts/generate-brand-assets.mjs`
Purpose:
- Generate raster assets (logo.png, og.png, favicon.ico, placeholders).
