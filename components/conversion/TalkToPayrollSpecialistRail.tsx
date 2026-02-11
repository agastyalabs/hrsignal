import Link from "next/link";

import { Card } from "@/components/ui/Card";

export function TalkToPayrollSpecialistRail({
  href = "/recommend",
}: {
  href?: string;
}) {
  return (
    <div className="hidden lg:block">
      <div className="fixed right-6 top-24 z-40 w-[280px]">
        <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-4 shadow-none">
          <div className="text-sm font-semibold text-[var(--text)]">Talk to Payroll Specialist</div>
          <div className="mt-1 text-sm text-[var(--text-muted)]">
            Get a focused intro and month-end risk checklist for your setup.
          </div>
          <div className="mt-4">
            <Link
              href={href}
              className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              Check fit →
            </Link>
          </div>
          <div className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
            Subtle, no spam. Deterministic scoring. No paid ranking.
          </div>
        </Card>
      </div>
    </div>
  );
}
