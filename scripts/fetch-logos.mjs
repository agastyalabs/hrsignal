import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function domainFromUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

async function fetchAsBuffer(url, { timeoutMs = 8000 } = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "hrsignal-logo-fetch/1.0",
        accept: "image/*,*/*;q=0.8",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
  } finally {
    clearTimeout(t);
  }
}

function initials(name) {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  const chars = parts.map((p) => p.replace(/[^a-zA-Z0-9]/g, "").slice(0, 1).toUpperCase());
  return chars.join("") || String(name).slice(0, 2).toUpperCase();
}

function initialsSvg({ name }) {
  const text = initials(name);
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#111827"/>
      <stop offset="1" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <rect width="96" height="96" rx="18" fill="url(#g)"/>
  <rect x="1" y="1" width="94" height="94" rx="17" fill="none" stroke="#1F2937"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
    font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
    font-size="34" font-weight="700" fill="#CBD5E1">${text}</text>
</svg>`);
}

async function main() {
  const root = process.cwd();
  const dataPath = path.join(root, "data", "vendors_seed.json");
  const outDir = path.join(root, "public", "vendor-logos");
  fs.mkdirSync(outDir, { recursive: true });

  const vendors = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  let networkOk = true;
  try {
    // quick probe: if DNS/network blocks Clearbit, skip remote fetch entirely
    await fetchAsBuffer("https://logo.clearbit.com/example.com", { timeoutMs: 1500 });
  } catch {
    networkOk = false;
  }

  for (const v of vendors) {
    // be a good citizen to upstream
    await new Promise((r) => setTimeout(r, 25));
    const name = v.name;
    const slug = v.slug || slugify(name);
    const domain = v.domain || domainFromUrl(v.website_url);

    if (!domain) {
      skipped++;
      continue;
    }

    const outPath = path.join(outDir, `${slug}.png`);
    if (fs.existsSync(outPath)) {
      skipped++;
      continue;
    }

    const urls = networkOk
      ? [`https://logo.clearbit.com/${domain}`, `https://icons.duckduckgo.com/ip2/${domain}.ico`]
      : [];

    let buf = null;
    for (const url of urls) {
      try {
        buf = await fetchAsBuffer(url);
        break;
      } catch {
        // try next
      }
    }

    const input = buf ?? initialsSvg({ name });

    try {
      await sharp(input, buf ? undefined : { density: 300 })
        .resize({ width: 96, height: 96, fit: "contain", background: "#0B0E23" })
        .png({ quality: 90 })
        .toFile(outPath);
      ok++;
    } catch {
      failed++;
    }
  }

  console.log(JSON.stringify({ ok, skipped, failed, outDir }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
