#!/usr/bin/env node
/**
 * Recommendations endpoint smoke test.
 *
 * Usage:
 *   BASE_URL=http://localhost:3000 node scripts/test-recommendations.mjs
 */

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

const payload = {
  companyName: "Acme India Pvt Ltd",
  buyerEmail: "test@example.com",
  buyerRole: "Founder",
  sizeBand: "EMP_20_200",
  states: ["KA", "MH"],
  categoriesNeeded: ["hrms", "payroll", "attendance"],
  mustHaveIntegrations: ["tally"],
  budgetNote: "~₹60/employee/month",
  timelineNote: "30 days",
};

const url = new URL("/api/recommendations", baseUrl).toString();

console.log("POST", url);

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
  json = { parseError: true, raw: text.slice(0, 500) };
}

console.log("status", res.status);
console.log(JSON.stringify(json, null, 2));

if (res.ok && json?.resultId) {
  console.log("results page:", new URL(`/results/${json.resultId}`, baseUrl).toString());
}

process.exit(res.ok ? 0 : 1);
