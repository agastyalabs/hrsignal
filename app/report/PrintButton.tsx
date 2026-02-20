"use client";

export function PrintButton({ disabled }: { disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-11 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary)] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      disabled={disabled}
      aria-disabled={disabled}
      title={disabled ? "Generate a report first" : ""}
    >
      Print / Save as PDF
    </button>
  );
}
