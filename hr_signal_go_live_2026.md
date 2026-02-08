# HR Signal – Go-Live UI/UX Plan (Early 2026)

The objective of this document is to give your web development team a **final, launch-ready set of UI/UX improvements** for the HR Signal platform. These recommendations incorporate current 2026 design trends—adaptive theming, minimalistic layouts, bento grids, purposeful micro-animations, and accessible typography—to elevate HR Signal to the same standard as premium SaaS platforms.

## 1. Overall Vision & Goals

**Primary goal:** make the landing experience and lead-submission flow feel premium, trustworthy and intuitive. The site should look like it belongs next to the best enterprise SaaS brands (Stripe, G2, Rippling).

Key principles:

- **Clarity & narrative:** Immediately communicate what HR Signal does and why the visitor should care. The hero section should tell a concise story (“Discover the right HR tools for your Indian SME”) and be supported by visuals demonstrating outcomes.
- **Consistency & readability:** Use a limited colour palette with strong contrast ratios. Ensure text and icons meet WCAG 2.2 colour contrast requirements (4.5:1 for body text). Avoid small grey text on dark backgrounds—opt for light backgrounds or tinted containers for readability.
- **Modern bento layout:** Move away from long scrolls into modular “cards” or “bento” sections. Cards should collapse or expand on mobile to reduce scroll fatigue.
- **Human-centred micro-interactions:** Add subtle animations for hover, focus, loading and form submission to guide users and confirm actions.
- **Adaptive theming:** Provide both light and dark modes with a toggle and respect system preference.
- **Performance & sustainability:** Keep interactions under ~200ms, respect reduced-motion preferences, optimise images and enforce Core Web Vitals budgets.

## 2. Home Page Redesign

### 2.1 Hero Section

1. Narrative headline explaining transformation and SME focus  
2. Visual hero image (modern Indian office / HR team) with soft overlay  
3. Dual CTAs:
   - **Get Quick Recommendations** (short quiz)
   - **Get Detailed Comparison** (full flow)
4. Enlarged search bar with placeholder guidance
5. Immediate social proof with real logos (“Trusted by 500+ Indian SMEs”)

### 2.2 Highlights & Value Props

- Frosted cards for Verified listings, Privacy-first, Explainable AI, India-ready
- Bento grid for Categories, Trending Tools, Resources, How it Works, Pricing
- Animated counters for tools, vendors and reviews

### 2.3 Trending Tools & Categories

- Real vendor logos with deterministic fallback:
  local → Clearbit → initials
- Polished cards with logo, description, rating, feature badges
- Category cards with icon, short description and tool count CTA

### 2.4 How-it-Works & Testimonials

- Vertical stepper with scroll-in animation
- Testimonial carousel with Indian SME HR managers

### 2.5 Pricing & FAQ

- Clear pricing cards with GST transparency
- Accessible accordion FAQ with smooth animation

### 2.6 Footer

- Newsletter signup, social links, contact info
- Light/dark mode toggle with consistent contrast

## 3. Vendor & Tool Detail Improvements

### 3.1 Vendor Pages

- Rich header with logo, rating, verified badge
- Tabbed sections: Overview, Features, Pricing, Integrations, Reviews, Compliance
- Sticky action bar: Compare, Request demo, Save

### 3.2 Categories & Tools Listing

- Sticky filters (price, size, compliance)
- Skeleton loaders and infinite scroll
- Comparison tray dock

## 4. Resources & Content Strategy

- Minimum 12 long-form articles (600–1200 words)
- Grid layout with tags, reading time, images
- Article pages with TOC, author info, related tools
- Lead magnets with ethical data usage

## 5. Lead Submission & Forms

- Multi-step wizard with progress indicator
- Inline validation and success feedback
- Clear privacy messaging

## 6. Color Palette & Typography

### Colour Tokens

Primary #6F42C1  
Navy #0D163F  
Teal #27D3BC  
Light Gray #F7F8FC  
Frosted rgba(255,255,255,0.6)  
Dark Charcoal #1A233A  

### Typography

- Headings: Inter Variable / IBM Plex Sans
- Body: 18px base, 1.6 line height
- Mono: JetBrains Mono (limited use)

### Spacing

- 4px base grid
- 24px card padding
- 32px card gaps (16px mobile)

## 7. Animations & Micro-Interactions

- 150–200ms hover/focus transitions
- Scroll-triggered reveals
- Animated form progress
- Smooth theme toggle
- No heavy or continuous animation loops

## 8. Implementation Checklist

1. Remove all PICHS references
2. Canonical logo usage from /public/brand/logo.svg
3. CSS variables for light/dark themes
4. Vendor logo fetch + cache
5. Content enrichment across vendors/tools
6. WCAG 2.2 accessibility audit
7. Performance optimisation (LCP < 2.5s)
8. E2E tests for core flows
9. SME beta feedback loop

## 9. Conclusion

This plan upgrades HR Signal from MVP to a **world-class HR tech discovery platform** with clarity, trust, accessibility and modern SaaS polish.
