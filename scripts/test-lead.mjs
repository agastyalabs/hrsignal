#!/usr/bin/env node
/**
 * Simple lead submission smoke test.
 *
 * Usage:
 *   BASE_URL=http://localhost:3000 node scripts/test-lead.mjs
 */

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

const payload = {
  source: "script:test-lead",
  company: "Acme Inc",
  name: "Test User",
  email: "test@example.com",
  // phone: "+91-9999999999",
  message: "Need payroll + attendance; demo next week.",
};

const url = new URL("/api/leads", baseUrl).toString();

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

process.exit(res.ok ? 0 : 1);
