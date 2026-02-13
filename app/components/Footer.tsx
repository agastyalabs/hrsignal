"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok">("idle");

  return (
    <footer>
      {/* Top subscription */}
      <div className="bg-[var(--color-light-bg)] border-t border-[rgba(100,116,139,0.20)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h3
                className="text-[var(--color-primary)]"
                style={{ fontSize: "var(--size-h3)", fontWeight: "var(--weight-semibold)" }}
              >
                Get Monthly Payroll Compliance Updates
              </h3>
              <p className="mt-2 text-[var(--color-neutral)]" style={{ fontSize: "var(--size-body)" }}>
                Short, practical updates on PF/ESI/PT/TDS and evaluation traps — designed for Indian HR + Finance teams.
              </p>
              <div className="mt-3 text-[14px] text-[var(--color-neutral)]">
                We respect privacy. Unsubscribe anytime.
              </div>
            </div>

            <div className="lg:col-span-5">
              <form
                className="flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!email.trim()) return;
                  // Client-only mock; wire to /api/leads if desired.
                  setStatus("ok");
                }}
              >
                <label className="sr-only" htmlFor="footer-email">
                  Email
                </label>
                <input
                  id="footer-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@company.com"
                  className="h-12 w-full rounded-lg border border-[rgba(100,116,139,0.35)] bg-white px-4 text-sm text-[var(--color-dark)] placeholder:text-[rgba(100,116,139,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                />

                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-[var(--color-accent)] px-6 text-sm font-bold text-white transition-all duration-200 hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                >
                  Subscribe
                </button>
              </form>

              {status === "ok" ? (
                <div className="mt-2 text-sm font-semibold text-[var(--color-primary)]">Subscribed (demo UI).</div>
              ) : null}

              <div className="mt-2 text-[14px] text-[var(--color-neutral)]">
                Trust: We won’t share your email with vendors.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="bg-white border-t border-[rgba(100,116,139,0.20)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Link href="/" aria-label="HRSignal home" className="inline-flex items-center">
                <Image
                  src="/assets/logos/new-hrsignal.svg"
                  alt="HRSignal"
                  width={240}
                  height={60}
                  className="h-[60px] w-auto"
                />
              </Link>
              <p className="mt-3 text-sm text-[var(--color-neutral)]">
                India-first HR software recommendations with evidence links, verification signals, and checklists.
              </p>
            </div>

            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="text-sm font-bold text-[var(--color-primary)]">Product</div>
                  <div className="mt-3 space-y-2 text-sm">
                    <Link className="block text-[var(--color-neutral)] hover:text-[var(--color-primary)]" href="/recommend">
                      Find your tool
                    </Link>
                    <Link className="block text-[var(--color-neutral)] hover:text-[var(--color-primary)]" href="/tools">
                      Tools
                    </Link>
                    <Link className="block text-[var(--color-neutral)] hover:text-[var(--color-primary)]" href="/vendors">
                      Vendors
                    </Link>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-bold text-[var(--color-primary)]">Resources</div>
                  <div className="mt-3 space-y-2 text-sm">
                    <Link className="block text-[var(--color-neutral)] hover:text-[var(--color-primary)]" href="/resources">
                      Guides
                    </Link>
                    <Link className="block text-[var(--color-neutral)] hover:text-[var(--color-primary)]" href="/methodology">
                      Methodology
                    </Link>
                    <Link
                      className="block text-[var(--color-neutral)] hover:text-[var(--color-primary)]"
                      href="/india-payroll-risk-checklist"
                    >
                      Checklist
                    </Link>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-bold text-[var(--color-primary)]">Company</div>
                  <div className="mt-3 space-y-2 text-sm">
                    <Link className="block text-[var(--color-neutral)] hover:text-[var(--color-primary)]" href="/privacy">
                      Privacy
                    </Link>
                    <Link className="block text-[var(--color-neutral)] hover:text-[var(--color-primary)]" href="/terms">
                      Terms
                    </Link>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-bold text-[var(--color-primary)]">Contact</div>
                  <div className="mt-3 space-y-2 text-sm text-[var(--color-neutral)]">
                    <div>hello@hrsignal.in</div>
                    <div>India-first buyer support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-xs text-[var(--color-neutral)]">
            © {new Date().getFullYear()} HRSignal. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
