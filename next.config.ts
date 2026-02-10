import type { NextConfig } from "next";

const NO_STORE_HEADERS = [
  { key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" },
  // Legacy/proxy hints (helps stubborn Safari/iOS caches in the wild)
  { key: "Pragma", value: "no-cache" },
  { key: "Expires", value: "0" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // Never cache HTML routes/pages (prevents "hard refresh" after deploy)
      { source: "/", headers: NO_STORE_HEADERS },
      {
        // Exclude Next static/image and common static files so they keep long-term caching.
        // NOTE: Next supports regex constraints inside params.
        source: "/:path((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
        headers: NO_STORE_HEADERS,
      },
    ];
  },
};

export default nextConfig;
