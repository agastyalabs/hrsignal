import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const svgPath = path.join(root, 'public', 'brand', 'hrsignal-v2-mark.svg');
const svg = await fs.readFile(svgPath);

const outDir = path.join(root, 'public', 'favicon');
await fs.mkdir(outDir, { recursive: true });

const targets = [
  { name: 'icon-32.png', size: 32 },
  { name: 'icon-48.png', size: 48 },
  { name: 'icon-192.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-16x16.png', size: 16 },
];

for (const t of targets) {
  const out = path.join(outDir, t.name);
  const buf = await sharp(svg, { density: 384 })
    .resize(t.size, t.size)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  await fs.writeFile(out, buf);
  console.log('wrote', t.name);
}
