# HR Signal — Launch-Ready UI/UX + Catalog Upgrade (Agent Instructions)

## Goal

Make **HRSignal** feel like a world-class comparison product (G2 / SoftwareSuggest level polish) **and** make the catalog **India-first and credible** (real India-registered vendors, consistent metadata, realistic pricing patterns, strong search + comparison flows).

## 1) Must-fix bugs (P0)

### 1.1 Active nav state (your reported bug)

**Problem:** When a user is on `/tools`, the Tools nav item is not highlighted (same for Vendors/Categories/Resources).

**Fix:** route-match + active class.

- Next.js App Router: use `usePathname()`.
- Mark active if `pathname === '/tools'` or `pathname.startsWith('/tools')`.
- Add `aria-current="page"` to active link.
- Add visible indicator: underline + color + icon fill.

**Acceptance:** On every route, the correct nav item is active on desktop + mobile.

### 1.2 Categories link currently redirects to Tools

From crawl: `/categories` is redirecting to `/tools`.

**Fix:** implement a real `/categories` page with:
- category cards
- top tools per category
- a “Compare top tools” CTA

### 1.3 Get recommendations page must server-render content

`/recommend` appears to render empty in non-JS crawls. Ensure it renders meaningful HTML server-side.

**Fix:**
- Use server components for the frame.
- Ensure form steps render without client hydration.

## 2) IA + UX upgrades (P0/P1)

### 2.1 Add a real comparison workflow (core differentiator)

**Currently:** “Compare” exists on cards but the experience must be end-to-end.

Build:
- Sticky “Comparison tray” (bottom) when 1+ items selected.
- Compare page: `/compare?tools=a,b,c` with:
  - sticky headers
  - sectioned rows (Pricing, Core features, India compliance, Integrations, Support, Deployment)
  - “Show only differences” toggle
  - export/share (copy link)

**Rules:** max 4 items on mobile, 5 on desktop.

### 2.2 Filters that matter for India

On `/tools` add real filters (not “coming soon”):
- Company size (1–50, 51–200, 201–1000, 1000+)
- Deployment (Cloud, On-prem, Hybrid)
- Modules (Payroll, HRMS, Attendance, ATS, Performance, LMS, BGV)
- India compliance tags (PF, ESI, PT, LWF, TDS, Form 16/24Q)
- Region fit (multi-state)

### 2.3 Search UX

Upgrade search to a “command palette” feel:
- Typeahead grouped by Tools / Vendors / Categories
- Keyboard nav (↑ ↓ Enter)
- Recent searches + popular queries
- When no results: show 3 suggestions + top categories

## 3) Visual design upgrades (P1)

### 3.1 Add tasteful background/illustration (where it helps)

Add subtle background visuals (not heavy):
- Hero: soft gradient + abstract shapes (India-friendly, enterprise clean)
- Section dividers: faint grid/noise
- Comparison page: slightly tinted header band for readability

**Rule:** keep page weight low (no huge images). Use SVG or compressed WebP.

### 3.2 Design system polish

- Unify spacing: 8pt grid, consistent section paddings.
- Elevation: cards use 1 shadow token only + hover lift.
- Typography: 1 display size, 1 H2 size, body + muted.
- Buttons: consistent heights, icon + text alignment.

### 3.3 Micro-interactions

- Nav hover/focus, button press states, card hover, compare tray slide-in.
- Skeleton loaders for lists.
- Respect `prefers-reduced-motion`.

## 4) Catalog: India-registered vendors only (P0 for “ready to launch”)

### 4.1 Add “India-first mode” toggle

Default ON for India audience.

When ON, include only vendors where `registered_country = 'IN'` and `verified_in_india = true`.

### 4.2 Required fields for every tool

Each tool must have:
- `name`, `vendor_name`, `vendor_website`
- `short_description` (140–180 chars)
- `categories[]`, `modules[]`
- `india_fit_tags[]` (PF/ESI/PT/TDS/LWF etc as applicable)
- `pricing_model` (Per employee/month, Per user/month, Quote-based, Free tier)
- `starting_price_inr` (optional; else null)
- `support_channels[]`
- `integrations[]` (top 5)
- `deployment` (cloud/onprem/hybrid)
- `last_verified_at`
- `evidence_urls[]` (at least 1 source: pricing page or product page)

**Important:** stop showing global/non-India tools in “Trending tools”.

### 4.3 Build 30 vendors per category (India-registered)

Categories to populate (minimum):
- Core HRMS
- Payroll + Compliance
- Attendance / Leave / Time
- ATS / Hiring
- Performance / OKR
- LMS / Training
- Background Verification (BGV)

Implementation approach (required):
1. Create `vendors_seed.json` and `tools_seed.json`.
2. Add a script: `pnpm catalog:verify` that checks each vendor has an India address OR India entity proof.
3. Store proof in `evidence_urls[]`.
4. Manual review checklist (must pass): homepage, pricing page, terms page, India office/contact.

Use these sources as *starting points* for seed discovery:
- PocketHRMS “top HRMS in India” list
- FactoHR “HR software for startups” list
- Pazcare “top HRMS solutions in India” list

(Agent: research and add more; ensure India registration evidence.)

## 5) Lead submission: end-to-end QA (P0)

### 5.1 Flow

On “Get recommendations” / “Request demo/pricing”:
- Multi-step form: Company size → Modules → Must-have compliance → Integrations → Contact details.
- Show progress bar.
- After submit: success screen + “what happens next” timeline.

### 5.2 Validation

- Phone: India format + OTP optional later.
- Email: strict validation.
- Consent checkbox required.

### 5.3 E2E test automation

Add Playwright tests:
- Visit home → click Get recommendations → fill dummy data → submit → assert success.
- Visit tools → select compare items → open compare page.

Run on CI.

## 6) Content upgrades (P1)

### 6.1 Product page template

Upgrade `/tools/[slug]`:
- Hero: logo + rating + pricing badge + last verified
- “Best for” + “Not ideal for”
- Feature bullets grouped
- Integrations chips
- Compliance section (PF/ESI/PT/TDS etc)
- Pricing section (patterns + example ranges; avoid false precision)
- Alternatives (same category)
- CTA: Request demo/pricing

### 6.2 Vendor pages

`/vendors` must list vendors, each with:
- vendor logo
- “Products on HRSignal” count
- HQ city + India presence
- categories served

## 7) SEO + trust (P1)

- Structured data for SoftwareApplication + AggregateRating (only if real).
- Add “Methodology” page: how listings are verified, how recommendations work.
- Add “Verified” definition: what it means + recency.

## 8) Brand: logo (create + implement)

Create a simple modern logo:
- Wordmark: “HRSignal”
- Mark: minimal signal bars forming an “H” or pulse line
- Colors: keep current primary; ensure works in mono

Deliverables:
- `logo.svg` (primary)
- `logo-mark.svg` (icon)
- `favicon` set

## 9) Release plan

- PR1: Fix nav active state + categories page + /recommend SSR.
- PR2: Compare tray + compare page.
- PR3: India filters + India-only mode.
- PR4: Catalog expansion scripts + initial 30/category.
- PR5: Product page template + vendor page upgrades.
- PR6: Visual polish + backgrounds + micro-interactions.

---

## Quick notes from crawl

- Home page content is strong and structured.
- Tools directory currently includes many global tools; for “India-first” positioning, remove them from default views.
- `/categories` redirect needs fixing.


---

## Appendix A — India-first seed catalog (candidates; verify with evidence URLs)

**Important:** These are *seed candidates* to reach ~30 per category quickly. Before publishing, add `evidence_urls[]` proving an India entity/presence.

### Core HRMS (seed 30)
Zoho People, Keka, greytHR, Darwinbox, PeopleStrong, HROne, Pocket HRMS, factoHR, Zimyo, Qandle, Kredily, ZingHR, sumHR, HRMantra, Beehive HRMS, Spine HR Suite, empxtrack, peopleHum, HReasily, OpportuneHR, HROne (SME/Enterprise variants), Freshteam (Freshworks), SutiHR, CrazeHQ, KredX HR (if applicable), ubiHRM, Zeta HRMS, Hive HR (India entity), Zenefits India partner (skip if not India entity), Securtime HRMS, Orangescrum HR (skip if not India).

### Payroll + Compliance (seed 30)
Zoho Payroll, RazorpayX Payroll, greytHR Payroll, Keka Payroll, Pocket HRMS Payroll, factoHR Payroll, Zimyo Payroll, Qandle Payroll, HROne Payroll, HRMantra Payroll, PeopleStrong Payroll, SumHR Payroll, Kredily Payroll, ZingHR Payroll, SalaryBox, Hono Payroll, Saral PayPack, Tally Payroll (TallyPrime payroll), Marg Payroll, Spine Payroll, Paybooks, Keka (multi-state PT), EasyHR Payroll, Superworks Payroll, Keka/Zoho integration bundles, Vyapar Payroll (if exists), Keka + RazorpayX, Paywheel (India), QwikHR Payroll, HROne Pay, Keka Flexi.

### Attendance / Leave / Time (seed 30)
Keka Attendance, greytHR Attendance, Zoho People Attendance, Pocket HRMS Attendance, factoHR Attendance, Zimyo Attendance, Kredily Attendance, Qandle Attendance, ZingHR Attendance, HROne Attendance, PeopleStrong Time, Securtime, Superworks (SuperHRMS Attendance), Hono Attendance, Timelog (India), ubiAttendance, Pocket HRMS ESS, AttendanceBot India, SalaryBox Attendance, OnTime HR, OpportuneHR Attendance, sumHR Attendance, Darwinbox Time, Timelabs, EasyTimeTrack, InTimeTec, Fieldproxy Attendance, Hipla Attendance, Attendance by Saral, PyTorch Time (skip), Timetrack by Keka.

### ATS / Hiring (seed 30)
Zoho Recruit, Freshteam, Darwinbox Recruiting, PeopleStrong Recruitment, Keka Hiring, ZingHR Recruiting, HRMantra Recruitment, iSmartRecruit, Recruit CRM, Talentpool (ex Recruiterbox), TurboHire, myHR (recruit), Cutshort, iimjobs Recruiter tools, Naukri RMS, Shine Recruiter, Instahyre, Recooty, Talview, Interview Mocha, HackerEarth Assessments (hiring), Mercer | Mettl, Superset (campus hiring), HirePro, Belong (if India entity), EasySource, PitchHire, HireXP, 99jobs, Juggl (skip).

### Performance / OKR + Engagement (seed 30)
Darwinbox Performance, PeopleStrong Performance, Keka Performance, Synergita, SuperBeings, CultureMonkey, Vantage Circle, SurveySparrow, Zimyo Performance, HROne Performance, Qandle Performance, ZingHR Performance, HRMantra Performance, Pocket HRMS Performance, factoHR Performance, peopleHum Performance, EngageWith (India), Trakstar India partner (skip), Betterworks India partner (skip), Empuls (by Xoxoday), Leapsome India partner (skip), TeamNest, Workmate OKR, OKR Stars India (verify), Gtmhub India partner (skip), Mesh.ai (performance), ThriveSparrow (verify), Feedbackly, Engagedly (India office; verify), Keka OKR.

### LMS / Training (seed 30)
Disprz, upGrad for Business, Skillsoft India (verify entity), Coursera for Business India (global; exclude in India-only), Udemy Business India (global; exclude), Great Learning for Business, Simplilearn for Business, Edmingle, Teachmint for Business, Coassemble India (verify), TalenTeam LMS, MindTickle India (verify), Hurix Digital, UpsideLMS (by Invince), Paradiso LMS India (verify), ILT India LMS (verify), Meritto LMS (verify), EpsilonAI LMS (verify), LMS by Zoho (Zoho Learn), Learntron, WizIQ, TalentLMS India (global), LearnUpon India (global), Moodle Partner India list (pick partners), Adobe Learning Manager India (global), SAP SuccessFactors Learning India (global), Docebo India (global), Tesseract Learning, G-Cube Webwide, NIIT Learning.

### Background Verification (BGV) (seed 30)
AuthBridge, OnGrid, IDfy, SpringVerify, BetterPlace, HireSure.ai (verify), KPMG India BGV (services), EY India BGV (services), Firstsource BGV (India), Workforce Background Checks (verify), Kettle BGV (verify), Mverification (verify), Kratikal BGV (verify), eLockr BGV (verify), Signzy (KYC + verify), Karza Technologies (verify), CAMS KRA (verification), Digio (KYC), HyperVerge (KYC), Bureau ID (verify), JARVIS BGV (verify), Matrix BGV (verify), VFS Global verification (global), Quinfy (verify), TrackWizz (verify), Probus (verify), PoshVine (verify), Securitas BGV (verify), Protiviti India (services), ...
