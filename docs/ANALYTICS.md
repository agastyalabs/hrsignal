# Analytics (events + UTM)

HRSignal uses **Vercel Web Analytics** (`@vercel/analytics`) for lightweight event tracking.

- No heavy client libraries (GA/PostHog SDK) are added.
- Events include **UTM attribution** captured from the landing URL.

## UTM capture

On first page load we capture and persist these params from the URL:

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- `gclid`, `fbclid`
- `ref`

Persistence:
- Stored in `localStorage` under key: `hrsignal_utm_v1`
- The stored values are attached as properties to every tracked event.

## Tracked events

### Directory pages

- `view_directory`
  - `{ directory: "tools" | "vendors" }`

- `apply_filters`
  - Fired on page load when the directory URL contains any active filters.
  - Includes filter params (e.g. `category`, `size`, `india`, etc.)

### Navigation / clicks

- `click_vendor`
  - Fired when a vendor link/CTA is clicked on vendor cards.

- `click_compare`
  - Fired when the user clicks **Compare now** from the compare tray.

- `click_request_demo`
  - Fired when the user submits the results-page lead form, and when clicking the
    tool-detail "Request Demo via HRSignal" link.

### Recommendations flow

- `start_shortlist`
  - Fired when the recommendations form loads.

- `submit_shortlist`
  - Fired after `/api/recommendations` returns success (contains `resultId`).

## Setup / env vars

Vercel Analytics requires no app-level env vars in this repo.

Optionally, set these environment variables when deploying on Vercel to improve metadata:

- `VERCEL_GIT_COMMIT_REF` (provided by Vercel)
- `VERCEL_GIT_COMMIT_SHA` (provided by Vercel)

(UTM capture works without any env vars.)
