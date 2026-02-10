import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
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

async function fetchAsBuffer(url) {
  const res = await fetch(url, {
    headers: {
      "user-agent": "hrsignal-logo-fetch/1.0",
      accept: "image/*,*/*;q=0.8",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

async function main() {
  const root = process.cwd();
  const dataPath = path.join(root, "data", "vendors_seed.json");
  const outDir = path.join(root, "public", "logos");
  fs.mkdirSync(outDir, { recursive: true });

  const vendors = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const v of vendors) {
    const name = v.name;
    const website = v.website_url;
    const slug = slugify(name);
    const domain = domainFromUrl(website);

    if (!domain) {
      skipped++;
      continue;
    }

    const outPath = path.join(outDir, `${slug}.png`);
    if (fs.existsSync(outPath)) {
      skipped++;
      continue;
    }

    const urls = [`https://logo.clearbit.com/${domain}`, `https://icons.duckduckgo.com/ip2/${domain}.ico`];

    let buf = null;
    for (const url of urls) {
      try {
        buf = await fetchAsBuffer(url);
        break;
      } catch {
        // try next
      }
    }

    if (!buf) {
      failed++;
      continue;
    }

    try {
      await sharp(buf)
        .resize({ width: 96, height: 96, fit: "contain", background: "#0B0E23" })
        .png({ quality: 90 })
        .toFile(outPath);
      ok++;
    } catch {
      failed++;
    }
  }

  console.log(JSON.stringify({ ok, skipped, failed }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
