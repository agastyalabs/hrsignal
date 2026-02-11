"use client";

import * as React from "react";

import { Button, ButtonLink } from "@/components/ui/Button";
import { StructuredLeadModal } from "@/components/leads/StructuredLeadModal";

export function StickyCtas({
  compareHref,
  shortlistHref,
}: {
  compareHref: string | null;
  shortlistHref: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="sticky top-24 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-4">
      <div className="text-sm font-semibold text-[var(--text)]">Next actions</div>
      <div className="mt-1 text-sm text-[var(--text-muted)]">Compare, shortlist, then export/print.</div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        {compareHref ? (
          <ButtonLink href={compareHref} variant="secondary" size="md" className="w-full justify-center">
            Compare
          </ButtonLink>
        ) : null}

        <Button type="button" variant="primary" size="md" className="w-full justify-center" onClick={() => setOpen(true)}>
          Shortlist / get intro
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="md"
          className="w-full justify-center"
          onClick={() => window.print()}
        >
          Export PDF (print)
        </Button>
      </div>

      <div className="mt-3 text-xs leading-5 text-[var(--text-muted)]">Tip: export works best from desktop Chrome/Edge.</div>

      <StructuredLeadModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmitted={() => {
          setOpen(false);
          // Keep existing routing: proceed to the shortlist flow.
          window.location.assign(shortlistHref);
        }}
      />
    </div>
  );
}
