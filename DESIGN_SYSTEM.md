# HRSignal — Design System Specification (Next.js 24-hour Sprint)

Scope:
- This document defines **design tokens + UI behavior** for a fast redesign sprint.
- Intended for: product design + engineering implementation alignment.
- Target: clean, trustworthy SaaS UI with India-first procurement credibility.

---

## 1) Color palette

### Brand & semantic colors (source of truth)
- **Primary (teal):** `#0B5F6F` — trust / intelligence / navigation emphasis
- **Accent (gold):** `#D4A574` — **primary CTAs only** (avoid overuse)
- **Verified (green):** `#22C55E`
- **Validate (amber):** `#F59E0B`
- **Neutral (gray):** `#64748B`
- **Light background (teal-tint):** `#F0F9FA`
- **White:** `#FFFFFF`
- **Dark:** `#1A1A1A`

### Surface roles
- **Page background (light):** `#FFFFFF` with subtle gradient to `#F0F9FA`
- **Card background:** `#FFFFFF`
- **Alt section background:** `#F0F9FA`
- **Text primary:** `#1A1A1A`
- **Text secondary:** `#64748B`
- **Borders:** use Neutral gray at low alpha (see borders section)

### Usage rules
- Accent gold appears only on:
  - **Primary button**
  - Active/highest priority CTA states
  - Subtle focus highlight (optional) if contrast remains AA
- Verified/Validate colors are reserved for:
  - badges
  - status chips
  - score indicators
- Do not use gold for informational links or decorative accents.

---

## 2) Typography

### Font
- **Primary font:** Inter
- **Fallback:** `system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`

### Type scale (exact)
- **H1:** 52px, **bold**, color Primary (`#0B5F6F`)
- **H2:** 36px, **bold**, color Primary
- **H3:** 24px, **semibold**, color Primary
- **Body:** 16px, **regular**, color Neutral gray (`#64748B`)
- **Small:** 14px, **regular**, color Neutral gray

### Typography rules
- One H1 per page.
- Keep body copy scannable:
  - 1–2 lines per paragraph where possible
  - use bullets/checklists for decision content
- Links are teal by default (Primary) with clear hover/focus underline.

---

## 3) Spacing

### Spacing scale (tokens)
- **xs:** 4px
- **sm:** 8px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px

### Layout rhythm rules
- Section padding:
  - Mobile: `lg` top/bottom
  - Tablet: `xl` top/bottom
  - Desktop: `xl`–`2xl` equivalent (use `xl` + additional internal spacing)
- Card padding:
  - default `md`
  - dense rows `sm`

---

## 4) Responsive breakpoints

### Breakpoint definitions (layout intent)
- **Mobile:** 320px
  - single column
  - hamburger nav
- **Tablet:** 768px
  - two columns where appropriate
- **Desktop:** 1024px
  - full layout
  - multi-column grids

---

## 5) Logo

### Logo direction
- Evolve current wordmark to include:
  - **Upward arrow mark** in Primary teal (`#0B5F6F`)
  - paired with **“HRSignal”** text

### Scaling requirements
- Must remain legible at:
  - **16px favicon**
  - header logo sizes (24–40px height)

### Usage rules
- On light backgrounds: teal mark + dark text.
- On dark surfaces (if any): invert to white text + teal mark.

---

## 6) Header

### Desktop header layout (sticky)
- **Sticky header**
- Left: Logo
- Center: primary nav item **“Find Your Tool”** (bold, Primary teal)
- Nav groups:
  - **Browse** dropdown
  - **Learn** dropdown
- Right:
  - Account icon
  - **Get Started** button (Accent gold)

### Mobile header layout
- Left: Logo
- Right: Hamburger
- Menu opens as a full-height drawer:
  - accordion sections for Browse and Learn
  - Get Started button pinned near top

### Interaction rules
- Dropdowns:
  - click outside closes
  - keyboard accessible
  - clear focus ring
- Sticky:
  - subtle border bottom
  - no heavy shadow; keep clean

---

## 7) Hero

### Desktop layout (two-column)
- Left:
  - H1 headline (Primary teal)
  - subheadline (Neutral gray)
  - two CTAs **stacked**:
    - Primary CTA: Accent gold
    - Secondary CTA: teal outline or text link
- Right:
  - animated visualization loop:
    - **form → verification → vendor cards**
    - loops every **1.5 seconds**

### Mobile layout (single-column)
- H1 + subheadline + stacked CTAs
- Animation optional (can hide or simplify)

### Background
- White to light teal gradient:
  - `#FFFFFF` → `#F0F9FA`

---

## 8) Decision Snapshot

### Layout
- Background: Light teal `#F0F9FA`
- Contains:
  - Vendor logo
  - **Radial fit score circle**: 80px
  - 3 bullets with check icons
  - Badges:
    - India-ready
    - Evidence-backed
  - CTA: **See Full Shortlist**

### Visual rules
- Use teal for headings/labels.
- Fit score uses Verified/Validate colors only when appropriate.

---

## 9) Trust Cards

### Layout
- Grid:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns

### Card styling
- Background: Light teal `#F0F9FA`
- Border: 1px Neutral gray at low intensity
- Icon + label:
  - Evidence (link icon)
  - Freshness (clock icon)
  - India (map icon)

### Hover behavior
- Scale: **1.02**
- Border changes to Accent gold
- Timing: **300ms** smooth

---

## 10) Process Flow

### Desktop
- Horizontal:
  - **Define → Shortlist → Compare**
  - dashed arrows between steps

### Mobile
- Vertical stack
- Dividers between steps

### Visual rules
- Icons: **48px**, Primary teal
- Headings: H3 Primary
- Alternating backgrounds:
  - Step 1: White
  - Step 2: Light teal
  - Step 3: White

---

## 11) Footer

### Footer layout
- Top section (Light teal): newsletter signup
- Bottom section (White):
  - Logo
  - Four link columns
- Mobile: single column stack

### Footer rules
- Newsletter signup must be simple and non-spammy.
- Links must be scannable and grouped.

---

## Accessibility & motion

### WCAG AA
- Body text contrast: **≥ 4.5:1**
- Large text contrast: **≥ 3:1**
- Keyboard navigation:
  - visible focus states
  - logical tab order
  - dropdowns and drawers operable via keyboard

### Animation timing
- Hero visualization loop: **1.5s**
- Card hover transition: **300ms**
- Reduce motion:
  - respect `prefers-reduced-motion`
  - disable looping animations when enabled
