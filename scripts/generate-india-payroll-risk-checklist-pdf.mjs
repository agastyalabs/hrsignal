import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";

const OUT_PATH = path.resolve("public/downloads/india-payroll-risk-checklist.pdf");

const BRAND = {
  name: "HRSignal",
  url: "https://hrsignal.in",
  primary: "#2563EB", // blue-600
  text: "#0F172A", // slate-900
  muted: "#475569", // slate-600
  line: "#E2E8F0", // slate-200
};

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function hr(doc) {
  const { r, g, b } = hexToRgb(BRAND.line);
  const y = doc.y;
  doc
    .save()
    .strokeColor(r, g, b)
    .lineWidth(1)
    .moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .stroke()
    .restore();
  doc.moveDown(1);
}

function header(doc, { title, subtitle, pageLabel }) {
  const { r, g, b } = hexToRgb(BRAND.primary);

  doc
    .save()
    .rect(doc.page.margins.left, doc.page.margins.top - 8, doc.page.width - doc.page.margins.left - doc.page.margins.right, 3)
    .fill(r, g, b)
    .restore();

  doc
    .fillColor(BRAND.text)
    .font("Helvetica-Bold")
    .fontSize(18)
    .text(title, { align: "left" });

  if (subtitle) {
    doc
      .moveDown(0.35)
      .font("Helvetica")
      .fontSize(11)
      .fillColor(BRAND.muted)
      .text(subtitle);
  }

  if (pageLabel) {
    doc
      .moveDown(0.35)
      .font("Helvetica")
      .fontSize(9)
      .fillColor(BRAND.muted)
      .text(pageLabel);
  }

  doc.moveDown(0.8);
  hr(doc);
}

function footer(doc, pageNumber, totalPages) {
  const label = `${BRAND.name} • India Payroll Risk Checklist • Page ${pageNumber}/${totalPages}`;
  // Must render within the writable area (<= page.height - margins.bottom),
  // otherwise PDFKit will auto-add a new page.
  const footerY = doc.page.height - doc.page.margins.bottom - 12;

  doc
    .save()
    .font("Helvetica")
    .fontSize(9)
    .fillColor(BRAND.muted)
    .text(label, doc.page.margins.left, footerY, {
      width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
      align: "center",
    })
    .restore();
}

function sectionTitle(doc, text) {
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor(BRAND.text)
    .text(text);
  doc.moveDown(0.4);
}

function paragraph(doc, text) {
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(BRAND.text)
    .text(text, { lineGap: 2 });
  doc.moveDown(0.6);
}

function bullets(doc, items) {
  doc.font("Helvetica").fontSize(11).fillColor(BRAND.text);

  const indent = 14;
  const bulletX = doc.x;
  const textX = bulletX + indent;

  for (const item of items) {
    const y = doc.y;
    doc.text("•", bulletX, y);
    doc.text(item, textX, y, {
      width: doc.page.width - doc.page.margins.right - textX,
      lineGap: 2,
    });
    doc.moveDown(0.35);
  }

  doc.moveDown(0.4);
}

function checklist(doc, items) {
  doc.font("Helvetica").fontSize(11).fillColor(BRAND.text);

  const indent = 18;
  const boxSize = 10;

  for (const item of items) {
    const y = doc.y + 2;
    const x = doc.x;

    doc
      .save()
      .lineWidth(1)
      .strokeColor(120, 120, 120)
      .rect(x, y, boxSize, boxSize)
      .stroke()
      .restore();

    doc.text(item, x + indent, doc.y, {
      width: doc.page.width - doc.page.margins.right - (x + indent),
      lineGap: 2,
    });
    doc.moveDown(0.35);
  }

  doc.moveDown(0.4);
}

function callout(doc, { title, body }) {
  const { r, g, b } = hexToRgb(BRAND.primary);
  const x = doc.page.margins.left;
  const w = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const y = doc.y;

  const pad = 12;
  const startY = y;

  doc.save();
  doc.fillColor(240, 246, 255).rect(x, startY, w, 10).fill();
  doc.restore();

  doc
    .save()
    .lineWidth(2)
    .strokeColor(r, g, b)
    .moveTo(x, startY)
    .lineTo(x, startY + 10)
    .stroke()
    .restore();

  doc.y = startY + 8;
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(BRAND.text)
    .text(title, x + pad, doc.y, { width: w - pad * 2 });

  doc
    .moveDown(0.25)
    .font("Helvetica")
    .fontSize(10.5)
    .fillColor(BRAND.text)
    .text(body, x + pad, doc.y, { width: w - pad * 2, lineGap: 2 });

  doc.moveDown(0.8);
}

function createPdf() {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 54, left: 54, right: 54, bottom: 54 },
    info: {
      Title: "India Payroll Risk Checklist (HRSignal)",
      Author: "HRSignal",
      Subject: "Buyer-first checklist to validate India payroll risk before choosing software",
    },
  });

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  const stream = fs.createWriteStream(OUT_PATH);
  doc.pipe(stream);

  const TOTAL = 8;
  let page = 1;

  function finishPage() {
    footer(doc, page, TOTAL);
  }

  // Page 1 — Cover
  header(doc, {
    title: "India Payroll Risk Checklist",
    subtitle: "A practical, buyer-first checklist to validate PF/ESI/PT/TDS scope, month-end controls, and audit readiness — before you sign.",
    pageLabel: "Version: 2026 • For 20–1000 employee orgs (India)",
  });

  sectionTitle(doc, "How to use this (2 minutes)");
  bullets(doc, [
    "Before demos: fill Step 0 (your payroll reality).",
    "In demos: run the month-end scenarios — arrears, reversals, cutoffs, exceptions — using real sample employees.",
    "After demos: demand the outputs (Step 3) and score vendors consistently (Quick scorecard).",
  ]);

  callout(doc, {
    title: "Buyer note",
    body: "Payroll is a trust system. Prefer tools that produce stable, reconcilable outputs — not tools that demo the most features.",
  });

  sectionTitle(doc, "What this is (and isn’t)");
  paragraph(
    doc,
    "This is an operational buyer checklist for Indian SMEs evaluating payroll software (or a payroll module inside an HRMS). It is not legal advice. The goal is to prevent the most common outcomes:"
  );
  bullets(doc, [
    "Payroll works in the demo but breaks during month-end.",
    "Compliance outputs can’t be reconciled or audited.",
    "Multi-state complexity is discovered after implementation.",
  ]);

  finishPage();

  // Page 2 — Step 0 + Step 1 overview
  doc.addPage();
  page++;
  header(doc, {
    title: "Step 0 — Define your payroll reality",
    subtitle: "Write these down before you talk to vendors (so the demo matches your actual process).",
  });

  checklist(doc, [
    "Employee count today and in 12 months",
    "States you operate in (and expansion plans)",
    "Salary structure complexity (allowances, variable pay, reimbursements)",
    "Contractor vs employee mix",
    "Attendance rules (late/early, overtime, comp-offs)",
    "Finance system (Tally/Zoho Books/ERP/spreadsheets)",
    "Filing responsibilities (in-house vs CA)",
  ]);

  hr(doc);
  sectionTitle(doc, "Step 1 — Compliance areas to validate (India)");
  paragraph(doc, "Use the sections below as demo prompts. Ask to see reports/exports — not just slides.");

  sectionTitle(doc, "PF (Provident Fund)");
  bullets(doc, [
    "Coverage rules supported (thresholds, exceptions)",
    "Handling of arrears and reversals (backdated changes)",
    "Month-end PF summary and challan workflow",
  ]);
  callout(doc, {
    title: "Demo scenario",
    body: "Employee gets a backdated increment and arrears. PF should recalculate correctly and remain reconcilable.",
  });
  bullets(doc, [
    "How do you handle PF wage ceilings and exemptions?",
    "Can we export PF employee-wise contribution details?",
    "Do you keep an audit trail for overrides?",
  ]);

  finishPage();

  // Page 3 — ESI + PT + TDS
  doc.addPage();
  page++;
  header(doc, {
    title: "Step 1 (cont.) — Compliance checks",
    subtitle: "The goal: predictable statutory outputs + clean reconciliation at month-end.",
  });

  sectionTitle(doc, "ESI");
  bullets(doc, [
    "Applicability rules and transitions",
    "Joiners/exits handling",
    "ESI contribution reports + reconciliation",
  ]);
  callout(doc, {
    title: "Red flag",
    body: "Vendor can’t explain month-to-month applicability changes or how exceptions are handled.",
  });

  sectionTitle(doc, "Professional Tax (PT)");
  paragraph(doc, "PT is where many tools fail for multi-state SMEs.");
  bullets(doc, [
    "PT support for each state you operate in",
    "Transfers between states/locations",
    "Export formats and reconciliation",
  ]);
  callout(doc, {
    title: "Ask explicitly",
    body: "Show PT for two states in one month (with sample employees) and explain the mapping rules.",
  });

  sectionTitle(doc, "TDS / income tax outputs (where applicable)");
  bullets(doc, [
    "Investment declaration workflow (if provided)",
    "Form 16 support approach",
    "Clean data outputs for filing processes",
  ]);
  paragraph(doc, "Even if you use a CA, you need clean, consistent data.");

  finishPage();

  // Page 4 — Step 2 month-end operations
  doc.addPage();
  page++;
  header(doc, {
    title: "Step 2 — Month-end operations (where payroll fails)",
    subtitle: "Compliance rules are necessary, but payroll fails on process. Validate these workflows end-to-end.",
  });

  sectionTitle(doc, "Attendance → payroll handoff");
  checklist(doc, [
    "How do you lock attendance for the month?",
    "Are overtime/late deductions approved?",
    "How are missed punches handled?",
    "Are exceptions visible in one place?",
    "If attendance is manual, can we do repeatable imports?",
  ]);

  sectionTitle(doc, "Exceptions and corrections");
  checklist(doc, [
    "Can you run a dry run payroll?",
    "Can you revert and rerun safely?",
    "Is there an audit trail for overrides?",
    "Can you compare “this month vs last month” quickly?",
  ]);

  callout(doc, {
    title: "High-risk pattern",
    body: "A payroll system without safe reruns (and clear change history) is high risk.",
  });

  sectionTitle(doc, "Full & final settlement");
  bullets(doc, [
    "Full & final settlement steps",
    "Leave encashment rules",
    "Recoveries/advances",
    "Variable pay inclusion rules",
  ]);
  callout(doc, {
    title: "Demo scenario",
    body: "Employee exits mid-month with pending recoveries and variable pay. Run it end-to-end.",
  });

  finishPage();

  // Page 5 — Step 3 reports
  doc.addPage();
  page++;
  header(doc, {
    title: "Step 3 — Reports you must demand",
    subtitle: "Ask for anonymized samples (PDF/export). If the vendor won’t share sample outputs, treat it as risk.",
  });

  sectionTitle(doc, "Minimum set");
  checklist(doc, [
    "Payroll register",
    "Payslip",
    "Statutory summaries (PF/ESI/PT)",
    "Employee-wise contribution reports",
    "Variance report vs last month",
    "Audit log / change history",
  ]);

  sectionTitle(doc, "Reconciliation-friendly outputs");
  checklist(doc, [
    "Totals by cost center/location",
    "Bank advice / payout export",
    "Adjustments log (arrears, reversals)",
  ]);

  callout(doc, {
    title: "Reality check",
    body: "If you can’t reconcile totals to bank advice + statutory summaries, month-end becomes Excel firefighting.",
  });

  sectionTitle(doc, "Integration posture (keep it boring)");
  bullets(doc, [
    "Month 1: exports only",
    "Month 2: mapping + repeatable import",
    "Month 3: automation (if stable)",
  ]);
  paragraph(doc, "Define owners: HR vs Finance.");

  finishPage();

  // Page 6 — Step 5 implementation + failure modes
  doc.addPage();
  page++;
  header(doc, {
    title: "Step 5 — Implementation questions + failure modes",
    subtitle: "Evaluate rollout readiness, not just features.",
  });

  sectionTitle(doc, "Implementation questions");
  checklist(doc, [
    "Who configures statutory settings — vendor or you?",
    "What data templates are required?",
    "Typical timeline for your size and states?",
    "What happens during first month-end? Is there dedicated support?",
    "Escalation path if payroll is blocked?",
  ]);

  sectionTitle(doc, "Common failure modes (watch for these)");
  bullets(doc, [
    "Over-customized salary structures",
    "Attendance rules not aligned with payroll cutoffs",
    "Multi-state PT handled manually",
    "No audit trail for overrides",
    "Reports change after reruns",
  ]);

  sectionTitle(doc, "Quick vendor scorecard (1–5 each)");
  checklist(doc, [
    "PF/ESI/PT/TDS coverage",
    "Multi-state readiness",
    "Month-end reconciliation outputs",
    "Rerun/rollback safety",
    "Support SLA quality",
    "Auditability (logs + exports)",
  ]);

  finishPage();

  // Page 7 — 20-minute drill + success criteria
  doc.addPage();
  page++;
  header(doc, {
    title: "The 20-minute vendor evaluation drill",
    subtitle: "If you only have 20 minutes with a vendor, do this. Vague answers = risk.",
  });

  sectionTitle(doc, "Do this in order");
  checklist(doc, [
    "Ask them to show sample PF/ESI/PT reports (PDF/export)",
    "Ask how they handle arrears + reversals",
    "Ask how they rerun payroll safely",
    "Ask the support SLA during month-end",
  ]);

  hr(doc);
  sectionTitle(doc, "Implementation success criteria (before go-live)");
  checklist(doc, [
    "Attendance lock and exception workflow are defined",
    "Payroll dry run completed",
    "Exports match finance expectations",
    "Escalation path is tested",
  ]);

  callout(doc, {
    title: "Tip",
    body: "Pick one real employee scenario (transfer + arrears + cutoff) and ask the vendor to run it live.",
  });

  finishPage();

  // Page 8 — Copy/paste email + finance + controls + CTA
  doc.addPage();
  page++;
  header(doc, {
    title: "Copy/paste: must-have reports + controls",
    subtitle: "Use this to keep vendor follow-ups consistent across HR + Finance.",
  });

  sectionTitle(doc, "Ask vendors to share anonymized samples of");
  checklist(doc, [
    "Payroll register",
    "Payslip",
    "PF/ESI/PT summaries",
    "Employee-wise contribution details",
    "Variance report vs last month",
    "Audit log / change history",
  ]);
  paragraph(doc, "If they cannot share samples, ask to screen-share live during the demo.");

  sectionTitle(doc, "What to ask your finance team");
  checklist(doc, [
    "What exports do you need monthly?",
    "Do you need cost center/location splits?",
    "Do you reconcile payroll totals with bank advice?",
    "What format does Tally/Zoho Books accept?",
  ]);

  sectionTitle(doc, "Controls & governance (simple but essential)");
  checklist(doc, [
    "Who can edit salary components?",
    "Who can override attendance inputs?",
    "Who approves reruns?",
    "How long are payroll outputs retained and where?",
  ]);

  callout(doc, {
    title: "Final note",
    body: `Want a compliance-first shortlist? Visit ${BRAND.url}/recommend.`,
  });

  finishPage();

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

await createPdf();
console.log(`Wrote: ${OUT_PATH}`);
