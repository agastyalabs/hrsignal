import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();

async function main() {
  const brandDir = path.join(root, "public", "brand");
  fs.mkdirSync(brandDir, { recursive: true });

  const svgPath = path.join(brandDir, "hrsignal-logo.svg");
  if (!fs.existsSync(svgPath)) {
    throw new Error(`Missing ${svgPath}. Expected brand SVG to exist.`);
  }

  const logoPngPath = path.join(brandDir, "logo.png");
  const ogPngPath = path.join(root, "public", "og.png");
  const faviconPath = path.join(root, "public", "favicon.ico");

  const svg = fs.readFileSync(svgPath);

  // Logo PNG: crisp for header/footer.
  await sharp(svg, { density: 300 })
    .resize({ width: 360 })
    .png({ quality: 90 })
    .toFile(logoPngPath);

  // OG image: 1200x630 with safe padding.
  await sharp(svg, { density: 300 })
    .resize({ width: 900 })
    .extend({
      top: 140,
      bottom: 140,
      left: 150,
      right: 150,
      background: "#0B0E23",
    })
    .resize({ width: 1200, height: 630, fit: "cover" })
    .png({ quality: 90 })
    .toFile(ogPngPath);

  // Favicon: generate a small square mark from the mark svg if present.
  const markSvgPath = path.join(brandDir, "hrsignal-mark.svg");
  const markSvg = fs.existsSync(markSvgPath) ? fs.readFileSync(markSvgPath) : svg;

  // sharp supports .ico output when libvips has it; otherwise fall back to png->ico not available.
  try {
    await sharp(markSvg, { density: 300 })
      .resize({ width: 64, height: 64, fit: "cover" })
      .toFormat("ico")
      .toFile(faviconPath);
  } catch {
    // Fallback: create favicon.ico as PNG bytes (some browsers accept it; Next will still serve icon).
    const buf = await sharp(markSvg, { density: 300 })
      .resize({ width: 64, height: 64, fit: "cover" })
      .png({ quality: 90 })
      .toBuffer();
    fs.writeFileSync(faviconPath, buf);
  }

  console.log("Generated:", {
    logoPngPath,
    ogPngPath,
    faviconPath,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
