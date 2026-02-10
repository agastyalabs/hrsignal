# HRSignal — Content Completeness Spec (V1)

This document defines the **minimum required content sections and field schema** for HRSignal pages so listings feel credible, comparable, and India-first.

**Goals**
- Make every listing **decision-oriented** (shortlist + compare), not a marketing dump.
- Ensure **uniform comparable fields** across tools/vendors.
- Make **India readiness** visible and evaluable.
- Make trust explicit via **verification level, sources, and freshness**.

**Non-goals (v1)**
- Perfect data for every tool.
- Fake precision (e.g., numeric price ranges without evidence).

---

## 1) Trust & verification model

### Verification levels
Use exactly these levels across the product:
- **Verified**
- **Partially verified**
- **Unverified**

### Trust signals (shown consistently)
For every Tool and Vendor page, define:
- `verificationLevel` (enum above) — **always present**
- `sources[]` (array of URLs) — show count if >0
- `lastCheckedAt` (date) — show if available

**UI behavior (policy)**
- Trust badge always visible.
- Sources count shown only if >0.
- Last checked shown only if available.

---

## 2) Pricing normalization rules (India-first)

### Concepts
Normalize pricing into two buckets:
1) **Recurring subscription** (preferred unit):
   - **PEPM** = per employee per month
   - **Per user/month** (common for ATS/helpdesk)
   - Quote-based (recurring unknown)
2) **One-time costs**:
   - Implementation/setup/migration

### Pricing model enum
- `PEPM`
- `Per user/month`
- `One-time`
- `Quote-based`

### Display rules
- If numeric amount exists but unit is unclear, add a clarifier:
  - `₹X (PEPM)` / `₹X (per user/month)` / `₹X (one-time)`
- If quote-based, do **not** invent ranges. Display:
  - `Quote-based` + “Contact vendor / request quote”

### Evidence requirement
If you show a pricing claim (even “Quote-based”), include at least one pricing/evidence URL in `sources[]` when possible.

---

## 3) Page specs

### A) Tool Page (`/tools/[slug]`)

#### Minimum required sections (must render)
1) **Hero**
   - Tool name
   - Vendor name
   - 1-line tagline/positioning
   - Trust signals row (verification + sources count + last checked)
2) **Key facts** (label:value rows; no paragraphs)
   - Pricing model (normalized)
   - Deployment (Cloud/On-prem/Hybrid)
   - Implementation time (rough band)
   - Best-fit company size band(s)
3) **India-first readiness**
   - Payroll compliance tags (PF/ESI/PT/TDS/LWF/Form16/24Q as applicable)
   - GST invoicing support (yes/no/unknown)
   - Data residency (India / Global / Configurable / Unknown)
   - WhatsApp support (yes/no/unknown)
   - Local partners / implementation network (yes/no/unknown)
4) **Modules & coverage**
   - Modules supported (chips)
   - Integrations (top 5 chips)
5) **Pros / Cons**
   - 3–5 bullets each
6) **Sources & data quality**
   - Accordion with evidence URLs + “info pending” items
7) **CTA**
   - Request demo/pricing (must keep existing lead flow endpoints)

#### Tool field schema (minimum)
```ts
type ToolContent = {
  slug: string;
  name: string;
  vendorName: string;
  vendorSlug?: string;
  tagline?: string;

  // Trust
  verificationLevel: "Verified" | "Partially verified" | "Unverified";
  lastCheckedAt?: string; // YYYY-MM-DD
  sources?: string[];

  // Categorization
  categorySlugs: string[]; // primary + secondary
  modules: string[];

  // Fit
  bestForSizeBands?: Array<"EMP_20_200" | "EMP_50_500" | "EMP_100_1000" | "1000+">;
  deployment?: "CLOUD" | "ONPREM" | "HYBRID" | "UNKNOWN";
  implementationTime?: "<2w" | "2-4w" | "4-8w" | ">8w" | "UNKNOWN";

  // Pricing
  pricingType: "PEPM" | "Per user/month" | "One-time" | "Quote-based";
  pricingText?: string; // normalized copy
  oneTimeCostsText?: string; // optional

  // India-first
  indiaComplianceTags?: string[]; // PF/ESI/PT/TDS/LWF/Form16/24Q etc
  gstInvoicing?: "YES" | "NO" | "UNKNOWN";
  dataResidency?: "INDIA" | "GLOBAL" | "CONFIGURABLE" | "UNKNOWN";
  whatsappSupport?: "YES" | "NO" | "UNKNOWN";
  localPartners?: "YES" | "NO" | "UNKNOWN";

  // Product
  integrations?: string[];
  pros?: string[];
  cons?: string[];

  // Optional: disambiguation
  notToBeConfusedWith?: string[];
};
```

---

### B) Vendor Page (`/vendors/[slug]`)

#### Minimum required sections
1) **Hero**
   - Vendor logo + name
   - Website domain
   - Trust signals row
2) **Snapshot key facts**
   - Categories served (chips)
   - # of published tools
   - India-first readiness (data residency, WhatsApp support, local partners)
3) **Products on HRSignal**
   - Tool cards grid (consistent density)
4) **India-first readiness**
   - GST invoicing (if vendor bills in INR)
   - Data residency
   - Local implementation partners
   - Support channels (WhatsApp/email/phone)
5) **Sources & data quality**

#### Vendor field schema (minimum)
```ts
type VendorContent = {
  slug: string;
  name: string;
  websiteUrl?: string;
  tagline?: string;

  // Trust
  verificationLevel: "Verified" | "Partially verified" | "Unverified";
  lastCheckedAt?: string; // YYYY-MM-DD
  sources?: string[];

  // Coverage
  categorySlugs: string[];
  toolSlugs: string[];

  // India-first
  gstInvoicing?: "YES" | "NO" | "UNKNOWN";
  dataResidency?: "INDIA" | "GLOBAL" | "CONFIGURABLE" | "UNKNOWN";
  whatsappSupport?: "YES" | "NO" | "UNKNOWN";
  payrollComplianceCoverage?: string[]; // if vendor offers payroll tools/services
  localPartners?: "YES" | "NO" | "UNKNOWN";

  // Support
  supportChannels?: Array<"WHATSAPP" | "EMAIL" | "PHONE" | "CHAT" | "TICKET" | "PARTNER">;

  // Optional
  overviewBullets?: string[];
};
```

---

### C) Category Page (`/categories/[slug]`)

#### Minimum required sections
1) **Category intro**
   - 1-line definition
   - India-first buyer note (what matters in India)
2) **What to evaluate**
   - 4–8 bullet checklist
3) **Leaders grid**
   - top tools (ToolCard) with trust row
4) **Filters within category**
   - company size
   - pricing metric
   - deployment
5) **Comparison CTA**
   - compare leaders
6) **Common stacks**
   - 3 stack cards (e.g., Core HR + Payroll + ATS)

#### Category field schema (minimum)
```ts
type CategoryContent = {
  slug: string;
  name: string;
  oneLineDef: string;

  // India-first evaluation
  evaluationChecklist: string[];
  commonPitfalls: string[];

  // Leaders
  leaderToolSlugs: string[];

  // Common stacks
  commonStacks: Array<{ title: string; categories: string[]; note: string }>;
};
```

---

## 4) India-first fields glossary (how to interpret)
- **GST invoicing**: can buyer pay via GST invoice / Indian billing entity.
- **Data residency**: whether customer data can be hosted/stored in India.
- **WhatsApp support**: if WhatsApp is an official support/ops channel.
- **Payroll compliance**: PF/ESI/PT/TDS/LWF/Form 16/24Q coverage.
- **Local partners**: on-ground implementation/partner network in India.

---

## 5) Completeness rules (what blocks “Verified”)
To mark a Tool/Vendor as **Verified**, minimum must be true:
- `sources.length >= 1`
- `lastCheckedAt` is present
- all **pricingType + deployment + categorySlugs** are present
- India-first section has at least **dataResidency + support channels** populated (or explicitly UNKNOWN)

If some are missing, the listing becomes **Partially verified** or **Unverified**.
