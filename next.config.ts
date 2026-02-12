import type { NextConfig } from "next";
import { execSync } from "node:child_process";

const NO_STORE_HEADERS = [
  { key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" },
  // Legacy/proxy hints (helps stubborn Safari/iOS caches in the wild)
  { key: "Pragma", value: "no-cache" },
  { key: "Expires", value: "0" },
];

function safe(cmd: string) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
}

const buildBranch =
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.GIT_BRANCH ||
  safe("git rev-parse --abbrev-ref HEAD") ||
  "unknown";

const buildSha =
  (process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || safe("git rev-parse HEAD") || "").slice(0, 7) ||
  "unknown";

const buildTime = process.env.BUILD_TIME || new Date().toISOString();

const nextConfig: NextConfig = {
  env: {
    // Tiny footer build stamp (computed at build time)
    NEXT_PUBLIC_BUILD_BRANCH: buildBranch,
    NEXT_PUBLIC_BUILD_SHA: buildSha,
    NEXT_PUBLIC_BUILD_TIME: buildTime,
  },

  async redirects() {
    return [
      // Canonicalize category slug
      {
        source: "/categories/payroll",
        destination: "/categories/payroll-india",
        permanent: true,
      },
    ];
  },

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
