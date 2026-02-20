# Live UI/UX gap audit vs new design docs

Date: 2026-02-20  
Scope: `https://hrsignal.vercel.app` compared against:
- `hr_signal_final_prelaunch_UIUX.md`
- `reference/design-reference.html`

## How this audit was performed

- Read the pre-launch checklist and reference HTML structure.
- Ran Playwright checks on live pages: `/`, `/tools`, `/vendors`, `/resources`, `/recommend`.
- Verified key UI/UX markers (branding text, placeholders, vendor logos, compare tray, resource count, section parity with reference design).

## Executive summary

The live site is **close to launch-ready on functional UX basics**, but it is **not yet fully aligned with the new reference design composition**. High-priority items from the checklist (branding consistency, vendor logos, compare tray, resources depth) are mostly implemented on live. The main gap now is **design parity** (missing/different hero-adjacent sections and visual storytelling blocks from the reference HTML), plus a few polish items.

## What is already implemented (good)

1. **Branding uses “HRSignal” on live**
   - Header/footer/title rendering uses HRSignal naming on current live pages.
2. **Vendor logos are rendering from deterministic sources**
   - `/vendor-logos/*.png` are loading on vendor cards.
3. **Resources depth target is met**
   - Live resources index currently exposes **12** article links.
4. **Compare tray exists and appears after selecting tools**
   - Tray appears on `/tools` after selecting compare; includes clear/CTA controls.
5. **Placeholder brand names from old mocks not visible on live**
   - No “Acme”, “Northwind”, or “ZenHR” found in top-level checks.

## Missing / partially implemented vs reference HTML + checklist

## A) Homepage design parity gaps (highest design delta)

The following prominent reference-design sections/text anchors are missing on live homepage:
- “Evidence, not opinions…” block
- “Deep Compliance Audit” card
- “Implementation Predictability” card
- “Start your evaluation today” + “Compare Vendors” CTA block
- “Data-Backed Logic” toggle area

Impact:
- Current homepage communicates value, but misses the full narrative hierarchy and premium section cadence shown in `design-reference.html`.

## B) Visual system parity is partial

- The reference uses highly specific section rhythm/containers and distinctive dark-light alternation for storytelling modules.
- Live implementation has similar tone but not the same composition density and section sequence.

Impact:
- Brand polish is good, but “pixel/story parity” with approved reference is incomplete.

## C) Content model quality checks still needed (process gap)

While resource count is sufficient, pre-launch checklist asks for stronger editorial structure per article (intro/problem framing, structured body, clear conclusion/next steps, CTA, author/date consistency).

Impact:
- SEO and conversion quality may vary article-to-article without an editorial QA pass.

## D) Contrast + typography verification should be closed with formal QA

No severe dark-section contrast issue was detected in sampled live homepage checks. However, checklist asks for WCAG-oriented validation and typography consistency across all pages/components.

Impact:
- Risk of edge-page inconsistency remains unless audited with a formal checklist.

## E) Post-form success journey confirmation

The recommendation flow exists, but confirmation-state UX should be validated end-to-end against checklist language (friendly success + clear next steps + optional CTA into compare/shortlist actions).

Impact:
- Lead experience may end abruptly if confirmation state is generic or inconsistent.

## Implementation plan (prioritized)

## Phase 1 — Close high-visibility design parity (2–4 days)

1. **Homepage section parity sprint**
   - Port/adapt missing reference modules into production homepage:
     - Evidence/story block
     - Deep Compliance Audit card
     - Implementation Predictability card
     - Evaluation CTA block with Compare Vendors entry point
   - Ensure sections use existing token system and responsive behavior.

2. **Interaction parity**
   - Implement/align toggle interaction from reference where meaningful (e.g., Multi-State vs Local Branch context switch).

Deliverable:
- Homepage structurally aligned to reference narrative, with mobile/tablet parity.

## Phase 2 — Editorial + conversion polish (2–3 days)

1. **Resources QA pass (12 articles)**
   - Enforce a common template:
     - intro/problem
     - subheaded body
     - conclusion/next steps
     - subtle CTA
     - author/date normalization

2. **Recommendation flow finish**
   - Confirm post-submit success state includes:
     - confirmation message
     - expected timeline
     - clear next CTA (compare or return to shortlist)

Deliverable:
- Stronger trust/conversion consistency across content and lead funnel.

## Phase 3 — Accessibility + UI consistency hardening (1–2 days)

1. **Contrast audit**
   - Run WCAG contrast checks for text on all major surfaces (normal text >= 4.5:1).

2. **Typography/spacing audit**
   - Verify heading scales, body size/line-height, button sizing/radius consistency.

3. **Navigation state audit**
   - Verify active nav treatment on all top routes and nested routes.

Deliverable:
- Launch-quality consistency and reduced regression risk.

## Phase 4 — Launch QA + sign-off (1 day)

1. Cross-device checks (mobile/tablet/desktop).
2. Screenshot baseline capture for key pages.
3. Final content + UX checklist sign-off.

Deliverable:
- Launch-ready UI/UX acceptance report.

## Suggested acceptance criteria

- Homepage contains all approved reference narrative modules (or explicit approved equivalents).
- No placeholder content/logos anywhere in public routes.
- Resource library >= 12 articles with standardized structure.
- Compare tray + compare journey works from tools/vendors contexts.
- WCAG contrast and typography checks pass for key templates.
- Recommendation submission always lands on a clear confirmation state with next action.
