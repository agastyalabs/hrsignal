# HRSignal — UI Decision Redesign Plan (Decision Clarity > G2/SoftwareSuggest/Capterra)

**Role:** Principal Product Designer  
**Target:** https://hrsignal.vercel.app  
**Constraints:**
- **No code changes in this task** (plan only).
- **Preserve existing flows**: Tools → Tool detail → Compare; Vendors → Vendor detail; Categories; Recommend → Results; Lead capture pipeline untouched.
- Product truth sources:
  - `docs/CONTENT_SPEC.md`
  - `docs/VERIFICATION_POLICY.md`
  - `docs/CATEGORY_DECISION_TEMPLATE.md`
  - `docs/categories/payroll_decision.md`

---

## 0) North-star: “Decision clarity engine” (not a directory)

G2/Capterra win with breadth. HRSignal must win with **clarity, evidence, and India-first decision support**.

**What users should be able to do in <5 minutes:**
1) Understand category-specific buying criteria (India-first)
2) Shortlist 3–5 credible options
3) Compare tradeoffs using uniform fields
4) Request pricing/vendor intro without spam

---

## 1) Audit summary (what’s working vs what blocks decision clarity)

### What’s already strong
- Clear positioning pillars on Home: Verified / Explainable / Privacy-first / India-first
- Tools directory has meaningful filter set and a compare flow.
- Resources hub has real content; good for trust.

### Current launch blockers (observed on live)
**P0 — Credibility/content integrity**
- Homepage contains a visible content leak: ` /vendors/vendors/vendors/vendors/vendors/vendors ` (major trust hit).

**P0 — Recommend funnel extraction/legibility**
- `/recommend` content appears extremely thin in text extraction (likely hydration-dependent / not enough accessible content). This breaks “decision funnel” confidence.

**P1 — Verification policy mismatch in Vendors**
- Vendors list shows some vendors as “Verified” with **0 tools**, and/or stale dates (example: Freshteam shows “Verified Last checked: 2018-10-20”). This conflicts with `VERIFICATION_POLICY.md`.

**P1 — Category UX: decision content isn’t anchored to decision docs**
- `/categories/payroll` is headed in the right direction, but the **category decision page template** (intro context, who it’s for, statutory notes, realistic pricing ranges policy, evaluation signals) is not fully reflected.

**P1 — Evidence-first display is inconsistent**
- Trust row exists in cards (Verified / last checked), but sources count and evidence links aren’t consistently surfaced at the moment users make decisions.

---

## 2) Decision UX principles (how we beat G2)

1) **Evidence beats opinions**
   - Every key claim must be either sourced or explicitly `UNKNOWN`.
2) **Comparable fields > prose**
   - Use key-facts rows (label:value), chips, and checklists.
3) **India fit always visible**
   - Data residency, GST invoicing, WhatsApp support, payroll compliance tags: surfaced as quick facts.
4) **Scannable by default**
   - No doc dumps. Progressive disclosure via accordions.
5) **Ranking must be explainable**
   - Default sort “Recommended” must have a “why recommended” tooltip.

---

## 3) Priority roadmap (what to change, where, why)

### P0 — Fix credibility leaks + funnel legibility

#### P0.1 Remove homepage text leak (`/vendors/vendors...`)
- **Where:** Home page, likely a stray string or link rendering.
- **Why:** Immediate “broken site” signal.
- **Likely files/components:**
  - `app/page.tsx`
  - `components/marketing/LogoStrip.tsx` or adjacent trust/vendor strip components
- **Acceptance:** No stray path strings anywhere on Home; QA checklist includes scanning for artifacts.

#### P0.2 Make `/recommend` decision funnel legible without relying on client hydration
- **Where:** `/recommend`
- **Why:** This is the highest conversion flow; it must communicate steps, privacy, and what happens next.
- **Likely files/components:**
  - `app/recommend/page.tsx`
  - `components/recommend/RecommendInner.tsx`
  - `components/ui/Toast.tsx` (error messaging)
- **What to add (UI only, keep endpoints unchanged):**
  - Step labels: Company → Needs → Integrations → Contact
  - Progress indicator (non-blocking)
  - “Privacy-first” reassurance near submit
  - Error copy that uses API messages
- **Acceptance:** `/recommend` shows meaningful content in text extraction; users understand what happens.

---

### P1 — Align listings with Verification Policy (trust consistency)

#### P1.1 Vendor directory must not label “Verified” when policy says it can’t
- **Problem observed:** Verified vendors with **0 tools** and/or stale last checked.
- **Policy truth:** `VERIFICATION_POLICY.md` requires >= 1 published tool and freshness within 90 days.
- **Where:** `/vendors` and vendor cards.
- **Likely files/components:**
  - `app/vendors/page.tsx`
  - `components/catalog/VendorCard.tsx`
  - `components/trust/TrustRatingRow.tsx`
- **UX changes (no flow break):**
  - Introduce visible state: “Partially verified” / “Unverified” for 0-tools or stale vendors.
  - If vendor has 0 tools: label as “Profile only / listing pending” and reduce prominence.
  - If lastCheckedAt > 180 days: force Unverified badge.
- **Acceptance:** Vendor badges on UI match policy definitions.

#### P1.2 Evidence visibility at decision time
- **Where:** Tool cards, vendor cards, tool detail, vendor detail.
- **Why:** Buyers trust “Verified” only if they can see sources count and freshness.
- **Changes:**
  - Cards: Trust row should include badge + last checked + sources count (only when present).
  - Detail pages: Sources accordion becomes a named “Evidence” section, not buried.
- **Likely files/components:**
  - `components/catalog/ToolCard.tsx`
  - `components/catalog/VendorCard.tsx`
  - `app/tools/[slug]/page.tsx`
  - `app/vendors/[slug]/page.tsx`

---

### P1 — Category Decision Pages (turn category pages into decision guides)

#### P1.3 Implement category decision structure per `CATEGORY_DECISION_TEMPLATE.md`
- **Where:** `/categories/[slug]`
- **Why:** Category pages should be “decision pages”, not just top tools.
- **Use as gold standard:** `docs/categories/payroll_decision.md`.
- **What to include on every category page (scannable sections):**
  1) India-specific intro context
  2) Who it’s for (SME/mid/enterprise)
  3) Buying checklist
  4) Statutory/compliance notes (where applicable)
  5) Pricing model patterns + evidence rule (no fake ranges)
  6) Top vendor evaluation signals aligned to verification policy
  7) Common buying mistakes
  8) Internal links: /tools?category=…, /vendors, /compare, /recommend
- **Likely files/components:**
  - `app/categories/[slug]/page.tsx`
  - optional extracted content modules in `lib/categories/*`
- **Acceptance:** Category pages can stand alone as a buying guide + leader shortlist.

#### P1.4 “Common stacks” becomes a decision tool
- **Where:** category pages + home
- **Why:** Buyers rarely buy one module; show typical stacks and integration risks.
- **Changes:**
  - Provide 3–5 stack cards with “Why this stack” and pre-filter links.

---

### P2 — Tools directory clarity upgrades (beat G2 on speed)

#### P2.1 Default sorting = Recommended + explainability tooltip
- **Where:** `/tools`
- **Why:** Sorting must be explainable or it feels arbitrary.
- **Changes:**
  - Default to “Recommended” instead of Name/Recent
  - Tooltip: “Category match + size fit + verification recency + integration match”

#### P2.2 Filter UX: active chips + clear-all + empty-state explanations
- **Where:** `/tools`, `/vendors`, `/categories/[slug]` filters
- **Why:** Reduce cognitive load and dead-ends.
- **Changes:**
  - Always show active filter chips
  - Single click “Clear all”
  - Empty state explains why, suggests relaxing filters

---

## 4) Page-by-page change list (what, where, why)

### Home (`/`)
**Issues:** stray `/vendors/vendors…` leak; vendor logos section copy implies placeholders.

**Changes:**
- Remove leak; make vendor logos section intentional.
- Add one “Decision clarity” block: “Shortlist in 5 minutes” with steps.
- Add “Verified means…” link to methodology/resource.

**Files/components likely:**
- `app/page.tsx`
- `components/marketing/LogoStrip.tsx`

---

### Tools directory (`/tools`)
**Issues:** Dense cards; recommended sorting unclear.

**Changes:**
- Card hierarchy: Tool name + one-line descriptor + trust row + 3 key facts.
- Recommended sort with tooltip.
- Active filter chips; stronger empty state.

**Files/components likely:**
- `app/tools/page.tsx`
- `components/catalog/ToolCard.tsx`
- `components/trust/TrustRatingRow.tsx`

---

### Tool detail (`/tools/[slug]`)
**Issues:** Needs tighter decision structure aligned to `CONTENT_SPEC.md`.

**Changes:**
- Hero: trust row + key facts grid.
- India-first readiness block (GST, data residency, WhatsApp, compliance tags).
- Evidence accordion labeled “Evidence & sources”.
- “Not to be confused with…” for product families.

**Files/components likely:**
- `app/tools/[slug]/page.tsx`
- extracted components: `components/tool/*` (optional)

---

### Vendors directory (`/vendors`)
**Issues:** Verified badge displayed even for 0-tools/stale; policy mismatch.

**Changes:**
- Enforce downgrade rules visually (Partial/Unverified).
- Add “listing pending verification” label for 0 tools.

**Files/components likely:**
- `app/vendors/page.tsx`
- `components/catalog/VendorCard.tsx`

---

### Vendor detail (`/vendors/[slug]`)
**Issues:** Evidence is present but can be made more decision-centric; trust should match policy.

**Changes:**
- Trust row + evidence count near hero.
- India-first readiness fields (GST, residency, WhatsApp, partners) shown as key facts.
- If vendor is profile-only, label clearly.

**Files/components likely:**
- `app/vendors/[slug]/page.tsx`

---

### Categories hub (`/categories`)
**Issues:** Strong start, but top tools repeated; needs better decision orientation.

**Changes:**
- Category cards should link to `/categories/[slug]` decision pages, not just `/tools?category=...`.
- Add “How to choose” blocks aligned to decision docs.

**Files/components likely:**
- `app/categories/page.tsx`

---

### Category decision pages (`/categories/[slug]`)
**Issues:** Needs full template adoption.

**Changes:**
- Implement template sections; remove long paragraphs.
- Leader grid + comparison CTA.
- “Common stacks” plus links.

**Files/components likely:**
- `app/categories/[slug]/page.tsx`

---

### Resources (`/resources` + `/resources/[slug]`)
**What’s good:** content exists.

**Changes:**
- Add crosslinks from category decision pages to the right resource pieces.
- Create a “Methodology / Verified policy” resource page linking from trust badges.

**Files/components likely:**
- `app/resources/*`
- `lib/resources/articles.ts`

---

## 5) Acceptance criteria (measurable)

1) **No credibility leaks** on Home.
2) Vendors marked Verified match `VERIFICATION_POLICY.md` (no 0-tool Verified; freshness rules visible).
3) Users can complete “5 minute shortlist”:
   - Category → Leaders → Compare → Tool detail → Request demo
4) Every Tool/Vendor detail page shows:
   - verification badge
   - last checked date (if available)
   - sources count (if >0)
5) No long text walls; key facts rows and checklists dominate.

---

## 6) Proposed implementation order (safe, flow-preserving)

**Week 1 (must ship):**
1) Home leak fix + trust link
2) `/recommend` legibility fix
3) Vendor policy alignment (badges + downgrade)
4) Category decision template roll-out (start with Payroll)

**Week 2:**
5) Tool detail decision sections per `CONTENT_SPEC.md`
6) Tools directory recommended sorting + tooltip + chips
7) Resources crosslinking and methodology page

---

## 7) Notes on preserving lead flow
All CTAs should continue to route to the existing flows:
- “Get recommendations” → `/recommend`
- “Request demo/pricing” → existing lead form behavior and `/api/leads`

No endpoint or routing changes are needed to deliver the above redesign.
