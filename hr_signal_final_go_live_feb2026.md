# HR Signal – Final Go-Live UI/UX Plan (February 2026)

*This document summarizes final UI/UX enhancements for **HR Signal** as you prepare for a public launch.  It builds on previous recommendations and reflects 2026 design trends, accessibility standards and specific feedback after inspecting the live site.*

## 1. Overall Vision & Goals

- **Professional & trustworthy:** The site should convey the calibre of leading SaaS comparison platforms such as G2, Stripe and Notion—clean, intuitive and enterprise-grade.  Use storytelling and micro-interactions to build trust without feeling gimmicky. 
- **Clear narrative:** Your hero section must tell a concise story: *“Find the right HR tools for your Indian SME with explainable match reasons.”*  Focus on solving the visitor’s problem and guide them to act.
- **Accessible & consistent:** Adopt a cohesive colour palette and typography system.  Ensure text and UI elements meet WCAG 2.2 contrast requirements (4.5:1 for body text).  Avoid pure black backgrounds; use tinted dark panels or frosted glass to improve readability and depth.
- **Modular bento layout:** Break long scrolling sections into card-based “bento” grids—compact blocks of information that can collapse/expand on mobile.  These bite-sized sections improve scannability and align with 2026 design trends.
- **Human-centred micro-interactions:** Introduce subtle animations for button hover states, form validation, progress steps and tool comparisons.  Research shows micro-interactions can increase time on site and click-through rates.
- **Performance & sustainability:** Optimise images, compress assets, lazy-load below-the-fold content and adhere to Core Web Vitals (under 200 ms interactivity).  Provide dark and light modes but keep dark mode the default, using a dark navy rather than black for comfort.

## 2. Theming & Colour System

- **Primary palette:**

  | Token             | HEX       | Usage |
  |-------------------|-----------|-------------------------------------------|
  | Primary Purple    | `#6F42C1` | Buttons, highlights, verified badges      |
  | Dark Navy         | `#0D163F` | Default dark background (toned down black) |
  | Teal Accent       | `#27D3BC` | Icons, charts, micro-interaction accents  |
  | Light Indigo      | `#394179` | Card backgrounds / tinted containers      |
  | Frosted White     | `rgba(255,255,255,0.6)` | Frosted glass panels          |
  | Pale Lavender     | `#F5F1FA` | Light mode backgrounds                   |

- **Theme behaviour:**  Dark mode should be the default but not fully black.  Use the Dark Navy background with Light Indigo cards to separate sections.  Provide a **theme toggle** in the header; remove the redundant “Theme Light” label once the toggle is implemented.
- **Contrast guidance:** Ensure text on coloured backgrounds maintains a minimum contrast ratio of 4.5:1.  Use tinted panels or lighten text when necessary.  Avoid bright purple on dark navy for small body text; use off-white.

## 3. Homepage Redesign

### 3.1 Hero Section

1. **Narrative headline:** Replace “Stop guessing HR software” with a story-driven headline describing the transformation—e.g., *“Discover the right HR tools for your Indian SME. Get explainable recommendations.”*  The subheading should emphasise privacy, explainable matches and India-ready compliance.

2. **Visual composition:** Place a high-quality HR-themed illustration or photograph on the right side of the hero.  Use your paid image API to fetch an image depicting HR managers collaborating in an office or reviewing payroll compliance.  Apply a soft overlay gradient so the illustration doesn’t distract from the headline and call-to-action.

3. **Call-to-action buttons:** Provide two clearly differentiated CTAs:
   - **“Start quick”** – leads to a fast 2-3 minute quiz (labelled “Quick”).
   - **“Get detailed match”** – leads to the full questionnaire for 6-10 minutes (labelled “Detailed”).  Use micro-interactions like progress bars and button loading states.

4. **Search bar & tags:** Keep a single search bar under the hero navigation.  Remove duplicate search fields in lower sections.  Add popular tag pills (Core HR, Payroll & Compliance, etc.) underneath that slide horizontally on mobile and reveal more categories upon scroll.

5. **Hero badges:** Summarise trust signals in a single row below the hero—e.g., “200+ listings”, “Explainable matches”, “India-ready compliance”, “Privacy-first”.  Use icons and tooltips to explain each.

### 3.2 Highlights & Value Propositions

- **Bento feature grid:** Replace the current long columns with a modular grid of cards highlighting key benefits: Verified listings, Explainable recommendations, Privacy-first, India-first fit, Fast onboarding, etc.  Each card should have an icon, a short headline and one-line description.
- **Popular vendors:** Display a carousel or grid of vendor logos.  Fetch logos programmatically (e.g., using the Clearbit Logo API) and cache them locally.  Provide alt text for accessibility and link each logo to its vendor page.

### 3.3 Category Section

- Use a bento grid of category cards with custom icons (Payroll, Compliance, Attendance, ATS/Hiring, Performance).  Each card should have an “Explore” link that navigates to a dedicated category page listing relevant tools.
- Include an “India-ready” tag on cards that meet PF/ESI/PT/TDS compliance.  Use light teal chips for tags to maintain contrast.

### 3.4 Trending Tools & Vendor Section

- **Card redesign:** Each tool card should display the vendor logo (fetched via Clearbit/local cache) instead of a coloured initial.  Include star rating, number of reviews, short description, key modules (as chips) and badges for Verified & India-ready.
- **Compare & Demo CTA:** Provide separate buttons: *Compare* (adds to comparison tray) and *Request demo via HR Signal* (opens lead form).  Use subtle hover effects.
- **Micro-interaction:** On hover, lift the card slightly (3–5 px) and reveal an expanded feature list.  On click, open a modal with a deeper summary or navigate to the tool detail page.

### 3.5 How HR Signal Helps

- Present this section as a four-step horizontal or vertical timeline with icons: **Pick a category → Get recommendations → Request demos/quotes → Stay in control**.  Use vertical connectors on mobile.  Provide micro-animations when users scroll into view.

### 3.6 Testimonials & Social Proof

- Add at least three authentic testimonials from HR managers or founders.  Include names, titles and company logos to increase credibility.  Use card styling consistent with the rest of the site.  If actual testimonials aren’t available, create placeholders and plan to gather quotes.

### 3.7 Pricing & Plans

- Simplify the pricing cards with a consistent height.  Use dark navy backgrounds with clear headings, bullet lists and CTA buttons.  Distinguish between **Starter** (free), **Teams** (paid PEPM with customised compliance filters) and **Enterprise** (custom pricing for multi-entity or on-prem deployments).  Clarify that Teams pricing is per employee per month and includes vendor screening; Enterprise pricing is one-time or annual.

### 3.8 FAQs & Footer

- Expand the FAQ section to answer common buyer concerns (data security, integration support, vendor neutrality, etc.).  Use an accordion pattern for readability and micro-animations.
- The footer should include a concise description of HR Signal, navigation links, resource links and contact information.  Include social media icons if relevant and ensure the dark background is slightly lighter than the main page to delineate the footer.

## 4. Search, Filters & Recommendation Flow

- **Unify search:** Provide a single predictive search bar in the header with auto-complete suggestions (vendors, tools, categories).  Remove duplicate search fields below.  Ensure the search results page clearly differentiates between tool results, category results and vendor pages.

- **Refine filters:** Replace the current “20-200, 50-500” company-size filters with logical categories like **1–25 employees (micro)**, **26–100 (small)**, **101–500 (medium)**, **501–1 000 (large)**, **1 000+ (enterprise)**.  Display the number of matching tools next to each.

- **Budget filters:** Add a toggle for **Cloud** (per-employee per-month) vs. **On-prem** (one-time licence).  Provide ranges (e.g., **₹50–₹250 PEPM**, **₹251–₹500 PEPM**, **₹501+ PEPM**; and **₹1–₹5 Lakh**, **₹5–₹10 Lakh** for on-prem).  Explain that pricing is approximate and subject to vendor quotes.

- **Industry/vertical filters:** Offer optional filters for industries (IT/Start-ups, Manufacturing, Healthcare, Retail, Education) so SMEs can find HR tools tailored to their sector.

- **Compliance filters:** Include PF/ESI/PT/TDS readiness toggles and state coverage (Pan-India, Single state, Multi-state).  Provide checkboxes for additional modules such as Payroll & Compliance, Attendance, LMS, BGV, Performance, OKR.

- **Recommendation flow:**
  1. **Quick quiz:** Collect basic info—company size, modules needed, budget range, integrator requirements—and instantly display 3–5 recommended tools with match scores.
  2. **Detailed quiz:** Add deeper questions on integrations (Tally, Zoho Books, SAP), deployment (cloud vs. on-prem), payroll cycles, statutory needs, etc.  Show progress steps and save partial progress (session storage).  At the end, present a ranked shortlist with reasons for each match.
  3. **Lead form:** Provide a multi-step lead form that appears after the shortlist.  Group fields into digestible steps (Name/Company, Email/Phone, Note).  Use inline validation and a success message confirming that the team will route them to one vendor only (privacy-first).  Make the form accessible and mobile-friendly.

## 5. Vendor & Tool Detail Pages

- **Header:** Display the vendor logo, tool name, rating and a tagline.  Add breadcrumbs to navigate back to categories or search results.
- **Overview & Specs:** Use a two-column layout: summary description, modules supported, deployment options, pricing information (PEPM vs. on-prem), and implementation time.  Provide icons for modules and tags for “Verified”, “India-ready” and “AI-recommended”.
- **Feature breakdown:** Present features in collapsible sections (Core HR, Payroll & Compliance, Attendance, LMS, BGV, Performance).  Use toggle chips for cross-comparison.
- **Screenshots & demos:** Integrate vendor-provided screenshots or short videos to help users visualise the tool.  Use modals or carousels to avoid clutter.
- **Integrations & compliance:** List supported integrations (Tally, Zoho Books, QuickBooks, SAP) and compliance certifications (PF/ESI/PT/TDS).  Provide evidence links or documentation.
- **Comparisons:** Allow visitors to add the tool to a comparison tray to compare side-by-side with other tools.  The comparison page should show features, modules, pricing ranges and match scores.

## 6. Resources & Free Tools

- **Content hub:** Expand the Resources page into a content library.  Provide at least **8–12** comprehensive articles (800–1 200 words each) covering topics such as PF/ESI/PT compliance, attendance management best practices, HRMS selection checklists, payroll audit guides, and new labour codes.  Organise resources by topic and enable search & filters (Payroll, Compliance, ATS, HRMS, Performance).
- **Free downloads:** Offer templates like onboarding checklists, salary breakup sheets, leave tracker spreadsheets, PF/PT calculators and sample HR policies.  Require a minimal email form to download, integrating with your lead capture flow.
- **Benchmarks & reports:** Publish short benchmark reports on trending HR tools, comparing their module coverage, pricing and adoption among SMEs.  Include charts or tables for quick visual consumption.  Make sure charts adhere to your colour palette and are accessible.

## 7. Additional Features & Enhancements

- **Free helper tools:** Integrate calculators (PF, ESI, Gratuity, Leave encashment), HR letter generators (offer, appraisal, exit) and compliance calendars.  Provide exportable reports (CSV, PDF).  These tools enhance value and attract organic traffic.
- **AI-insights panel:** In the tool comparison page, add a sidebar summarising key differences and recommending best-fit tools based on the user’s inputs.  Use natural language to explain pros/cons of each tool.
- **Performance optimisations:** Implement lazy-loading and route-level code splitting.  Optimise fonts by hosting them locally.  Keep third-party scripts minimal; use script deferral and compression (gzip/Brotli).
- **Accessibility & inclusive design:** Add skip-to-content links, ensure keyboard navigability, provide alt text for all images and icons, and allow users to reduce motion (prefers-reduced-motion media query).  Use inclusive language (avoid gendered pronouns).  Provide translations/localisation for major Indian languages in future phases.

## 8. Implementation & QA Checklist

1. **Component library & tokens:** Define colour and typography tokens in your design system.  Use a CSS-in-JS or utility framework to ensure consistent application across components.  Document spacing, border radii and elevation levels.
2. **Responsive testing:** Test each page on mobile, tablet and desktop.  Ensure bento grids collapse gracefully into stacks and micro-interactions are not disabled on mobile.
3. **Vendor-logo pipeline:** Write a build-time script to fetch vendor logos via the Clearbit Logo API using each vendor’s domain, store them in `/public/vendor-logos/` and fall back to initials if missing.  Use `<img>` tags with `loading="lazy"` and `srcset` for high DPI.
4. **Form QA:** Validate required fields, confirm success messages and ensure data submission works across devices.  Add Honeypot or invisible reCAPTCHA to deter spam.
5. **Filter logic:** Confirm that filters update results instantly and logically (size ranges, budget ranges, modules).  Provide selected filter chips that can be removed individually.
6. **Performance budget:** Use Lighthouse and WebPageTest to measure performance, accessibility, best practices and SEO scores.  Aim for scores ≥90 across categories.
7. **User testing:** Conduct unmoderated tests with 5–7 Indian SME stakeholders to confirm readability, clarity of value proposition and ease of completing the recommendation flow.  Collect feedback and iterate.

---

### Summary

By implementing this final set of changes, **HR Signal** can achieve the polish, clarity and functionality expected of modern SaaS comparison sites.  The dark-mode aesthetic should be refined with tinted backgrounds and accessible colour contrasts; vendor and tool pages must display full content with logos, features, compliance details and pricing; filters should reflect real SME needs; and the resources & tools hub should provide genuine value.  Combined with micro-interactions and performance optimisation, these enhancements will make HR Signal a premium, trustworthy destination for HR software discovery in India.
