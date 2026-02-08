# UI Wireframe Plan (Final) — HRSignal

**Scope:** Homepage, Categories, Product Listing (Tools directory), Product Detail, Resources.

**Goals:**
- Premium, India-first marketplace feel (dark, readable, trustworthy)
- Consistent layout primitives and spacing
- Deterministic, explainable UX (recommendations + compare)
- Clear conversion CTAs (recommendations + lead capture)

---

## Global System

### Layout grid
- **Container:** `max-w-6xl` (marketing pages), `max-w-7xl` ok for dense directories
- **Padding:** `px-6` base, `sm:px-8` optional
- **Section spacing:**
  - default: `py-10 sm:py-14`
  - dense (directory): `py-8 sm:py-10`
- **Card radius:** `rounded-2xl` for marketing blocks, `rounded-xl` for standard cards
- **Card padding:** `p-5` default, `p-6` for hero/feature blocks
- **Border token:** `border-[var(--border)]`

### Spacing system (tokens)
Use a small, consistent scale:
- `gap-2` (8px)
- `gap-3` (12px)
- `gap-4` (16px)
- `gap-6` (24px)
- `gap-10` (40px)
- `mt-4` (16px)
- `mt-6` (24px)
- `mt-8` (32px)
- `mt-10` (40px)

### Typography scale
Use **Inter** (single family). Weights are deliberate.
- Display / Hero:
  - H1: `text-4xl sm:text-5xl font-semibold tracking-tight leading-tight`
  - H2: `text-2xl sm:text-3xl font-semibold tracking-tight`
- Page titles:
  - H1: `text-3xl sm:text-4xl font-semibold tracking-tight`
- Section titles:
  - `text-xl sm:text-2xl font-semibold`
- Card titles:
  - `text-base font-semibold`
- Body:
  - `text-sm leading-relaxed` (default)
  - `text-base leading-relaxed` (hero body)
- Muted:
  - `text-[var(--text-muted)]`

### Color tokens (canonical)
From `app/globals.css`:
- `--bg: #0B0E23`
- `--surface-1: #121634`
- `--surface-2: #171C3F`
- `--primary: #7441F2`
- `--primary-hover: #825AE0`
- `--text: #F5F7FF`
- `--text-muted: #B6B9D8`
- `--border: rgba(255,255,255,0.08)`

Usage rules:
- Page background = `var(--bg)`
- Cards default = `var(--surface-1)`
- Card emphasis = `var(--surface-2)`
- Links/CTAs = `var(--primary)` and hover `var(--primary-hover)`
- Text always uses `var(--text)` or `var(--text-muted)` (no low-contrast grays)

### Primary CTAs (standard)
- Primary button: **“Get personalised recommendations”**
- Secondary button: **“Browse verified tools”**
- Tertiary link: **“Compare tools”**

---

## Shared Components (building blocks)

### Layout
- `SiteHeader` (global nav + search + compare badge)
- `SiteFooter` (links + privacy + brand)
- `Container` (width + padding)
- `Section` (vertical spacing + optional background)

### UI primitives
- `Card`
- `Button`, `ButtonLink`
- `Input`
- `Badge`
- `SectionHeading`
- `ToastViewport`

### Catalog components
- `ToolCard`
- `VendorCard`
- `CategoryCard`
- `VendorLogo`
- `CompareTray`, `CompareToggle`, `CompareHydrate`

---

## Page Wireframes

## 1) Homepage (`/`)

### A. Header (global)
- Component: `SiteHeader`
- Elements:
  - Left: brand mark + **HRSignal** text
  - Middle (desktop): search input (routes to `/tools?q=`)
  - Right: nav links + compare count + CTA

### B. Hero
- Layout: 2-column (copy left, interactive panel right), stacks on mobile
- Components:
  - `Section`
  - `Card` (hero shell)
  - `ButtonLink`

**Exact copy blocks**
- Pill: `Built for Indian SMEs • HR-only directory`
- H1: `Stop guessing HR software.`
- H2: `Get a shortlist that actually fits your team.`
- Body:
  - `HRSignal helps Indian SMEs compare HRMS, payroll, compliance, attendance, ATS and performance tools — with clear match reasons, not sales fluff.`
- Primary CTA: `Get personalised recommendations`
- Secondary CTA: `Browse verified tools`
- Trust line:
  - `200+ India-ready tools · Verified vendors · Privacy-first`

Right panel (interactive)
- “What are you looking for?” quick links:
  - HRMS
  - Payroll & Compliance
  - Attendance/Leave
  - ATS
  - Performance
- Optional: mini “India-first mode” blurb

### C. How HRSignal helps (3–4 steps)
- Component: `FeatureGrid`
- Items:
  1) Compare tools (filters + compare tray)
  2) Get recommendations (explainable reasons)
  3) Request demo/pricing (single handoff)
  4) Stay in control (privacy-first)

### D. Trust + early access social proof
- Components: `LogoStrip` (professional disclaimer), `TestimonialStrip` (labeled early access feedback)
- Copy:
  - Section title: `Built for India-first SMEs`
  - Subtitle: `Practical, explainable shortlists—built to reduce vendor spam.`

### E. Trending tools (India-first)
- Component: `ToolCard` grid
- Header:
  - Title: `Trending tools`
  - Subtitle: `India-first shortlist by default. Filter and compare in one flow.`
- CTA row:
  - Link: `Browse all tools →` (to `/tools`)

### F. Final CTA band
- Component: `Card` (surface-2)
- Copy:
  - Title: `Ready for a guided shortlist?`
  - Body: `Get explainable recommendations based on company size, modules, integrations, and compliance needs.`
  - Button: `Get personalised recommendations`

---

## 2) Categories (`/categories`)

### A. Page header
- `SectionHeading`
  - Title: `Categories`
  - Subtitle: `Start with the module you need. Each category opens a directory view you can filter and compare.`
- Link CTA: `Browse all tools`

### B. Category cards grid
- Component: `CategoryCard`
- Each card must show:
  - Icon
  - Name
  - 1-line explanation (desc)
  - Tool-count badge (static ok; derived from top-tools map length)
  - “India-ready” badge where applicable
- Interaction:
  - hover raise + border brighten + subtle shadow

### C. Top tools by category
- Layout: vertical sections; each has 3–5 Tool mini cards
- CTA:
  - Browse category
  - Compare top tools (when >=2 tools)

---

## 3) Product Listing (Tools directory) (`/tools`)

### A. Header + search
- Use global header search (avoid duplicate hero search)

### B. Directory header
- `SectionHeading`
  - Title: `Tools`
  - Subtitle: `Filter by module, deployment, company size, compliance needs, and India-first fit.`

### C. Filters sidebar / top panel
- Inputs:
  - India-first mode toggle
  - Search query (`q`)
  - Company size band
  - Deployment
  - Modules/categories
  - Compliance tags
  - Region / multi-state
  - Sort

### D. Results grid
- Cards: `ToolCard`
- Each ToolCard should show:
  - Vendor logo via `VendorLogo`
  - Tool name
  - Vendor name
  - Tagline
  - Badges (Verified, India-ready where relevant)
  - Compare toggle

### E. Empty states
- No results: actionable suggestions + “Clear filters” + link to recommendations

---

## 4) Product Detail (`/tools/[slug]`)

### A. Breadcrumb
- “Back to tools”

### B. Product header block
- Layout: logo + title + vendor + quick actions
- Components:
  - `VendorLogo`
  - `CompareToggle`
  - Primary CTA: `See if this fits my team`
  - Secondary CTA: `Request demo/pricing`

### C. Overview
- Tagline
- Category list
- Key attributes (deployment, pricing notes, compliance tags)

### D. Pricing (if available)
- `Card` list of pricing plans

### E. Lead capture section
- Anchor `#lead`
- Copy:
  - Title: `Request pricing or a demo`
  - Body: `Share requirements once. We’ll route you to the best-fit vendor after review.`

---

## 5) Resources (`/resources` + `/resources/[slug]`)

### A. Resources index
- `SectionHeading`
  - Title: `Resources`
  - Subtitle: `Practical guides for HRMS, payroll & compliance, hiring, and operations in India.`
- Grid of article cards:
  - Title
  - Summary
  - Category chip
  - Tags
  - Reading time
  - Date

### B. Resource detail
- Article header:
  - Title
  - Metadata row (date, reading time, category)
- Body:
  - clean markdown typography
  - bullet lists
  - CTA at end:
    - `Get personalised recommendations`
    - `Compare tools`

---

## Component Props (contracts)

### `CategoryCard`
```ts
{
  slug: "hrms" | "payroll" | "attendance" | "ats" | "performance";
  name: string;
  description: string;
  toolCount?: number;
  indiaReady?: boolean;
}
```

### `ToolCard`
```ts
{
  tool: {
    slug: string;
    name: string;
    vendorName?: string;
    vendorWebsiteUrl?: string;
    vendorSlug?: string;
    categories: string[];
    tagline?: string;
    verified?: boolean;
  };
}
```

### `VendorCard`
```ts
{
  vendor: {
    id: string;
    slug: string;
    name: string;
    websiteUrl: string | null;
    toolsCount: number;
    categories: string[];
    tagline: string | null;
  };
}
```

### `VendorLogo`
```ts
{
  slug: string;
  name: string;
  domain?: string | null;
  size?: number;
  className?: string;
}
```

---

## Notes / Non-goals (for v1)
- Ratings/reviews remain clearly “placeholder” until real review ingestion exists.
- Tool counts per category can be static or derived from seed/DB; do not block launch.
- Vendor logo fetch script should be deterministic; remote fetch may be blocked in some environments—fallback to generated initials should still look premium.
