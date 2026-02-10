# UI_KIT_AND_SCREENS — HRSignal Revamp V2 (Scannable Spec)

Input:
- `docs/UI_UX_REVAMP_V2.md`

Hard rules (apply everywhere):
- Lead flow intact (forms/endpoints/routing unchanged)
- India-first signals always visible (compliance + INR/PEPM language + India presence)
- No long paragraphs (bullets + examples)
- Trust-first UI (verification + freshness + sources always visible)
- ‘Sources & data quality’ accordion is **collapsed by default**

---

## 1) Design tokens

### 1.1 Spacing (8pt grid)
- `s1` = 4 (micro gaps)
- `s2` = 8 (chip gaps)
- `s3` = 12 (label/value spacing)
- `s4` = 16 (card padding min)
- `s5` = 20 (card padding default)
- `s6` = 24 (section internal gap)
- `s7` = 32 (section gap default)
- `s8` = 48 (mobile large padding)
- `s9` = 64 (desktop large padding)

Defaults:
- Card padding: `s4–s5`
- Section gap: `s6–s7`

### 1.2 Radius
- `r-sm` = 10 (inputs, chips)
- `r-md` = 12 (buttons)
- `r-lg` = 16 (cards)

### 1.3 Type scale (strict ramp)
Desktop:
- **H1**: 40/48
- **H2**: 28/36
- **H3**: 20/28
- **Body**: 16/26
- **Small/Meta**: 13/20

Mobile:
- **H1**: 32/40
- **H2**: 24/32
- **H3**: 18/26
- **Body**: 16/26
- **Small/Meta**: 13/20

Rules:
- One H1 per page.
- Use H3 for section headers (avoid extra sizes).
- Body line-height: **1.5–1.7**.
- Body max line length: **70–80ch**.

### 1.4 Surface levels (dark default)
Define **3 surfaces** to avoid “too dark”:
- `Surface-0` (base background)
- `Surface-1` (cards/panels) — slightly lighter than S0
- `Surface-2` (raised: sticky bars, dropdowns, bottom sheets) — slightly lighter than S1

Text roles:
- `Text/Primary` (titles, key values)
- `Text/Secondary` (body)
- `Text/Muted` (labels, timestamps, helper)
- `Placeholder` (readable muted; not faint)

### 1.5 Borders / shadows
- Borders:
  - `border-1` = 1px subtle divider (default)
  - `focus-ring` = 2px brand outline (keyboard focus)
- Shadows:
  - Use existing elevation tokens only.
  - If shadows aren’t used today in dark mode: rely on **surface delta + border** (no new “premium tricks”).

---

## 2) Component specs (required set)

> All components must support: **loading**, **empty**, and **error** states at the page-level where applicable.

### 2.1 VendorCard

Purpose:
- Quick credibility + coverage read (G2-like scan)

Structure (top → bottom):
- Logo (optional) + **Vendor name**
- Domain (secondary)
- Category chips (max 3 + “+N”)
- Listings count
- Trust mini-row (always visible):
  - Verification level (Verified / Partially verified / Unverified)
  - Freshness date
  - Sources count
- CTA: **View vendor**

Data completeness display:
- If listings count is 0:
  - Show: “No published tools yet” (muted)
  - Do NOT show repeated “info pending” lines

### 2.2 ToolCard

Purpose:
- Decision-first shortlist card (minimal facts + trust)

Structure:
- Tool name (primary)
- `by Vendor` (secondary)
- Disambiguation line (conditional):
  - “Not to be confused with Freshservice.”
- Key facts (max 3 visible rows):
  - Pricing model + **unit** (INR/PEPM when applicable)
  - Deployment
  - Implementation range
- Trust row (always visible): badge + freshness + sources
- Actions:
  - Primary: View details
  - Secondary: Compare (only if compare is shipping)

### 2.3 FilterBar

Purpose:
- Fast narrowing + clarity of active filters

Desktop layout:
- Sticky controls row
- Includes:
  - Search
  - Filter groups (chips/select)
  - Active filter chips
  - Clear-all (single click)

Mobile layout:
- Filters open as **bottom sheet**
- Active filter chips remain visible above results

Rules:
- Always show active filters.
- Always provide clear-all.

### 2.4 Sort

Purpose:
- Control scanning order with explainability

Spec:
- Default: **Recommended**
- Options:
  - Recommended
  - A–Z
  - Most listings
  - Recently verified

Required microcopy:
- “Why recommended” tooltip
  - Example: “Category match + size fit + verified recency”

### 2.5 Tabs

Purpose:
- Used only if it reduces scroll/cognitive load (don’t tab everything)

Allowed uses:
- Vendor detail: switch between “Tools” and “Overview” ONLY if the page is too long and the layout already supports it.

Rules:
- Tabs must not hide trust signals row.

### 2.6 Sticky summary panel (Vendor detail)

Purpose:
- Buyer confidence: identity + trust + key facts always accessible

Contents:
- Vendor logo + name
- Key facts row:
  - India presence / HQ
  - Categories served
  - Listings count
- Trust signals row (always visible):
  - Verification level
  - Freshness date
  - Sources count
- Primary CTA: **Get recommendations** (lead flow unchanged)

Rules:
- No new CTAs introduced.
- Must not overlap other CTAs on mobile.

### 2.7 Compare table row

Purpose:
- Fast scanning comparisons

Row spec:
- Left: label (muted)
- Right: value(s) (secondary/primary)

Required compare dimensions (from V2):
- Pricing model + unit
- Deployment
- India compliance tags
- Integrations
- Implementation range
- Trust row (verified/freshness/sources)

---

## 3) Page wireframes (text only; section-by-section)

### 3.1 `/vendors` — grid + filters + sorting

1) Header
- Nav links

2) Page header
- H1: Vendors
- Subhead (1 line)

3) FilterBar (sticky on desktop)
- Search: vendor name/domain
- Filters:
  - Category served
  - Verification level
  - India presence toggle
- Sort (with “why recommended” tooltip)
- Active filter chips + clear-all

4) Results grid (VendorCard)
- G2-style card grid
- Consistent height where possible

5) States
- Loading: skeleton card grid
- Empty: “No vendors match these filters” + Clear-all + View all categories
- Error: “Couldn’t load vendors” + Retry

---

### 3.2 `/vendors/[slug]` — sticky summary + section cards + sources accordion

1) Sticky summary panel (hero)
- Vendor name/logo
- Key facts row
- Trust signals row
- Primary CTA: Get recommendations

2) Sticky section nav (desktop)
- Overview
- Products
- Best for
- Integrations
- Compliance (if applicable)
- Sources

3) Section cards
- Overview card
  - 2–4 bullets
- Products card
  - ToolCard list
  - Optional compare affordance (only if compare ships)
- Best for card
  - Size bands + use cases
- Integrations card
  - chips (max 6 + “+N”)
- Compliance card (conditional)
  - tags + missing info checklist (max 3)
- Pricing card
  - model + unit
  - missing info checklist (max 3)

4) Sources accordion (collapsed by default)
- Sources checked (3–8 links)
- Data gaps (bullets)
- Last checked date

5) States
- Loading: hero + 2–3 card skeletons
- Empty (no tools): “No published tools yet” + Request recommendation CTA
- Error: Retry

---

### 3.3 `/categories/[slug]` — intro + leader grid + compare

1) Header

2) Category intro
- Category title
- 1-line definition
- CTA: Browse tools (pre-filtered)

3) Leader grid: “Top verified tools”
- 3–6 ToolCards
- Trust row always visible
- Compare affordance if compare ships

4) Evaluation cards
- Key evaluation criteria (checklist)
- Common pitfalls (bullets)
- Recommended for (size bands + India compliance notes)

5) Filter shortcuts
- Intent chips (small set)

6) States
- Loading: skeleton cards
- Empty: “No verified tools yet” + Show partially verified + Request recommendation
- Error: Retry

---

## 4) Micro-UX rules (required)

### 4.1 Empty / loading / error
- Loading:
  - Use skeletons for:
    - vendors grid
    - vendor detail hero + key facts
- Empty:
  - Must explain why it’s empty (filters too strict / no India-first matches)
  - Must provide 1–2 recovery actions (clear-all, broaden filters, request recommendation)
- Error:
  - One clear message + Retry

### 4.2 Truncation rules
- Titles and domains:
  - 1-line truncate in cards
  - Tooltip on hover/focus (desktop)
- Never truncate:
  - verification level
  - freshness date
  - primary CTA text

### 4.3 Tap targets
- Minimum interactive target: **44px** (mobile)
- Applies to:
  - chips
  - buttons
  - accordion headers
  - sticky nav controls

### 4.4 Focus states
- Keyboard focus must be visible:
  - 2px brand focus ring
- Focus order must be logical:
  - filters → results → pagination (if present)

### 4.5 India-first signals (always visible)
- Vendor detail:
  - India presence and compliance cues appear in the summary panel
- Tool cards:
  - pricing units default to INR/PEPM language when applicable
- Filters:
  - India presence toggle visible in FilterBar

### 4.6 Disambiguation (“Fresh* families”)
- Conditional line under name:
  - “Not to be confused with Freshservice.”
- Trigger when brand family collision risk is known:
  - Freshteam / Freshservice / Freshdesk
  - Zoho People / Zoho Recruit / Zoho Payroll
