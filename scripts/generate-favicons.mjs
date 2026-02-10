import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();

async function main() {
  const mark = path.join(root, "public", "brand", "hrsignal-mark.svg");
  if (!fs.existsSync(mark)) throw new Error(`Missing ${mark}`);

  const outDir = path.join(root, "public", "favicon");
  fs.mkdirSync(outDir, { recursive: true });

  const svg = fs.readFileSync(mark);

  // PNGs
  await sharp(svg, { density: 400 })
    .resize({ width: 16, height: 16, fit: "cover" })
    .png({ quality: 90 })
    .toFile(path.join(outDir, "favicon-16x16.png"));

  await sharp(svg, { density: 400 })
    .resize({ width: 32, height: 32, fit: "cover" })
    .png({ quality: 90 })
    .toFile(path.join(outDir, "favicon-32x32.png"));

  await sharp(svg, { density: 400 })
    .resize({ width: 180, height: 180, fit: "cover" })
    .png({ quality: 90 })
    .toFile(path.join(outDir, "apple-touch-icon.png"));

  // ICO (multi-size if supported)
  try {
    const ico = await sharp(svg, { density: 400 })
      .resize({ width: 64, height: 64, fit: "cover" })
      .toFormat("ico")
      .toBuffer();
    fs.writeFileSync(path.join(outDir, "favicon.ico"), ico);
  } catch {
    // fallback: write a PNG buffer as favicon.ico (better than missing)
    const buf = await sharp(svg, { density: 400 })
      .resize({ width: 64, height: 64, fit: "cover" })
      .png({ quality: 90 })
      .toBuffer();
    fs.writeFileSync(path.join(outDir, "favicon.ico"), buf);
  }

  console.log("Generated favicons in", outDir);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
