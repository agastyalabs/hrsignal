# UI Deploy Notes (Vercel + Next.js Marketplace)

This doc captures common Vercel compatibility concerns for a Next.js marketplace UI, with a focus on **assets, build settings, caching, and performance**.

> Assumptions: Next.js 13+ (App Router) on Vercel.

---

## 1) `next/image` on Vercel

### Remote images (marketplace listings, seller avatars, CDN)
If images come from remote hosts (S3, CloudFront, Supabase, Shopify, etc.), configure **allowlisted hosts**.

**Next.js (`next.config.ts/js`)**:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Prefer remotePatterns (more precise than `domains`)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.example-bucket.s3.amazonaws.com',
        pathname: '/**',
      },
    ],
    // Optional: tune deviceSizes / imageSizes only if you understand impact
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
}

module.exports = nextConfig
```

Notes:
- Using `next/image` with remote assets yields Vercel-managed optimization and caching.
- Ensure remote hosts support **range requests** and sane caching headers; otherwise you may see slow optimizations or redundant downloads.

### SVGs
- By default, Next Image is conservative with SVG. If you need SVG through `next/image`, consider serving SVGs as normal `<img>` or inline.
- Avoid enabling `dangerouslyAllowSVG` unless you control the SVG content.

### Placeholder / blur
- `blurDataURL` works well for local/static images.
- For dynamic marketplace content, generate blur hashes or LQIP server-side and store them alongside listings.

### Animated images
- Animated GIF/WebP are not always worth optimizing; consider using `unoptimized` per-image when needed.

### Default caching behavior (what to expect)
- Optimized images are cached at the edge/CDN. Subsequent requests are fast.
- Cache-busting: include a versioned URL or change the source URL when the underlying image changes.

---

## 2) Caching & revalidation (pages, data, and assets)

### Static generation & ISR
- Prefer static generation where possible for category pages, landing pages, and marketing content.
- Use ISR (`revalidate`) for data that updates periodically.

**App Router examples**:

```ts
// app/category/[slug]/page.tsx
export const revalidate = 60 // seconds
```

For fetch caching:

```ts
await fetch(url, { next: { revalidate: 60 } })
```

### Avoid accidental “always dynamic”
These patterns force dynamic rendering and can reduce CDN cacheability:
- Reading `cookies()`, `headers()`, `searchParams` in ways that make routes dynamic
- `export const dynamic = 'force-dynamic'`
- Frequent use of server actions on the initial render path

Be deliberate: dynamic where required (auth/admin), static/ISR elsewhere.

### Custom headers (optional)
If you need explicit cache headers, set them in `next.config.*`:

```js
async headers() {
  return [
    {
      source: '/(.*)\\.(?:js|css|woff2|png|jpg|webp|avif)$',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ]
}
```

Notes:
- Assets emitted by Next are fingerprinted; long-lived immutable caching is appropriate.
- For **user-uploaded assets** hosted elsewhere, ensure your CDN/object storage sets proper cache headers.

---

## 3) Fonts on Vercel (performance + correctness)

### Preferred: `next/font` (self-hosted at build)
Use `next/font` to eliminate layout shift and reduce reliance on third-party font CDNs.

- Google fonts:

```ts
import { Inter } from 'next/font/google'

export const inter = Inter({ subsets: ['latin'], display: 'swap' })
```

- Local fonts:

```ts
import localFont from 'next/font/local'

export const brand = localFont({
  src: [
    { path: './Brand-Regular.woff2', weight: '400', style: 'normal' },
    { path: './Brand-Bold.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
})
```

### If using external font providers
- Ensure CSP allows them (if you set CSP).
- Expect potential reliability/perf issues vs self-host.

---

## 4) Static assets (`/public`, icons, robots, sitemap)

### `/public` best practices
- Put deterministic/static files in `/public` (favicons, images used in marketing pages, `robots.txt`, `site.webmanifest`).
- Use hashed/versioned filenames for assets that change frequently.

### `robots.txt` and `sitemap.xml`
- For dynamic sitemaps, use `app/sitemap.ts` or a route handler and cache appropriately.

---

## 5) Open Graph (OG) / social share images

### Recommended: dynamic OG image generation
Use Next’s `ImageResponse` route (commonly at `app/api/og/route.ts`) so OG images are generated on demand.

Considerations on Vercel:
- Often deployed as **Edge runtime** (fast globally), but Edge has constraints.
- If you need Node-only libraries (heavy image processing), use Node runtime instead.

### Static OG images
For simple cases, ship static OG images in `/public/og/default.png`.

---

## 6) Middleware & “proxy” patterns

Vercel middleware runs on the **Edge Runtime** with limitations:
- No Node.js built-ins
- Must be fast

Use middleware for:
- URL rewrites/redirects
- Lightweight auth gating

Prefer Node route handlers (`app/api/*`) for:
- Real backend proxying
- Anything requiring Node-only libraries

---

## 7) Performance budgets (practical targets)

### Core Web Vitals targets
- **LCP**: < 2.5s (good)
- **INP**: < 200ms (good)
- **CLS**: < 0.1 (good)

### Asset budgets
- Above-the-fold JS (per route): aim for **< 200–300 KB gz**
- Largest hero image: **< 200–400 KB** (AVIF/WebP)
- Fonts: **1–2 families**, `.woff2`, keep total < ~150 KB when feasible

### Common marketplace pitfalls
- Listing grids with oversized thumbnails (fix with `next/image` + correct `sizes`).
- Filters shipping large client bundles (lazy load / split components).
- Too many third-party scripts (defer, conditionally load).

---

## Deployment checklist

- [ ] `next/image` configured for all remote image hosts (`remotePatterns`)
- [ ] Correct `sizes` attributes for responsive images (especially listing grids)
- [ ] Fonts use `next/font` (or otherwise self-hosted) to reduce CLS
- [ ] Static assets placed under `/public` and filenames are versioned where needed
- [ ] OG images: static `/public/og/*` or dynamic `ImageResponse` route with correct runtime
- [ ] Middleware kept lightweight; Node runtime used for real proxying if required
- [ ] ISR used for semi-dynamic pages and cache headers set appropriately
- [ ] Lighthouse run on Home, Tools list, Tool detail
