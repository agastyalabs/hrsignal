# HRSignal UI/UX Spec (SoftwareSuggest-style, trust-forward marketplace)

**Goal:** A clean SaaS marketplace experience (SoftwareSuggest-inspired) for **India-first SMEs**: category-led discovery, trust signals everywhere, fast scanning, and conversion-focused CTAs.

> **Non-goal:** Copy competitor wording. We will copy *patterns*, not text.

---

## 1) Brand principles (India-first SME)

1. **Trust-first, low-friction**: make legitimacy obvious (verification, transparency, privacy). Reduce cognitive load.
2. **Scan-able by default**: cards, short bullets, clear labels, consistent info hierarchy.
3. **Category-led discovery**: help users narrow quickly (HRMS, Payroll, Attendance, ATS, Performance, etc.).
4. **SME pragmatic**: focus on outcomes (setup time, payroll compliance, integrations) more than theory.
5. **Conversion with dignity**: CTAs that feel helpful (“Get recommendations”, “Compare”, “Request demo”) rather than pushy.
6. **Consistency over novelty**: same spacing, same card style, same CTA placements across all pages.

---

## 2) Design tokens

### Typography
**Default font:** `Inter` (or `Geist` as fallback) with `font-sans`.

**Type scale (Tailwind-friendly):**
- **Display**: 40–48px / 1.1 (landing hero only)
- **H1**: 32px / 1.2
- **H2**: 24px / 1.25
- **H3**: 20px / 1.3
- **Body**: 16px / 1.6
- **Small**: 14px / 1.5
- **Micro**: 12px / 1.4

**Rules:**
- Headings: `font-semibold` (avoid extra-bold except hero).
- Body: `font-normal`, max line-length ~70ch.
- Use sentence case for UI labels.

### Spacing + layout grid
**Base spacing unit:** 4px (Tailwind default).

**Page container:**
- `max-w-6xl` or `max-w-7xl` (choose one; keep consistent)
- Side padding: `px-4 sm:px-6 lg:px-8`

**Vertical rhythm:**
- Section spacing: `py-10 sm:py-14`
- Within section: `gap-6` (cards), `gap-4` (dense lists)
- Card padding: `p-5` (default), `p-4` (dense)

### Color system (trust-forward)
Use a restrained palette; let content + badges carry meaning.

**Neutrals (zinc-like):**
- Background: `zinc-50` / `white`
- Surface: `white`
- Border: `zinc-200`
- Text primary: `zinc-900`
- Text secondary: `zinc-600`
- Muted: `zinc-500`

**Brand accent (India-first, calm):**
- Primary: `indigo-600` (or `blue-600`) for CTAs/links
- Primary hover: `indigo-700`
- Focus ring: `indigo-500/30`

**Semantic colors:**
- Success: `emerald-600`
- Warning: `amber-600`
- Danger: `rose-600`

**Rules:**
- Primary action always uses the same color.
- Borders are subtle; avoid heavy drop shadows everywhere.

### Radius, borders, shadows
- Radius: `rounded-xl` for cards, `rounded-lg` for inputs/buttons.
- Border: 1px `zinc-200` as default.
- Shadow: use sparingly; prefer border + soft hover shadow.

---

## 3) Components (canonical styles)

### Buttons
- **Primary**: solid brand (`bg-indigo-600 text-white`), used for the main CTA.
- **Secondary**: outline (`border-zinc-200`) for navigation or “Compare”.
- **Tertiary / Link**: text button for less important actions.

**Rules:**
- Only 1 primary CTA per viewport region (hero, tool page header, etc.).
- Button sizes: `sm` (dense lists), `md` (default), `lg` (hero).

### Cards
Two card types only (avoid variants explosion):
1. **Marketplace Card (default)**
   - `rounded-xl border border-zinc-200 bg-white p-5`
   - Header row: logo/avatar, title, verified badge
   - Body: tagline + 3 bullet highlights
   - Footer: CTA row (Compare, View details)
2. **Category Card**
   - Same container style
   - Icon + category title + short description

**Hover:** subtle elevation + border darken.

### Badges
- **Verified** (trust): `bg-emerald-50 text-emerald-700 border-emerald-200`
- **Best for** (context): neutral (`bg-zinc-50 text-zinc-700 border-zinc-200`)
- **Pricing**: neutral or brand-tinted (never scream).

### Inputs / Search
- Search input is a flagship component: wide, clear placeholder, keyboard-friendly.
- Use leading icon, optional “Category” select, and a submit button.

### Tabs / Filters
- Filters: left sidebar on desktop; drawer on mobile.
- Use chips for quick toggles (Pricing, Deployment, Company size, Integrations).

### Tables / Comparison
- Comparison view uses a **sticky first column** + grouped sections.
- On mobile: convert to stacked “attribute cards”.

### Trust modules (reusable)
- “Why trust HRSignal” panel: verification, transparent methodology, privacy.
- Testimonial cards (not too many; 3 max).
- “As seen in / used by” logo strip (grayscale).
- Security note: “We don’t share your details without consent.”

### Icons
- Use a single set: **Lucide** (line icons).
- Stroke width consistent (2px).
- Don’t mix filled + line styles.

### Images
- Prefer simple product screenshots inside a neutral frame.
- Vendor logos: consistent sizing and padding; grayscale optional.
- Avoid stock photos unless purposeful; if used, keep clean and diverse.

---

## 4) Layout rules (global)

### Header (navigation)
- Left: HRSignal wordmark
- Center (optional): “Categories” / “Tools” / “Vendors”
- Right: Search icon (mobile), “Compare”, “Get recommendations” (primary)

**Sticky header** on scroll for discovery pages.

### Footer
- Column layout: Product, Company, Resources, Legal
- Include: contact email, privacy note, social links (optional)

### Page patterns
- **Discovery pages**: header + search/filter + results grid.
- **Detail pages**: summary header + trust row + key sections + sticky CTA.
- **Forms/wizard**: single column, progress indicator, summary sidebar (desktop).

---

## 5) Information Architecture (IA) + navigation

### Primary nav
- **Categories** (dropdown)
- **Tools**
- **Compare**
- **Pricing**
- **About**
- **Contact**

### Secondary actions
- “Get recommendations” (primary CTA)
- “Submit a tool” (optional later)

### Key page hierarchy
1. Home (category-led entry + trust)
2. Tools listing (filters + sorting)
3. Tool detail (trust + highlights + pricing + alternatives)
4. Recommend wizard (guided intake)
5. Compare (shortlist-driven)
6. Pricing (HRSignal plans / lead-gen model)
7. About / Contact

---

## 6) Above-the-fold blueprint (Home)

**A) Hero (left)**
- Headline: outcome-driven (e.g., “Find the right HR software for your company size”) — *write original copy*
- Subhead: short, trust-forward
- Primary CTA: **Get recommendations**
- Secondary CTA: **Browse tools**

**B) Hero (right)**
- Search module: input + optional category dropdown
- “Popular categories” chips (5–8)

**C) Trust strip (below hero)**
- 3–4 trust bullets with icons:
  - Verified listings
  - Transparent criteria
  - Privacy-first
  - India-first SMEs

**D) Category cards row**
- 6–8 category cards (responsive grid)

**E) Trending / recently verified tools**
- Grid of tool cards (6)

**F) Social proof + CTA**
- Logo strip + testimonial (1–3)
- Final CTA block with simple promise

---

## 7) Component inventory + reuse rules

### Inventory (must be reused)
- `SiteHeader`
- `SiteFooter`
- `Container`
- `Section`
- `Button` (primary/secondary/tertiary)
- `Badge` (verified, neutral)
- `Card` (MarketplaceCard / CategoryCard)
- `SearchBar`
- `FilterSidebar` + `FilterDrawer`
- `ToolCard`
- `VendorCard`
- `TrustStrip`
- `LogoStrip`
- `TestimonialCard`
- `Pagination`
- `EmptyState`
- `Skeleton`

### Reuse rules
1. **One card style** across listings (tools, vendors, categories) with minimal variants.
2. **CTA placement** is consistent:
   - Listing cards: “View details” + “Compare”
   - Detail header: “Request demo / Get pricing” (primary) + “Compare” (secondary)
3. **Badges** are limited to 2–3 per card to prevent clutter.
4. **Spacing** uses the token rhythm (no random `mt-7` unless justified).
5. **Trust modules** appear on all conversion pages (tool detail, recommend, compare).

---

## 8) Accessibility + performance
- AA contrast for text.
- Keyboard navigable search + filters.
- Use `next/image` for all non-trivial images.
- Prefer SSR/Server Components for listings; client components only for filters/wizard.
