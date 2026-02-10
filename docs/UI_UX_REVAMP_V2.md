# HRSignal UI/UX Revamp V2 — Single Source of Truth

## 1) North-star
**Goal:** HRSignal should feel like **G2 / SoftwareSuggest-level polish** but **cleaner, faster, and India-first**.

That means:
- **Decision-first UX**: buyers can shortlist quickly without reading essays.
- **Trust-first UI**: verification level + freshness + sources are always visible.
- **India-first defaults**: compliance terms, pricing units (INR/PEPM), and SMB workflows are the baseline.
- **Scannable over verbose**: cards, key-facts rows, comparison surfaces; minimal paragraphs.

---

## 2) Non-negotiables

### Keep lead flow unchanged
- **Do not change** lead capture forms’ behavior, endpoints, or routing.
- Keep:
  - existing UI forms (where they are today)
  - existing POST targets (`/api/leads`, etc.)
  - existing redirect behavior and success/error semantics
- We can improve styling, validation messaging, and UX polish, but **no breaking payload/route changes**.

### Theme
- **Dark default**, **light optional**.
- Dark theme must be the primary design target; light is a toggle/alternate palette.

### No doc-dumps
- No long wall-of-text pages.
- Everything should be **carded** and **scannable**:
  - key facts rows (label:value)
  - bullets
  - accordions
  - chips
  - tables only where they improve scan speed

---

## 3) MICRO-UX checklist (must-haves)

### Typography
- **Max line length:** 70–80ch for body text blocks.
- **Body line-height:** 1.5–1.7.
- Use a strict type ramp (one H1, one H2, body, muted). Avoid too many sizes.

### Spacing
- Consistent **8pt grid**.
- **Card padding:** 16–20px.
- **Section gap:** 24–32px.
- Keep spacing tokens consistent across pages.

### Contrast
- Ensure text contrast is readable on dark.
- Avoid “mid-gray on gray” (e.g., gray-500 on gray-800) for body text.
- Treat placeholder text as a first-class UX element (still readable).

### Content density
- Prefer **key facts rows** over paragraphs.
- Pattern: `Label` : `Value` (with optional helper tooltip).

### Sticky section nav on detail pages
- Sticky section navigation (TOC) on tool/vendor detail pages.
- Active section highlight as user scrolls.

### Trust signals row
Every tool/vendor detail page must show a trust row containing:
- **Data freshness date** (e.g., “Verified Feb 2026” or “Updated Feb 2026”)
- **Sources count** (e.g., “3 sources”)
- **Verification level** (Verified / Partially verified / Unverified)

### Loading skeletons
- Skeletons for:
  - directory lists (tools/vendors/resources)
  - detail pages (hero + key facts)

### Empty states
- Empty states must explain:
  - why it’s empty (filters too strict, no India-first matches, etc.)
  - a clear CTA (clear filters, view category, request recommendation)

### Filter UX
- Always show **active filter chips**.
- Include **single-click clear-all**.

### Sorting
- Default sort: **Recommended**.
- Must show **“why recommended”** (tooltip)
  - example: “Category match + size fit + verified recency”.

### Mobile
- Filters open as a **bottom sheet**.
- Sticky compare bar must **not cover CTAs**.

### Microcopy rules
- No marketing fluff.
- Use practical buyer language: implementation time, PEPM, compliance scope, support channels.

### Disambiguation rule
- For brand families:
  - show **“Not to be confused with X”** directly under the product name.
  - example: “Freshteam — not to be confused with Freshservice.”

---

## 4) Page blueprints

### A) Vendors list (`/vendors`)
**Purpose:** browse companies behind tools; quickly evaluate credibility + coverage.

**Above the fold**
- H1: “Vendors”
- Subhead: 1 line: “Browse vendors behind HR tools. Filter by categories and verification.”
- Search input (vendor name / domain)

**Controls row (sticky on scroll on desktop)**
- Filters:
  - Category served (chips)
  - Verification level
  - India presence (toggle)
- Sort: Recommended / A–Z / Most listings / Recently verified

**Vendor cards grid**
Each card:
- Logo
- Vendor name + website domain
- Categories served (max 3 chips + “+N”)
- Listings count (published tools)
- Trust row mini: verification + freshness
- CTA: “View vendor”

**Empty state**
- Message: “No vendors match these filters.”
- Actions: Clear all, View all categories

---

### B) Vendor detail (`/vendors/[id]`)
**Purpose:** confirm vendor credibility + see tool lineup.

**Hero**
- Vendor logo + name
- Key facts row:
  - HQ / India presence
  - Categories served
  - Listings count
- Trust signals row: verification level + freshness date + sources count
- Primary CTA: “Get recommendations” (does not replace existing lead flow)

**Sticky section nav (desktop)**
- Overview
- Products
- Best for
- Integrations
- Compliance (if applicable)
- Sources

**Sections**
- Overview: short, 2–4 bullet summary
- Products: tool cards list
- Best for: size bands + use cases
- Integrations: chips
- Sources accordion: evidence links

---

### C) Category page (`/categories` and/or `/categories/[slug]`)
**Purpose:** choose primary need, then see top verified tools and how to evaluate.

**Hero**
- Category title + 1-line definition
- CTA: “Browse tools” (pre-filtered)

**Category content blocks**
- “Top verified tools” (3–6 cards)
- “Key evaluation criteria” (checklist card)
- “Common pitfalls” (bullets)
- “Recommended for” (size bands / India compliance)

**Filter shortcuts**
- Intent chips that apply a small set of filters (no complex scoring).

---

## 5) Component inventory + tokens

### Core components
- **Hero**
  - H1 + subhead
  - CTAs (primary/secondary)
  - Trust signals row
- **Filters**
  - Desktop: left panel or top bar
  - Mobile: bottom sheet
  - Active filter chips + clear-all
- **Compare bar (sticky)**
  - shows selected tools count
  - compare CTA
  - never covers primary CTAs on mobile
- **Vendor card**
- **Tool card**
- **Rating block**
  - Only show rating if real; otherwise show “No ratings yet” (don’t fake trust)
- **Pricing block**
  - Model: PEPM / per user / quote-based
  - disclaimers, no false precision
- **Integrations block**
  - chips + “view all” expand
- **Pros/Cons**
  - 3–5 bullets each
- **Sticky TOC**
  - active highlight
- **Sources accordion**
  - evidence URLs + last checked date

### Tokens (design system)
Define tokens for both dark default and optional light:

**Colors (dark default)**
- Background: near-black / deep slate
- Surface: slightly lighter than background
- Border: subtle (1px)
- Text:
  - primary: near-white
  - secondary: readable muted
  - placeholder: readable muted (not too faint)
- Brand:
  - primary purple (consistent across buttons, focus rings)

**Radius**
- Inputs/buttons: 10–12px
- Cards: 14–16px

**Shadows**
- One main elevation token for cards
- One hover elevation token

**Borders**
- 1px default border token
- Focus ring: purple glow (visible)

---

## Data completeness tiers (UI behavior)

### Verified
**Meaning:** data checked recently with evidence.

**UI**
- Badge: “Verified”
- Trust signals row shows:
  - “Verified <Mon YYYY>”
  - sources count
- Emphasize in sorting/ranking.

### Partially verified
**Meaning:** some evidence, but not complete or older.

**UI**
- Badge: “Partially verified”
- Trust row shows “Updated <Mon YYYY> • X sources”
- Still listed, but ranking slightly lower than Verified.

### Unverified
**Meaning:** listing exists but lacks evidence/freshness.

**UI**
- Badge: “Unverified” (muted)
- Show a short hint: “Evidence pending”
- Keep in directory only if user toggles “Show all listings” or if required for completeness.

---

## Disambiguation rules (brand/product families)
Some products share names/brands and confuse buyers. Rules:
- Add a **disambiguation line** under the title:
  - “Not to be confused with Freshservice.”
- Add a **family box** (collapsed by default) that lists siblings:
  - Freshteam / Freshservice / Freshdesk
- Ensure search results show:
  - product type (“ATS”, “ITSM”, etc.)
  - vendor name

Examples to handle:
- Freshteam vs Freshservice vs Freshdesk
- Zoho People vs Zoho Recruit vs Zoho Payroll
- SAP SuccessFactors modules

---

## Constraints reminder
This revamp must **not** break:
- lead form submission UX
- existing endpoints and routing for lead pipeline

All UI/UX improvements should be implemented as incremental PRs, behind safe conditional rendering where data is incomplete.
