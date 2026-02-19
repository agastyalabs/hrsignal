# GO-LIVE BLOCKERS (lane: GO-LIVE)

Scope: audit + go-live polish for **homepage**. This doc lists perceived blockers + the exact file paths to change.

## P0 — Must fix before go-live (conversion + first impression)

1) **Logo size + brand visibility (header)**
- Problem: logo reads small / low presence vs premium hero.
- Fix:
  - `/components/layout/SiteHeader.tsx` — increase rendered logo size and strengthen emerald glow.

2) **Hero alignment + readability + premium “glass” feel**
- Problem: hero shell reads a bit flat; subtext + CTA cluster needs more breathing room; “neural” pattern should be visible in hero (not just body).
- Fix:
  - `/app/page.tsx` — hero container: add richer gradient + neural dot overlay, more generous padding, improve subtext contrast.

3) **Glassmorphic cards + CTAs (frosted / soft glow / hover lift)**
- Problem: cards/CTAs feel more solid/flat than the intended frosted-glass premium look.
- Fix:
  - `/app/globals.css` — introduce glass utilities and update surface tokens for translucency.
  - `/components/ui/Card.tsx` — apply glass utility + keep hover lift.
  - `/components/ui/Button.tsx` — primary CTA: use subtle gradient + stronger glow.
  - `/app/page.tsx` — above-fold email input + CTA: add backdrop blur + refined glow.

4) **Motion polish (subtle fade-ins) without changing content/flow**
- Problem: sections/cards should feel “alive” but not distracting.
- Fix:
  - Already driven by `/components/marketing/MotionSection.tsx` and `/components/ui/Card.tsx` (Framer Motion). Ensure above-fold elements remain crisp.

## P1 — Should fix next (polish + cohesion)

1) **Menu polish / dropdowns feel too flat**
- Fix:
  - `/components/layout/SiteHeader.tsx` — add glass + subtle shadow to dropdown menus; refine spacing.

2) **Card density / vertical rhythm in mid-page sections**
- Fix:
  - `/app/page.tsx` — apply consistent glass + hover to homepage tiles (InfoCard/TrustTile/StepCard, etc.).

3) **Background depth (site-wide)**
- Fix:
  - `/app/globals.css` — fine-tune background gradients + reduce noise on low-end mobile GPUs.

## P2 — Nice-to-have (post go-live)

1) **Unify “glass” styling into shared primitives**
- Fix:
  - Extract reusable `GlassCard` / `GlassPanel` component.
  - Normalize across marketing pages (`/app/**/page.tsx`).

2) **Hero illustration / pattern systematization**
- Fix:
  - Move hero overlays into a shared component used by multiple pages.

3) **A/B test CTA copy + layout**
- Fix:
  - Track CTA variants and run experiments.
