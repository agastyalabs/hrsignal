"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";

type Role = "Founder" | "Marketing" | "Product";

export default function VendorClaimPage() {
  const sp = useSearchParams();
  const tool = sp.get("tool") || "";

  const [email, setEmail] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [role, setRole] = React.useState<Role>("Founder");
  const [message, setMessage] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">Claim your HRSignal profile</h1>
          <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
            Share your work email and a few details. We’ll follow up to verify ownership and help you enhance your listing.
          </p>

          <Card className="mt-6 border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
            {!submitted ? (
              <form
                className="grid grid-cols-1 gap-4 lg:grid-cols-12"
                onSubmit={(e) => {
                  e.preventDefault();
                  // No backend yet (v1). Local state only.
                  setSubmitted(true);
                }}
              >
                <div className="lg:col-span-7">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Work email</label>
                  <Input
                    className="mt-1"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                </div>

                <div className="lg:col-span-5">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Role</label>
                  <Select className="mt-1" value={role} onChange={(e) => setRole(e.target.value as Role)}>
                    <option value="Founder">Founder</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Product">Product</option>
                  </Select>
                </div>

                <div className="lg:col-span-12">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Company name</label>
                  <Input
                    className="mt-1"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company"
                  />
                </div>

                <div className="lg:col-span-12">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Message (optional)</label>
                  <Textarea
                    className="mt-1"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What would you like to update (pricing, integrations, compliance scope, evidence links, etc.)?"
                  />
                  {tool ? (
                    <div className="mt-2 text-xs text-[var(--text-muted)]">
                      Requested from vendor page: <span className="font-mono">{tool}</span>
                    </div>
                  ) : null}
                </div>

                <div className="lg:col-span-12">
                  <Button type="submit" variant="primary" className="w-full justify-center sm:w-auto">
                    Submit
                  </Button>
                  <div className="mt-2 text-xs text-[var(--text-muted)]">We only use this to verify ownership and coordinate updates.</div>
                </div>
              </form>
            ) : (
              <div className="rounded-[var(--radius-lg)] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] p-5">
                <div className="text-sm font-semibold text-[var(--text)]">Thanks — we’ve received your request.</div>
                <div className="mt-1 text-sm leading-7 text-[var(--text-muted)]">
                  We’ll follow up on <span className="font-semibold text-[var(--text)]">{email || "your email"}</span> with next steps.
                </div>
              </div>
            )}
          </Card>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
