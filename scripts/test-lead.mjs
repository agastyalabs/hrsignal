// Usage: node scripts/test-lead.mjs [baseUrl]
// Example: node scripts/test-lead.mjs http://127.0.0.1:3000

const base = process.argv[2] || "http://127.0.0.1:3000";
const url = base.replace(/\/$/, "") + "/api/leads";

async function main() {
  const payload = {
    name: "Script Test",
    email: "script-test@example.com",
    phone: "",
    companyName: "Infira",
    useCase: "Testing lead submission from scripts/test-lead.mjs",
    source: "script-test",
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = { raw: await res.text() };
  }

  console.log(JSON.stringify({ status: res.status, response: data }, null, 2));
}

main().catch((e) => {
  console.error("Error:", e?.message || e);
  process.exit(1);
});
