HR Signal Final UI/UX Adjustments for Production Launch

This document offers a final QA checklist and design specification for the HR Signal platform before going live.  It builds on previous recommendations and addresses outstanding issues observed on the latest deployment (as of 07 Feb 2026).

1. Branding & Logo
	•	Replace “PICHS” with HR Signal – The current navigation bar still shows an old brand name (PICHS).  Update all instances of this string across the layout components (Header.tsx, Layout.tsx) to display “HR Signal”.  Use the new logo image (provided earlier) as the brand symbol and wordmark.  Ensure the logo file resides in /public/brand/logo.png (or .svg) and is imported into the header.  Remove any fallback icon that appears as a blank square.
	•	Favicons & social images – Provide proper favicon.ico and og:image using the new logo.  This improves recognition when the site is shared or added to bookmarks.

2. Colours, Fonts & Spacing
	•	Consistent colour palette – Stick to a unified dark palette (#0B0E23) with purple accents (#7441F2 / #825AE0) and off-white text.  Avoid mixing random shades.  Buttons should use a clear contrast ratio; for example, a purple primary button with white text and a hover state that lightens the purple slightly.  Secondary actions should use outline styles with subtle colour changes.
	•	Typography – Use a single, modern sans-serif font across the site (e.g., Inter or Montserrat).  Define heading sizes (H1–H4) and body text sizes in a typography scale and apply them consistently across hero sections, cards, and footers.  Ensure line heights and letter spacing provide comfortable reading.  Avoid using different fonts for random components.
	•	Spacing & layout – Check margins and padding for consistency.  Many cards currently have different internal spacing.  Define a spacing scale (e.g., 4 px increments) and use it systematically for vertical rhythm.  Increase white space around section headings (e.g., “Resources”) to improve readability.  Ensure content does not crowd the edges on small screens.

3. Header & Navigation
	•	Sticky header – Keep the header fixed to the top on scroll so navigation remains accessible.  Make sure the active menu item stays highlighted (Tools, Vendors, Categories, Resources).  Fix the bug where clicking a menu item does not highlight the selection.
	•	Search bar – Use a single global search bar for tools, vendors and categories, and place it centrally within the header.  Provide auto-complete suggestions.  Remove duplicate search inputs within the hero or forms to avoid confusion.

4. Home Page & Hero
	•	Hero background – Replace the dark gradient background with a more subtle, professional image or gradient that conveys sophistication (e.g., abstract shapes or an office scene).  Use the new HR Signal logo next to the headline and ensure the tagline clearly communicates the value (“Stop guessing HR tools.  Get a shortlist that fits your team.”).
	•	CTAs – Use primary and secondary call-to-action buttons: Get recommendations (primary) and Browse tools (secondary).  They should be visually balanced and accessible.
	•	Trust badges – Include small badges explaining “Verified vendors,” “Privacy-first,” and “SME fit” beneath the hero to build credibility immediately.

5. Tools & Vendors Pages
	•	Vendor logo integration – Implement an automated mechanism to fetch logos:
	1.	For each vendor, attempt to fetch the company’s logo from Clearbit’s Logo API (e.g., https://logo.clearbit.com/[domain]).  If the domain is unavailable, use a fallback service (e.g., https://icons.duckduckgo.com/ip2/[domain].ico).
	2.	Store the downloaded logos in a local folder (/public/logos) with predictable filenames (e.g., authbridge.png).  Use a script (Node.js) to loop through vendor domains and fetch the logo at build time.  This way logos are available statically and load quickly.
	3.	When rendering tool cards or vendor lists, import the corresponding logo and display it in the top left of the card.  Use a square container with a subtle border and ensure images are lazy-loaded.  Provide alt text with the vendor name.
	•	Comprehensive vendor details – Expand vendor pages to include company descriptions, founding year, headquarters, employee size, pricing, compliance modules and integrations.  Provide proper anchor tags for each section and use visual hierarchy so users can scan quickly.

6. Categories & Comparison
	•	Dedicated categories page – Ensure /categories renders a grid of categories with icons and descriptions rather than redirecting to /tools.  Each category card should show the number of vendors/tools available and link to a filtered list.
	•	Comparison tray – Add a sticky comparison tray to the bottom of tools pages.  When users select two or more tools, the tray expands to a full comparison table detailing features, ratings, pricing and vendor logos.  Add a button to “Show differences only” and allow users to export the comparison as PDF or share a link.

7. Recommendation Forms
	•	Simplified options – On /recommend, remove the static fallback form.  Provide tabs or radio buttons to choose between “Quick recommendation” (single step) and “Detailed recommendation” (multi-step).  Each form should clearly indicate how many steps remain.  Use the new logo in the header of the form and remove the blank icon placeholder.
	•	Validation & success state – Validate email and phone fields properly.  After submission, show a success page summarising recommendations and offer CTAs to compare tools, read guides or schedule a call.  Avoid leaving users at a dead end.

8. Resources Page & Content
	•	Expand content – The current resources library has only a few articles.  Publish additional posts covering topics like “Choosing an Attendance Management system,” “LMS best practices,” “AI in HR: benefits & risks,” “HR Tech trends in 2026,” and “Step-by-step HR compliance calendar for SMEs.”
	•	Better labelling – Bold the “Resources” heading and increase spacing.  Provide filter chips or categories for faster navigation (Explainers, Checklists, Playbooks, Policy).  Each article card should have a hero image, date, tags and reading time.  Use a consistent card height to avoid visual jitter.
	•	Rich article pages – Article pages should have a hero section with a relevant image, the title and subtitle.  Use subheadings, bullet lists and call-outs.  At the end of each article, suggest related content and include a newsletter sign-up form.

9. Footer & Trust Section
	•	Footer design – Use a contrasting dark or semi-transparent panel for the footer.  Include the HR Signal logo, quick navigation links, contact info (email, phone, registered address), and social media icons.  Provide links to privacy policy and terms.  Add a tagline like “India-first HR software discovery for SMEs.”
	•	Trust section – Above the footer or near CTAs, display small logos of partners (e.g., NASSCOM, SHRM India) and security badges (SSL, data privacy).  These cues reduce perceived risk .

10. Implementation & QA Checklist
	•	Static asset management – Ensure all images and logos are optimised (WebP or PNG, <100 KB) and served via CDN.  Preload fonts and critical CSS for faster first contentful paint.  Implement lazy loading for off-screen images and infinite lists where appropriate.
	•	Cross-device testing – Test on multiple breakpoints (desktop, tablet, mobile).  Confirm that navigation collapses properly on mobile (hamburger menu) and that cards wrap gracefully.  Check that clickable areas are large enough for touch.
	•	Automated tests – Use Playwright or Cypress to simulate typical flows: navigating between pages, searching and filtering, comparing tools, submitting recommendations and reading resources.  Test that vendor logos appear correctly and that there are no broken image links.  Run Lighthouse audits to catch performance or accessibility issues.
	•	Staging to production – After implementing the above, deploy to a staging environment and do a final visual review.  Once satisfied, promote to production.  Confirm there are no leftover placeholders (e.g., PICHS) and that the new branding appears uniformly across pages.

By following this checklist, HR Signal will deliver a cohesive, trust-building experience that feels ready for the public launch.  The site will reflect its India-first mission, showcase the full vendor ecosystem with proper logos, and provide valuable content to help SMEs choose the right HR tools.;
