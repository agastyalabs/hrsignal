# Steve Jobs Level Aesthetics — HRSignal (Visual-Only)

Date: 2026-02-19
Branch: dev
Scope: Visual-only. **Preserve all existing content + flow exactly**. Do not touch `/api/leads`.

## Audit (current homepage vs “premium polished” target)
Note: No mockup asset was available in-repo at implementation time; audit is based on current code + the provided target descriptors.

### What’s already strong
- Dark premium base with neural-dot background + hero gradients.
- Glass surfaces (`u-glass`, `u-glass-strong`) and hover lift (`u-card-hover`).
- Inter is configured via `next/font` and used as a CSS variable.
- Framer Motion is present and already used in `Card` for in-view fade-ins.

### Gaps vs target
- Hero animation hierarchy isn’t consistently applied to the hero label / H1 / body / CTAs / right-side snapshot (some sections feel “static”).
- Above-fold elements don’t share a single, consistent glass + glow language (some are bespoke). 
- Logo glow is present, but “obsessive premium” calls for a slightly more deliberate, softer halo and (optionally) a marginal size bump without increasing visual noise.

## Prioritized checklist

### P0 (ship now — minimal risk)
1. **Hero motion polish:** Add subtle Framer fade-ins to hero label, headline, subcopy, CTAs, and decision snapshot card (respect reduced motion).
2. **Hero backdrop polish:** Soften gradients + neural overlay intensity (keep same structure, just refine values).
3. **CTA + card consistency:** Ensure above-fold glass/CTA elements share consistent hover lift + soft glow.

### P1 (next)
1. Introduce a reusable “HeroSurface” component to standardize hero background + pattern across marketing pages.
2. Typography rhythm: tune line-height/letter-spacing for H1/H2 and section intros for a more “Apple-like” cadence.
3. Section-to-section spacing: normalize vertical whitespace so the page breathes more.

### P2 (later)
1. Micro-interactions: slightly improved hover/press states for primary/secondary CTAs (including active/disabled states).
2. Subtle parallax / gradient drift (only if it doesn’t hurt performance).
3. Dark-mode contrast pass for long-form pages (resources/methodology) to reduce eye fatigue.
