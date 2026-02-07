HRSignal Final Pre-Launch UI/UX & Content Fixes

This document summarises the issues still present on hrsignal.vercel.app after the latest updates and outlines the final set of tasks required to achieve a polished, credible launch. It builds on the recommendations from previous rounds and reflects your feedback from 8 Feb 2026.

Why It’s Not Launch-Ready Yet
	1.	Branding still shows PICHS in the header and footer – A legacy placeholder remains in the code. It undermines the brand and confuses visitors.
	2.	Vendor logos are missing across all pages – Cards and “Popular vendors” sections still display generic initials or placeholders. This is a critical trust signal and must be fixed.
	3.	Resources content is limited – There are only 6–7 articles. For launch credibility, you should aim for at least 10–12 posts (600–1,200 words each) covering payroll, compliance, HRMS selection, ATS, attendance & leave, performance/OKR and other relevant topics . A well-structured resources library helps nurture prospects and signals expertise .
	4.	Residual placeholders – Several sections still use placeholder logos (Acme, ZenHR, Northwind, etc.) and “representative testimonials.” These must be replaced or removed.
	5.	Colour contrast / readability – Some dark sections (e.g., category lists and “How HRSignal helps”) have very low contrast, making text hard to read. Accessible colour contrast improves professional perception .
	6.	Typography consistency – Ensure that headings, body copy and buttons use consistent font families and weights across the site. Avoid mixing fonts or inconsistent sizing.

Final Tasks for Launch

1. Branding: Replace PICHS with HRSignal
	•	Logo: Ensure the correct logo file is stored in public/brand/logo.png and imported via a central constant (e.g., BRAND.logo). Delete the mis-named file (Logo.png.PNG) and update all imports. Bust the cache by renaming if necessary.
	•	Name: Replace all occurrences of PICHS with HRSignal in header, footer, metadata, SEO tags and hero section.
	•	Favicon & Social images: Add a favicon (favicon.ico), an apple-touch-icon, and an Open Graph image featuring the HRSignal branding for social sharing.

2. Vendor logos: Implement deterministic logo rendering
	•	Schema: Add a domain field to each vendor in your dataset (e.g. keka.com), alongside the slug.
	•	Logo Component: Build a <VendorLogo> component that tries these sources in order:
	1.	Local file: public/vendor-logos/{slug}.png – downloaded and committed at build time.
	2.	Clearbit Logo API: https://logo.clearbit.com/{domain} – good for fallback where no local file exists.
	3.	Initials: If neither of the above are available, generate a coloured square with the vendor’s initials.
	•	Build Script: Write a script (e.g. scripts/fetch-logos.ts) that loops through your vendor JSON, fetches logos from Clearbit or another reliable service, and saves them to public/vendor-logos/ before the next build. Commit these images into the repo.

3. Content & Resources
	•	Minimum viable library: Write at least 10–12 articles (600–1,200 words each) to give the resources page depth. Use the following outline categories:
	•	Payroll & compliance checklist (PF/ESI/PT/TDS) – update annually.
	•	Labour code changes & policies (2026 and beyond).
	•	Attendance & leave management best practices.
	•	Performance & OKRs setup for SMEs.
	•	ATS/Hiring workflows and interview scoring.
	•	HRMS selection guide and checklists.
	•	Onboarding & document management.
	•	Field staff / shift management.
	•	Data security & privacy for HR software.
	•	Integrations with accounting and finance tools.
	•	Structure: Each post should include:
	•	An introduction that outlines the problem.
	•	A clear body with subheadings and bullet points.
	•	A conclusion and next steps.
	•	Suggested tools/vendors relevant to the topic.
	•	Author bio and date.
	•	Call-to-Action: Add subtle CTAs at the end of posts (e.g., “Get a personalised shortlist” or “Compare top tools”).

4. Remove or replace placeholders
	•	Testimonials: Either replace placeholder quotes with real testimonials (even if from beta testers) or hide the testimonials section until real feedback is available.
	•	Partner & customer logos: Replace “Acme” placeholders with actual early adopter or partner logos, or remove the section until ready. According to trust research, displaying credible partner/association logos can improve conversion by 70–400% .

5. Improve colour contrast & readability
	•	Adjust background and card colours so text remains legible. Aim for a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text.
	•	Increase the brightness of dark cards in the categories section and the “How HRSignal helps” area to avoid invisible text.
	•	Standardise link colours (use a single purple hue) and hover states.

6. Typography & spacing
	•	Use the same type family across all headings and body text. Avoid mixing multiple fonts. Choose a font pair that reflects modern, trustworthy design (e.g., Inter or Poppins for headings and body).
	•	Review the vertical rhythm: ensure equal spacing between sections and consistent padding in cards.
	•	Make sure button sizes (height, border radius) are consistent across forms and CTAs.

7. Minor UX tweaks
	•	Active nav highlighting: The navigation bar now highlights the current page – ensure this works on all pages (Tools, Vendors, Categories, Resources, Recommendations). This reduces friction .
	•	Compare tray: If not yet implemented, add a small persistent tray that appears when users click “Compare” on two or more tools. It should summarise the selected tools and link to a comparison page.
	•	Form success page: After completing the recommendation form, display a friendly confirmation page with next steps instead of leaving users in a blank state.
	•	404 page: Create a custom 404 page with a call to search tools or return to the home page.

8. Quality assurance
	•	Cross-browser test across Chrome, Safari, Firefox, Edge and mobile Safari (iOS). Ensure layout doesn’t break on iPad or low-resolution devices.
	•	Accessibility: Validate via Lighthouse or Axe – ensure keyboard navigation, ARIA labels, alt tags for all images and logos.
	•	Performance: Ensure page load times meet your performance budget. Use compressed images and next-gen formats (WebP). Evaluate cls, lcp etc. as per Web Vitals. Light, performant pages increase conversions .

9. Launch readiness assessment

The site is visually compelling but requires the above fixes before a public launch. The core features – search, filters, category browsing, recommendation form – all function well, but the brand inconsistency, missing logos, limited resources content and placeholder elements undermine trust. Address these P0 issues and run a final round of QA before announcing the product publicly.

Appendix: Suggested File Structure Changes
	•	public/brand/logo.png – Official HRSignal logo
	•	public/brand/favicon.ico – Favicon and mobile icons
	•	public/vendor-logos/ – Folder of cached vendor logos
	•	scripts/fetch-logos.ts – Node script to download logos from vendor domains
	•	data/vendors.json – Add domain for each vendor
	•	components/VendorLogo.tsx – New component with fallback logic
	•	pages/resources/*.mdx – Each article stored as MDX for easy editing

Once these tasks are complete, HRSignal will present as a polished, trustworthy platform ready to attract and convert Indian SME buyers.
