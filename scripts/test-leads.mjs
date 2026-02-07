// Usage: node scripts/test-leads.mjs [baseUrl]
// Example: node scripts/test-leads.mjs http://127.0.0.1:3000

const base = process.argv[2] || "http://127.0.0.1:3000";
const url = base.replace(/\/$/, "") + "/api/leads";

async function main() {
  const payload = {
    name: "Script Test",
    email: "script-test@example.com",
    company: "Infira",
    useCase: "Testing /api/leads from scripts/test-leads.mjs",
    source: "script-test",
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  console.log(JSON.stringify({ status: res.status, response: json }, null, 2));
}

main().catch((e) => {
  console.error("Error:", e?.message || e);
  process.exit(1);
});
