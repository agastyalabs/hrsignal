# UI Implementation Plan (Next.js App Router)

This document proposes a **trust-forward SaaS marketplace UI** implementation plan using **Next.js (App Router)**, **Tailwind CSS**, and **shadcn/ui**. It is designed to produce a coherent, high-quality foundation quickly, then iterate page-by-page.

---

## 1) Goals & principles (trust-forward)

**Primary UX goal:** reduce buyer/seller uncertainty.

Key principles to encode in the UI system:

- **Credibility by default:** consistent use of verification badges, clear seller identity, and transparent policies.
- **Progressive disclosure:** show essential trust signals up-front; deeper evidence (audit trails, certificates, SLAs) one click away.
- **Predictable interactions:** minimal surprises; consistent patterns for CTAs, dialogs, forms, and loading states.
- **Accessible & calm:** AA contrast, keyboard navigation, focus rings, restrained motion.
- **Fast perception:** skeletons, optimistic UI where safe, stable layouts (no reflow jumps).

Trust signals we should support as first-class UI objects:

- Verification status (KYC/Business verified, domain verified, security review)
- Ratings + review distribution + recency
- “Last active” / response time
- Clear pricing model + what’s included
- Refund / dispute / escrow (even if “coming soon”)
- Security & compliance badges (SOC2, ISO, GDPR), backed by evidence links

---

## 2) Tech choices

### 2.1 Next.js (App Router)

- Use `app/` for routing, layouts, and server components.
- Prefer **Server Components** for data fetching and initial render; use **Client Components** for interactive filters, forms, and stateful widgets.
- Use `next/image`, `next/font`, and streaming where helpful.

Recommended baseline:

- React 19 (as supported by Next version in repo)
- TypeScript strict
- ESLint + Prettier
- `next-themes` for dark mode (optional but common with shadcn)

### 2.2 Tailwind CSS

- Use Tailwind for layout and tokens.
- Define design tokens via CSS variables (shadcn pattern) to support light/dark.
- Keep custom CSS minimal (prefer utility classes + shadcn primitives).

### 2.3 shadcn/ui

- Use **shadcn/ui** for Radix-based accessible primitives.
- Standard set to install early:
  - `button`, `badge`, `card`, `avatar`, `separator`, `tooltip`
  - `dropdown-menu`, `navigation-menu`
  - `dialog`, `sheet`
  - `tabs`, `accordion`
  - `command` (for search)
  - `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`
  - `table`, `pagination`

Rationale: shadcn gives accessible primitives and consistent styling; Tailwind gives speed; we’ll layer marketplace-specific components on top.

### 2.4 Icon set

- `lucide-react` (pairs well with shadcn).

### 2.5 Validation & forms (when needed)

- `react-hook-form` + `zod` + `@hookform/resolvers`.

---

## 3) Information architecture (App Router)

A trust-forward marketplace typically needs these routes (can be phased):

- `/` marketing/landing
- `/marketplace` listings index (search + filters)
- `/marketplace/[slug]` listing detail (trust evidence, pricing, CTA)
- `/vendors/[vendorId]` vendor profile (verification, reviews)
- `/compare` (optional)
- `/account/*` onboarding, settings

App Router structure (proposed):

```
src/
  app/
    (marketing)/
      layout.tsx
      page.tsx
    (app)/
      layout.tsx
      marketplace/
        page.tsx
        [slug]/
          page.tsx
      vendors/
        [vendorId]/
          page.tsx
    api/
      ...
  components/
  lib/
  styles/
```

Use **route groups** `(marketing)` and `(app)` to keep distinct layouts without changing URLs.

---

## 4) Component architecture

### 4.1 Folder structure

Use a 3-layer approach:

1) **`components/ui/`** – generated shadcn components (mostly untouched)
2) **`components/`** – design-system wrappers and composed components (project-owned)
3) **`features/`** – domain-driven components and page sections

Proposed structure:

```
src/
  components/
    ui/                       # shadcn primitives
    layout/
      AppShell.tsx
      Header.tsx
      Footer.tsx
      Container.tsx
    common/
      EmptyState.tsx
      ErrorState.tsx
      Skeletons.tsx
      CopyToClipboardButton.tsx
    trust/
      TrustBadge.tsx
      VerificationPill.tsx
      RatingSummary.tsx
      EvidenceLink.tsx

  features/
    marketplace/
      components/
        MarketplaceFilters.client.tsx
        ListingCard.tsx
        ListingsGrid.tsx
      model/
        filters.ts
      data/
        mock.ts
    listing/
      components/
        ListingHeader.tsx
        PricingBox.tsx
        SellerPanel.tsx
        ReviewHighlights.tsx

  lib/
    cn.ts
    format.ts
    routes.ts
    analytics.ts
    security/
      trustSignals.ts

  styles/
    globals.css
```

Notes:

- Files suffixed `.client.tsx` are explicitly Client Components.
- Keep `features/*/data/mock.ts` for UI scaffolding until APIs are ready.

### 4.2 Trust-forward components (first-class)

Create a small set of reusable components to keep trust consistent:

- `TrustBadge` – badge with icon + label (e.g., “SOC 2”, “GDPR-ready”), supports `variant` and optional `href` to evidence.
- `VerificationPill` – status indicator (Verified / Pending / Unverified) with tooltip describing what it means.
- `RatingSummary` – stars + count + distribution popover.
- `EvidenceLink` – standardized link to documents (PDF, external attestation) with type icon.

These should be used across ListingCard, VendorProfile, and ListingDetail to avoid fragmented trust styling.

---

## 5) Design tokens (Tailwind + CSS variables)

### 5.1 Base tokens (shadcn-compatible)

Adopt shadcn’s CSS-variable token scheme in `globals.css`:

- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--muted`, `--accent`, `--destructive`
- `--border`, `--input`, `--ring`
- `--radius`

### 5.2 Marketplace-specific semantic tokens

Add additional CSS variables for trust-forward UI:

- `--trust` / `--trust-foreground` (used for “Verified”)
- `--warning` / `--warning-foreground` (risk flags)
- `--info` / `--info-foreground` (neutral disclosures)
- `--success` / `--success-foreground`

If we prefer to stay within shadcn defaults, we can map these to `accent`, `muted`, `secondary`, etc., but having explicit semantic tokens makes trust UI consistent.

### 5.3 Tailwind config mapping

In `tailwind.config.ts`, map tokens like:

- `colors.background: "hsl(var(--background))"`
- `colors.primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" }`
- include `trust`, `warning`, `info`, `success` similarly.

### 5.4 Typography & spacing

- Use a neutral, professional font pair (e.g., **Inter** for UI).
- Standard spacing scale (Tailwind defaults) is sufficient; avoid inventing too many custom spacing tokens.
- Define a small set of shadow tokens for cards:
  - `shadow-xs`, `shadow-sm` for “calm” elevation

### 5.5 Component defaults

Document a few default decisions so UI is consistent:

- Buttons: primary for the single “happy path” CTA; secondary/ghost for alternatives.
- Cards: subtle border + shadow; no heavy gradients.
- Focus ring: always visible on keyboard navigation.
- Motion: minimal (150–200ms), respect `prefers-reduced-motion`.

---

## 6) State & data strategy (UI-first)

To ship UI quickly while backend evolves:

- Start with **typed mock data** under `features/*/data/mock.ts`.
- Keep view-model types separate from API DTOs.
- Use `zod` schemas at boundaries (API routes, forms) when integration begins.

Recommended types (minimum):

```ts
export type TrustSignal =
  | { type: "verified"; level: "business" | "kyc" | "domain"; evidenceUrl?: string }
  | { type: "badge"; label: string; evidenceUrl?: string }
  | { type: "metric"; label: string; value: string };

export type ListingSummary = {
  slug: string;
  title: string;
  shortDescription: string;
  priceFrom?: string;
  category: string;
  vendor: { id: string; name: string; logoUrl?: string; verified: boolean };
  rating?: { average: number; count: number };
  trust: TrustSignal[];
};
```

---

## 7) Accessibility & quality gates

Non-negotiables for trust-forward UI:

- Semantic HTML first; Radix components where appropriate.
- Keyboard navigation and visible focus.
- Color contrast meets WCAG AA.
- Empty/loading/error states are explicitly designed.
- Don’t hide essential info behind hover-only interactions.

Suggested checks:

- `eslint-plugin-jsx-a11y` (optional)
- Playwright smoke tests later (out of first PR)

---

## 8) First PR scope (smallest coherent slice)

Objective: create a usable **marketplace listings index** page with trust-forward cards, with a shared layout and design tokens.

### 8.1 Deliverables

**Foundation**

- Next.js App Router scaffolding (if not already)
- Tailwind + shadcn/ui setup
- `globals.css` tokens (light + dark)
- `lib/cn.ts` utility

**Layout**

- `(app)/layout.tsx` with `Header`, `Footer`, `Container`
- Header includes:
  - logo placeholder
  - primary nav (“Marketplace”, “Vendors”)
  - account button (mock)

**Marketplace page** `/marketplace`

- Search input (client) and filter sidebar (client) *UI-only*
- Grid of `ListingCard` built from typed mock data
- Trust signals on card:
  - vendor verification pill
  - rating summary (if present)
  - 2–3 `TrustBadge` items
- Loading/empty state components (even if mocked)

**No backend required**

- Use local mock data; no DB, no auth, no payments.

### 8.2 Acceptance criteria

- Consistent tokens and theme applied to all primitives.
- Listings page is responsive (mobile → desktop).
- Cards show trust signals consistently.
- All interactive elements are keyboard reachable and have focus styles.

### 8.3 What is explicitly out of scope for PR1

- Listing detail page `/marketplace/[slug]`
- Vendor profile pages
- Auth/account flows
- Reviews CRUD, search indexing, payments
- Analytics and experimentation

---

## 9) Follow-up PR sequence (recommended)

1) **PR2:** Listing detail page with evidence sections (security/compliance, pricing breakdown, CTA).
2) **PR3:** Vendor profile page (verification timeline, reviews, response metrics).
3) **PR4:** Account scaffolding + onboarding (collect verification docs).
4) **PR5:** API integration layer + server data fetching patterns.

---

## 10) Implementation notes (opinionated defaults)

- Prefer Server Components for page shells; isolate client logic in small `.client.tsx` components.
- Keep variants small and intentional (avoid “variant explosion”).
- Build “trust UI” components early so every page benefits.

---

## Appendix A: Suggested shadcn setup commands (reference)

(Exact commands depend on repo state; this is illustrative.)

- Initialize shadcn:
  - `npx shadcn@latest init`
- Add components:
  - `npx shadcn@latest add button card badge avatar separator tooltip input dialog dropdown-menu sheet tabs accordion`

---

## Appendix B: Visual hierarchy checklist (trust-forward)

Each marketplace surface should answer quickly:

1) **What is this offering?** (title + short description)
2) **Who sells it?** (vendor identity + verification)
3) **Is it credible?** (ratings + evidence)
4) **What does it cost?** (starting price + pricing model)
5) **What’s the next step?** (CTA)
