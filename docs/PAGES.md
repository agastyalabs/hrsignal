# HRSignal Pages & Routes

This doc defines **intended** user-facing routes and what each page must contain (IA + key sections). It is design/UX-driven; implementation can map legacy routes (e.g. current `/stack-builder`) to new ones.

> Note: Current repo already has `/`, `/tools`, `/tools/[slug]`, `/vendors`, `/vendors/[id]`, `/results/[id]`, `/stack-builder`, and `/admin/*` (internal). This spec introduces `/recommend`, `/compare`, `/pricing`, `/about`, `/contact`.

---

## Public routes

### `/` — Home (category-led marketplace entry)
**Purpose:** Fast discovery + trust + conversion to browse or get recommendations.

**Key sections:**
1. Sticky header (nav + primary CTA)
2. Hero (headline + subhead)
3. Hero search module + popular category chips
4. Trust strip (verification, privacy, methodology)
5. Category cards grid (6–8)
6. Trending / recently verified tools (tool card grid)
7. “How HRSignal helps” (3-step explainer)
8. Social proof (logo strip + 1–3 testimonials)
9. Final CTA band
10. Footer (legal + contact)

---

### `/tools` — Tools directory (browse + filters)
**Purpose:** Category-led browsing with strong filtering and sorting.

**Key sections:**
1. Page header (title + short helper text)
2. Search + category selector
3. Filter sidebar (desktop) / filter drawer (mobile)
4. Sort control (e.g., relevance, recently verified)
5. Results grid of ToolCards
6. Pagination / infinite scroll (choose one)
7. Trust module (small, below results)

**Filters (minimum viable):** Category, Company size, Deployment (Cloud/On-prem), Pricing model, Integrations (chips).

---

### `/tools/[slug]` — Tool detail
**Purpose:** Convert: help users decide quickly, then take action (demo, pricing, compare).

**Key sections:**
1. Summary header: logo, name, vendor, verified badge, quick highlights
2. Primary CTA (request demo/get pricing) + secondary (compare)
3. Trust row: verification + last verified date + transparency note
4. “Best for” / “Use cases”
5. Key features (bulleted, scannable)
6. Pricing overview (ranges/tiers when available; no fake precision)
7. Screenshots/gallery (lightweight)
8. Integrations
9. Pros/cons or “What to know” (neutral tone)
10. Alternatives (3–6 ToolCards)
11. FAQ
12. Lead capture module (privacy-first)

---

### `/recommend` — Recommendation wizard (guided intake)
**Purpose:** Collect requirements and return a shortlist (and optionally create a lead).

**Key sections:**
1. Wizard header: step indicator + reassurance (privacy)
2. Step flow (example):
   - Category selection
   - Company size + industry
   - Must-have features
   - Budget range
   - Deployment preference
   - Contact details (last step)
3. Summary sidebar (desktop) / review step (mobile)
4. Completion: redirect to results page

**Implementation note:** Current route `/stack-builder` can be renamed or redirected to `/recommend`.

---

### `/results/[id]` — Recommendation results
**Purpose:** Present shortlist with clear rationale + next actions.

**Key sections:**
1. Results header: “Top matches” + criteria summary chips
2. Shortlist grid (3–6 ToolCards) with “Why this matches” bullets
3. Compare CTA (build shortlist)
4. Trust module (how recommendations are generated)
5. Secondary: “Adjust answers” link back to wizard

---

### `/compare` — Compare tools
**Purpose:** Side-by-side evaluation with sticky comparison table.

**Key sections:**
1. Compare header: selected tools (remove/add)
2. Summary row: pricing model, best-for, deployment
3. Comparison sections (collapsible):
   - Core HR/payroll
   - Attendance/leave
   - Integrations
   - Security/compliance
   - Support/implementation
4. CTA: “Request demos” / “Get pricing” (single consolidated)

**Empty state:** If no tools selected, prompt user to browse tools.

---

### `/pricing` — HRSignal pricing / how we work
**Purpose:** Explain model, what’s free, what’s paid (if applicable), and set expectations.

**Key sections:**
1. Simple pricing cards (if applicable) OR “Free for buyers” explainer
2. What’s included (verification, shortlisting, concierge)
3. FAQ: privacy, data usage, vendor relationships
4. CTA: Get recommendations

---

### `/about` — About HRSignal
**Purpose:** Build trust and explain methodology.

**Key sections:**
1. Mission + who it’s for (India-first SME)
2. How we verify listings
3. Editorial independence / transparency
4. Team/company info (lightweight)
5. CTA: browse tools / recommend

---

### `/contact` — Contact
**Purpose:** Provide ways to reach HRSignal; collect inbound queries.

**Key sections:**
1. Contact form (topic select)
2. Email + response-time expectations
3. Optional: office location / business hours
4. Privacy note

---

## Admin routes (later / internal)

### `/admin` — Admin home
**Purpose:** Internal management (vendors, tools, leads).

**Key sections:**
- Overview + quick links
- Access control

> Admin UX can reuse the same design tokens but can be simpler; keep typography/spacing consistent.
