// Usage: node scripts/test-recommendations.mjs [baseUrl]
// Example: node scripts/test-recommendations.mjs http://127.0.0.1:3000

const base = process.argv[2] || "http://127.0.0.1:3000";
const url = base.replace(/\/$/, "") + "/api/recommendations";

async function main() {
  const payload = {
    companyName: "Infira",
    buyerEmail: "test@example.com",
    buyerRole: "Founder",
    sizeBand: "EMP_20_200",
    states: ["KA"],
    categoriesNeeded: ["hrms", "payroll", "attendance"],
    mustHaveIntegrations: ["tally"],
    budgetNote: "~₹50/employee/month",
    timelineNote: "30 days",
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
