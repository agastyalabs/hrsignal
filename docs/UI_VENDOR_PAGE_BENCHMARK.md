# HRSignal — Vendor Detail Page Benchmark (Structure + Readability, No Redesign)

Scope:
- Applies to Vendor detail pages: `/vendors/:id`
- Constraint: **same layout + same visual system**; improvements are structural/typographic and about how content is presented.
- Goal: make the vendor page feel like a premium B2B profile (not a generated Word doc) while staying honest about incomplete data.

This benchmark is derived from:
- Current live vendor page content blocks (e.g., Keka vendor page)
- `docs/UI_UX_AUDIT.md` findings (generated-report vibe, info pending, trust methodology)
- `docs/FIGMA_BLUEPRINT.md` (information ladder, contrast ladder, intentional data states)

---

## 1) Section-to-card mapping rules (from markdown headings)

### Core principle
Each top-level section (H2) maps to **one card**. Sub-sections (H3) are **rows inside the card**, not new cards.

This prevents the “too many same-weight boxes” problem and keeps scanability high.

### Canonical heading structure (vendor page)
Use these headings and keep them stable across vendors:

#### H1
- `Vendor Name` (e.g., “Keka”)

#### H2 → Card mapping (exact)
1. `Overview` → **Card: Overview**
2. `Key facts` → **Card: Key facts**
3. `Products / Tools` → **Card: Tools**
4. `Pricing` → **Card: Pricing**
5. `Implementation / onboarding` → **Card: Implementation**
6. `Compliance & security` → **Card: Compliance & security**
7. `Integrations` → **Card: Integrations**
8. `Pros & cons` → **Card: Pros & cons**
9. `Sources & data quality` → **Card: Sources & data quality** (collapsed by default; see section 3)

> Notes:
- If a vendor has no published tools, still render `Products / Tools` with an intentional empty state.
- If compliance is not applicable to that vendor category, keep the card but shrink it to a single “Not applicable” row (do not remove the heading; consistency matters).

### H3 inside each card (row grouping)

**Card: Key facts**
- H3 rows (render as labeled rows):
  - `Deployment`
  - `Categories`
  - `Best for`
  - `India coverage`
  - `States` (only show if known; otherwise move to data gaps)

**Card: Pricing**
- H3 rows:
  - `Pricing model`
  - `Unit` (PEPM / per recruiter/month / one-time / annual) 
  - `Notes` (minimum contracts, implementation fee, add-ons) — keep short

**Card: Implementation**
- H3 rows:
  - `Typical timeline`
  - `What to validate in demo` (compact checklist)

**Card: Compliance & security**
- H3 rows:
  - `Compliance coverage` (tags)
  - `Security notes` (only if verified; otherwise omit)

**Card: Integrations**
- H3 rows:
  - `Common integrations` (chips)
  - `Exports / APIs` (only if known)

**Card: Pros & cons**
- H3 rows:
  - `Pros`
  - `Cons`

**Card: Sources & data quality**
- H3 rows:
  - `Sources checked`
  - `Data gaps`

---

## 2) How to show “Info pending” (minimize; use a compact checklist)

### Goal
Be honest without making the page feel incomplete.

### Rules
1. **Never show “Info pending” as a standalone line item repeatedly.**
   - Repetition creates a “database incomplete” impression.

2. **Replace repeated “Info pending” with ONE compact “Missing info” checklist.**
   - Location: inside the relevant card, at the bottom, visually muted.

3. **Limit to max 3 missing items per card.**
   - If more are missing, move the rest to `Sources & data quality → Data gaps`.

### Compact checklist pattern (recommended)
Use a single line + checklist (within the card):

- `Missing info (we’re verifying): [ ] State coverage  [ ] Pricing unit  [ ] Security docs`

Behavior:
- The checklist is **collapsed into one line** by default.
- Expands on click/accordion if needed, but avoid making it a primary UI element.

### Which fields are allowed to be “pending” at launch
Allowed (common, acceptable):
- Pricing unit / minimum contract
- State coverage
- Detailed security docs

Not allowed (should block “Verified” badge):
- Category/module classification
- Deployment type
- Whether tool exists/published

---

## 3) Where to place “Sources checked” + “Data gaps” (collapsed accordion at bottom)

### Placement rule
- Create a final section: `Sources & data quality`.
- Render it as a **collapsed accordion card at the bottom** of the page.

Why:
- Keeps the main page scannable and premium.
- Preserves transparency for serious buyers.

### Content rules

**Sources checked** (show as bullet list, 3–8 items max)
Include:
- Vendor website
- Pricing page (if exists)
- Product docs/help center (if exists)
- Compliance pages (PF/ESI/PT/TDS claims)
- Integration listings
- Any public review source used for star ratings (must be disclosed)

**Data gaps** (compact, actionable)
Format as:
- `Still verifying:`
  - State coverage for PT/LWF
  - Minimum contract length
  - Implementation fee ranges

### Verification badge dependency
- If `Sources & data quality` exists but is empty, do not show “Verified”.
- “Verified” requires at least:
  - Sources checked list with a timestamp (“Last verified Feb 2026”)
  - No critical gaps for the fields required to classify the listing

---

## 4) Typography rules so it doesn’t look like a Word doc

### Core problem to avoid
A long scroll of same-weight paragraphs + bullets reads like a generated report.

### Rules (structure + emphasis)

1. **Line length (measure)**
- Target 60–80 characters per line for paragraphs.
- Use a max content width container; do not span full desktop width.

2. **Paragraph discipline**
- Keep paragraphs to 1–3 lines.
- If more than 3 lines, split into:
  - 1-line summary
  - then bullets/checklist

3. **Bullets: use “lead phrase + detail”**
- Example:
  - **Data migration:** employee masters, org structure, leave balances
  - **Policy setup:** shifts, leave, payroll cycles, approvals

4. **Emphasis restraint**
- Bold only:
  - lead phrases in bullets
  - key values (pricing model/unit)
- Do not bold:
  - entire sentences
  - multiple adjacent labels (creates visual shouting)

5. **Row-based facts over prose**
- Key facts must be rendered as labeled rows, not a paragraph:
  - Deployment: Cloud / SaaS
  - Integrations: Google Workspace, Tally, Zoho Books

6. **Tag/chip limits**
- Show up to 6 tags per row; the rest behind “+N more”.
- Too many chips = noise.

7. **Section header prominence without size inflation**
- H2: consistent, not oversized.
- H3: used as row group titles inside cards; keep compact.
- Use spacing (not font size) to signal section boundaries.

---

## 5) URL/slug clarity rules (Freshteam vs Freshdesk)

### Problem
In SaaS directories, brand families create confusion (Freshworks: Freshteam vs Freshdesk; Zoho: People vs Recruit; etc.). Incorrect slugs destroy trust and SEO.

### Canonical naming rules
1. **Display name must match the product, not just the vendor family.**
   - “Freshteam (Freshworks)” is acceptable if Freshworks is the vendor and Freshteam is the product.

2. **Slug must be product-specific and collision-resistant.**
   - Use product slug (not vendor slug) when ambiguity exists.
   - Example:
     - `/tools/freshteam` not `/tools/freshworks`
     - `/tools/freshdesk` (separate product, separate category)

3. **Vendor page URL is vendor-id based; still enforce product clarity in tool listings.**
   - Vendor: `/vendors/<id>`
   - Tools list on vendor page must show tool names that disambiguate.

### Disambiguation requirements (when products share a brand)
If vendor has multiple named products:
- In `Tools` card list, show:
  - `Product name` (primary)
  - `by Vendor` (secondary)
  - 1-line descriptor that clarifies category (e.g., “Recruitment / ATS”)

### “Wrong-product” guardrail
For any product with a known name collision risk:
- Add a small row under the tool name on detail pages:
  - `Not to be confused with: <other product>`
- Keep it muted; it’s a trust-protection, not marketing.

---

## Quick acceptance checklist (vendor page is benchmark-compliant)

- [ ] Each H2 maps to exactly one card.
- [ ] Key facts are rows, not paragraphs.
- [ ] “Info pending” appears at most once per card as a compact checklist.
- [ ] “Sources & data quality” exists as collapsed accordion at bottom.
- [ ] Verified badge is backed by sources + last verified timestamp.
- [ ] Slugs and names disambiguate brand-family products.
- [ ] No section reads like a long Word doc paragraph.
