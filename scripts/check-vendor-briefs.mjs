import { readdir } from "node:fs/promises";
import path from "node:path";

const dir = path.join(process.cwd(), "docs", "vendors");

try {
  const files = (await readdir(dir)).filter((f) => f.endsWith(".md"));
  files.sort();
  console.log(`Found ${files.length} vendor briefs in docs/vendors:`);
  for (const f of files) console.log(`- ${f.replace(/\.md$/, "")}`);
} catch {
  console.error("No docs/vendors directory found.");
  process.exit(1);
}
