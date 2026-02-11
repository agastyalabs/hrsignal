import Link from "next/link";

import { Card } from "@/components/ui/Card";

export function TalkToPayrollSpecialistSection({
  href = "/recommend",
}: {
  href?: string;
}) {
  return (
    <Card className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-[var(--text)]">Talk to a Payroll Specialist</div>
          <div className="mt-1 text-sm text-[var(--text-muted)]">
            Get a focused intro and a month-end risk checklist tailored to multi-state India payroll.
          </div>
          <div className="mt-2 text-xs text-[var(--text-muted)]">Used by HR leaders • Deterministic scoring • No paid ranking</div>
        </div>

        <div className="shrink-0">
          <Link
            href={href}
            className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto"
          >
            Find my vendor
          </Link>
        </div>
      </div>
    </Card>
  );
}
