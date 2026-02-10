# HRSignal UI Kit + Screens (Revamp V2)

Source of truth:
- `docs/UI_UX_REVAMP_V2.md`

Principles (enforced in this doc):
- Scannable > verbose (no long paragraphs)
- Decision-first UX (key facts rows, cards, comparison surfaces)
- Trust-first UI (verification level + freshness + sources always visible)
- Dark default, light optional
- **No lead-flow changes** (forms/endpoints/routing unchanged)
- **Sources & data quality is collapsed by default**
- Disambiguation always supported: **“Not to be confused with …”** for brand families (Fresh*, Zoho*, etc.)

---

## 1) Design tokens

### 1.1 Token table (use as the reference spec)

> All values follow an 8pt grid where applicable.

#### Type scale
- **H1**: 40 / 48 (Desktop), 32 / 40 (Mobile)
- **H2**: 28 / 36 (Desktop), 24 / 32 (Mobile)
- **H3**: 20 / 28 (Desktop), 18 / 26 (Mobile)
- **Body**: 16 / 26 (Desktop+Mobile)
- **Small / Meta**: 13 / 20
- **Muted helper**: 13 / 20 (same size as Small; different color)

Rules:
- 1 H1 per page.
- Section headers use H3 (avoid too many sizes).
- Body line-height target: **1.5–1.7**.
- Max line length for body blocks: **70–80ch**.

#### Spacing scale
| Token | px | Usage |
|---|---:|---|
| space-1 | 4 | icon padding micro-gaps |
| space-2 | 8 | chip gaps, small stack |
| space-3 | 12 | label/value gaps |
| space-4 | 16 | card padding (tight), row spacing |
| space-5 | 20 | card padding (default) |
| space-6 | 24 | section internal gaps |
| space-7 | 32 | section gaps (default) |
| space-8 | 48 | large section padding (mobile) |
| space-9 | 64 | large section padding (desktop) |

Defaults:
- Card padding: **16–20**
- Section gap: **24–32**

#### Radius
| Token | px | Apply to |
|---|---:|---|
| radius-sm | 10 | inputs, small pills |
| radius-md | 12 | buttons |
| radius-lg | 16 | cards |

#### Elevations (keep minimal)
| Token | Use | Notes |
|---|---|---|
| elev-0 | base | no shadow |
| elev-1 | card | subtle, consistent |
| elev-2 | hover | only on hover-capable devices |

> If the codebase already has 0 shadows in dark theme, treat elev-1/elev-2 as “border + surface delta only”. No new visual tricks.

#### Borders
| Token | Spec | Apply to |
|---|---|---|
| border-1 | 1px | cards, table rows, dividers |
| border-subtle | 1px low-contrast | default separators |
| focus-ring | 2px | keyboard focus outline |

---

## 2) Color system (dark default + optional light)

### 2.1 Dark theme (default) — **avoid “too dark”**

Define exactly **3 surface levels**:
- **Surface 0 (Base background)**: app background
- **Surface 1 (Card surface)**: cards, panels
- **Surface 2 (Raised surface)**: sticky bars, modals, dropdowns, bottom sheets

Rules:
- Surface 1 must be **slightly lighter** than Surface 0.
- Surface 2 must be **slightly lighter** than Surface 1.
- Borders are subtle; surface delta does most of the separation.

Text roles:
- **Text/Primary**: near-white (used for titles and key values)
- **Text/Secondary**: readable muted (body and descriptions)
- **Text/Muted**: helper labels, timestamps, “info pending” (still readable)
- **Placeholder**: readable muted (not faint)

Brand role:
- **Brand/Primary (purple)** used for:
  - primary CTA
  - focus ring
  - links (with underline rules below)

### 2.2 Light theme (optional)

Rules:
- Preserve the same 3-surface model.
- Preserve contrast ladder (Primary/Secondary/Muted).
- Keep brand purple consistent (don’t shift hue between themes).

---

## 3) Component specs + states

> All components must support: loading, empty, and data-quality badges (Verified/Partial/Unknown) where applicable.

### 3.1 Vendor card (directory)

Structure (top → bottom):
- Logo (optional) + **Vendor name**
- Domain (secondary)
- Categories chips (max 3 + “+N”)
- Listings count (published tools)
- Trust mini-row: **Badge + Freshness + Sources count**
- CTA: **View vendor**

States:
- **Default**
- **Hover**: border/underline emphasis only (no new shadows if not already present)
- **Loading**: skeleton for logo/title + 2 rows
- **Empty**: not applicable per-card; handled by page empty state

Rules:
- Never show “0 tools” without explanation:
  - show as “No published tools yet” + link “Request details” (secondary)

### 3.2 Tool card (leaders grid / category / tools list)

Structure:
- Tool name (primary)
- `by Vendor` (secondary)
- Disambiguation line (only when needed):
  - “Not to be confused with Freshservice.”
- Key facts rows (3 max visible):
  - Pricing model + unit (PEPM/per recruiter/month/one-time/quote)
  - Deployment
  - Implementation range
- Trust row: badge + freshness + sources
- Actions:
  - Primary: View details
  - Secondary: Compare (only if compare page is shipping)

States:
- Default / Hover / Loading skeleton
- Empty: tool not found handled at page level

Truncation:
- 1-line truncate for tool title where needed + tooltip on hover/focus.

### 3.3 Badges (Verified / Partial / Unknown)

Badge variants:
- **Verified**
  - Label: “Verified”
  - Used when sources checked + recent freshness exist
- **Partial**
  - Label: “Partially verified”
  - Used when some evidence exists but incomplete/older
- **Unknown / Unverified**
  - Label: “Unverified”
  - Used when evidence pending

Rules:
- Badges must be visually distinct but not loud.
- Badge always appears adjacent to freshness.

### 3.4 Chips (categories / filters / integrations)

Chip variants:
- Filter chip (interactive)
- Tag chip (informational)

Rules:
- Max visible chips in a row: **6**; then “+N”.
- Chip height must meet tap target constraints on mobile (see micro-UX).

### 3.5 Accordion

Uses:
- FAQs
- **Sources & data quality (collapsed by default)**

States:
- Collapsed (default)
- Expanded
- Loading (optional)

Rules:
- Title row is clickable; arrow icon indicates state.
- Content inside uses bullets + links (no long paragraphs).

### 3.6 Table rows (compare + key facts tables)

Row types:
- Label/value rows (detail pages)
- Compare grid rows

Rules:
- 1px subtle dividers.
- Use alternating surfaces only if it already exists as a token; otherwise use border + spacing.
- Label uses Muted; value uses Secondary/Primary depending on importance.

### 3.7 Sticky section nav (detail pages)

Desktop behavior:
- Sticky TOC visible after hero.
- Active section highlighted.

Mobile behavior:
- Convert to a compact sticky dropdown/pill (no new component; use existing select/menu pattern).

Rules:
- Must not overlap primary CTA.
- Active indicator uses brand color sparingly.

### 3.8 Compare bar (sticky)

Contents:
- Selected count (e.g., “2 selected”)
- Compare CTA
- Clear action (secondary)

Rules:
- On mobile: must **not cover primary CTAs**.
- Must be dismissible or collapsible if it blocks content.

States:
- Hidden (0 selected)
- Visible (1+ selected)

### 3.9 “Info pending” state

Where it can appear:
- Pricing unit
- State coverage
- Security docs

How it must appear (compact checklist):
- Inside the relevant card as a single line:
  - `Missing info (verifying): [ ] Pricing unit  [ ] State coverage`

Rules:
- Max 3 items per card.
- Anything beyond goes to Sources & data quality → Data gaps.

---

## 4) Micro-UX details (must implement)

### Hover / focus
- Hover (desktop):
  - link underline visible
  - border emphasis on card
- Focus (keyboard):
  - visible **2px brand focus ring**
  - focus never relies on color alone; include outline

### Tap targets (mobile)
- Minimum tap target: **44px** height/width
- Applies to:
  - chips
  - buttons
  - accordion headers
  - sticky nav controls

### Truncation + tooltip
- 1-line truncation allowed for:
  - titles in cards
  - long domains
- Tooltip behavior:
  - shows full text on hover (desktop)
  - accessible alternative on mobile (long-press or “info” icon if already present)

### Link styling
- Links are always distinguishable:
  - underline on hover/focus
  - default state uses brand color (no new colors)
- Avoid “everything is clickable”:
  - only title + CTA button are primary click targets
  - metadata rows are not clickable unless explicitly designed

### Icon sizing
- Standard icon sizes:
  - 16px in dense rows
  - 20px in buttons
  - 24px for empty states

### Density rules
- Cards:
  - max 2 lines summary
  - max 3 key facts visible
  - the rest behind accordion/“+N”

---

## 5) Screen specs — page-by-page annotated wireframes

> Format: sections listed top-to-bottom with annotations.
> All pages use: 3 surface levels + contrast ladder + trust row.

### 5.1 Vendors list (`/vendors`) — **G2-style grid + sorting + filters**

**A. Page header**
- H1: Vendors
- Subhead: 1 line
- Search: vendor name/domain

**B. Controls row (sticky on desktop)**
- Filters (chips/select):
  - Category served
  - Verification level (Verified / Partial / Unverified)
  - India presence toggle
- Sort:
  - Recommended (default)
  - A–Z
  - Most listings
  - Recently verified
- Microcopy tooltip: “Why recommended”
  - Example: “Category match + size fit + verified recency”

**C. Vendor cards grid (G2-like)**
- Grid: consistent card height where possible
- Each card shows:
  - Name + domain
  - Categories (3 chips + “+N”)
  - Listings count
  - Trust mini-row (badge + freshness + sources)
  - CTA: View vendor

**D. Empty state**
- Message: “No vendors match these filters.”
- Actions:
  - Clear all
  - View all categories

**E. Loading**
- Skeleton grid: 8–12 cards with title + 2 rows

---

### 5.2 Vendor detail (`/vendors/[id]`) — **summary panel + sticky nav + cards**

**A. Hero (summary panel)**
- Vendor logo + name
- Key facts row (label:value):
  - India presence / HQ
  - Categories served
  - Listings count
- Trust signals row (always visible):
  - Badge (Verified/Partial/Unverified)
  - Freshness date
  - Sources count
- Primary CTA: Get recommendations
  - Note: does not change lead flow

**B. Sticky section nav (desktop)**
- Overview
- Products
- Best for
- Integrations
- Compliance (if applicable)
- Sources

**C. Cards (same layout; better structure)**

1) Overview card
- 2–4 bullets max

2) Products card
- Tool cards list
- Compare affordance optional:
  - if compare ships, show “Add to compare”

3) Best for card
- Size bands
- Use cases (chips or bullets)

4) Integrations card
- Chips + “+N” expand

5) Compliance card (conditional)
- Tags
- If pending: compact checklist (max 3)

6) Pricing card
- Model + unit row
- If pending: compact checklist (max 3)

7) Sources & data quality card (accordion; **collapsed by default**)
- Sources checked (3–8 links)
- Data gaps (bullets)
- Last checked date

**D. Loading**
- Skeleton: hero + key facts rows + 3 cards

---

### 5.3 Category page (`/categories` and/or `/categories/[slug]`) — **intro + leader grid + compare**

**A. Hero**
- Category title
- 1-line definition
- CTA: Browse tools (pre-filtered)

**B. Top verified tools (leader grid)**
- 3–6 tool cards
- Each card includes:
  - name + by vendor
  - key facts (3 max)
  - trust row
  - compare affordance (if compare ships)

**C. Key evaluation criteria card**
- Checklist bullets

**D. Common pitfalls card**
- Bullets

**E. Recommended for card**
- Size bands
- India compliance notes

**F. Filter shortcuts**
- Intent chips (small set; no complex scoring)

---

## 6) Disambiguation patterns (Fresh* families) — required

### 6.1 Inline disambiguation line
Place directly under tool title when a brand family risk exists:
- `Not to be confused with Freshservice.`

Rules:
- Always muted.
- Always 1 line.

### 6.2 Collapsed “family box” (optional; only if already supported)
- Accordion titled: “Other products in this family”
- Items:
  - Freshteam — ATS
  - Freshservice — ITSM
  - Freshdesk — Support desk

---

## 7) Acceptance checklist (revamp-ready)

- Tokens documented (type/spacing/radius/elevation/borders)
- Dark theme uses 3 surface levels and is not “too dark”
- Vendor card + tool card have loading + trust-row patterns
- Badge system supports Verified/Partial/Unverified
- Info pending shown as compact checklist (max 3 per card)
- Sources & data quality is collapsed by default
- Micro-UX rules applied (44px tap targets, hover/focus, truncation)
- Annotated wireframes exist for Vendors list, Vendor detail, Category page
