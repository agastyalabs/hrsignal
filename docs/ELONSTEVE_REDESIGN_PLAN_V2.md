# ElonSteve Redesign Plan v2 (Content/Flow Frozen)

**Non-negotiable constraint:** keep content, page flow, routing, and data logic **100% intact**. This plan is strictly a **visual + component-system** redesign.

This v2 plan incorporates the updated spec requirements:
- Brand colors: **Blue `#1D4ED8`**, **Green `#10B981`**
- Subtle gradients + faint neural background
- Inter fonts
- Spacing: **4px grid**
- Shadows: `sm`/`md`
- Radii: `lg`
- Motion: fade + Y translate

If there are conflicts, resolve by **keeping both trust and compliance sections** on pages.

---

## 0) Guardrails (must-pass)

- ✅ No route changes (must not break `/tools`, `/vendors`, `/categories`, `/recommend`, `/tools/[slug]`, `/compare`, `/resources`, results flow).
- ✅ No content removal or re-ordering. Only layout rhythm, hierarchy, and component styling.
- ✅ Keep trust/compliance content intact even if it creates longer pages.
- ✅ After each phase: `npm run lint` + `npm run build`.

---

## 1) Design system (tokens + typography + layout grid)

### 1.1 CSS variables in `app/globals.css`
Define and lock tokens (single theme):

**Color**
- `--bg: #000000` (or near-black)
- `--text: #FFFFFF`
- `--text-muted: rgba(255,255,255,0.70)`
- `--surface-1: rgba(255,255,255,0.04)`
- `--surface-2: rgba(255,255,255,0.07)`
- `--border-soft: rgba(255,255,255,0.10)`

**Brand**
- `--link: #1D4ED8` (blue)
- `--link-hover: #2563EB`
- `--primary: #10B981` (green)
- `--primary-hover: #34D399`

**Radii**
- `--radius-sm: 0.75rem`
- `--radius-md: 1rem`
- `--radius-lg: 1.25rem` *(“lg radii” feel)*

**Shadows**
- `--shadow-sm: 0 10px 30px rgba(0,0,0,0.22)`
- `--shadow-md: 0 14px 40px rgba(0,0,0,0.30)`

**Glow (controlled)**
- `--glow-green: 0 0 12px rgba(16,185,129,0.50), 0 0 24px rgba(16,185,129,0.25)`

### 1.2 Typography
- Use Inter everywhere (already configured via `next/font`).
- System scale: ensure headings and body sizes are consistent and responsive.
- Keep line-height generous for scannability.

### 1.3 Spacing (4px grid)
- Enforce spacing using Tailwind multiples of 1 (`p-1` = 4px) and consistent section paddings.
- Standard section padding: `py-12 sm:py-16 lg:py-24` (already used; keep consistent).

---

## 2) Tailwind guidance (`tailwind.config.ts`)

Add a small `brand` palette and map utilities:
- `brand.blue: #1D4ED8`
- `brand.green: #10B981`
- optional: `brand.black`, `brand.white`

Guidance
- Links: always `text-[var(--link)]` with hover `text-[var(--link-hover)]`.
- CTAs/scores: always `bg-[var(--primary)]` / `text-[var(--primary)]`.
- Avoid arbitrary one-off hex codes in page files; use tokens.

---

## 3) Component library (shared primitives)

### 3.1 Button
File: `components/ui/Button.tsx`

Spec
- Primary: green, **glow hover**, slight **scale/translate** on hover.
- Secondary: surface + border, subtle lift.
- Accessibility: visible focus ring.

Acceptance
- Hover: `hover:-translate-y-0.5` + `hover:shadow-[var(--glow-green)]`.
- Mobile/touch: no jumpy transforms (keep subtle).

### 3.2 Card
File: `components/ui/Card.tsx` and/or utility class `u-card-hover`

Spec
- Default card: surface + soft border.
- Hover: **gray shadow** + **green border** highlight.

Acceptance
- `hover:border-[rgba(16,185,129,0.35)]`
- `hover:shadow-[var(--shadow-md)]`

### 3.3 Tag / Badge
File: `components/ui/Badge.tsx`

Spec
- “Tag green full” variant for key labels.

### 3.4 Progress
If a shared progress exists (or needs adding):
- green animated fill (respect reduced motion).
- Do not add heavy dependencies.

### 3.5 Score
Used in results/readiness contexts:
- bold typography, green emphasis for high scores.
- Ensure contrast and meaning beyond color (label + icon/wording).

---

## 4) Motion system

Goal: consistent fade-in on sections and cards.

- Default: `opacity: 0 → 1` and `translateY(20px) → 0`.
- Respect `prefers-reduced-motion`.
- Prefer CSS transitions; use `framer-motion` only if required.

---

## 5) Page-by-page styling plan (content order frozen)

### 5.1 Global header
- Dropdowns: center under trigger, smooth transition.
- Active link: green underline.
- Mobile: padding and hit targets tuned.

### 5.2 Homepage hero
- Centered hero with gradient background.
- Add **faint neural background** (CSS background image/gradient; very subtle).
- Cards fade in.

### 5.3 Directory pages (tools/vendors/categories)
- Consistent grid gutters and mobile padding.
- Card hover behavior consistent (green border highlight).

### 5.4 Inner pages
- Keep both trust and compliance sections.
- Add breadcrumbs.

### 5.5 Footer
- Maintain column layout.
- “Emerald links” = use green for key footer links (but keep general links blue if that’s the global rule). If we need both:
  - Primary footer CTA links: green
  - Regular informational links: muted/blue

---

## 6) Implementation order (smallest safe steps)

1) Update tokens + Tailwind mapping
2) Button + Card + Badge
3) Header dropdown active underline + mobile padding
4) Motion wrappers
5) Page polish (home → directories → detail pages → recommend → results)

---

## 7) QA checklist

- Desktop + mobile sanity pass on:
  - `/` `/tools` `/vendors` `/categories` `/compare` `/recommend` `/resources` `/results/[id]`
- Keyboard navigation (header + drawer)
- Contrast checks for muted text, links, and focus ring
- Reduced motion settings

