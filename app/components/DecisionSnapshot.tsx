import Image from "next/image";
import Link from "next/link";

function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  return <Image src={`/icons/${name}.svg`} alt="" width={24} height={24} className={className} aria-hidden />;
}

export function DecisionSnapshot() {
  return (
    <section className="rounded-2xl border border-[rgba(100,116,139,0.25)] bg-[var(--color-light-bg)] p-6">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 overflow-hidden rounded-xl border border-[rgba(100,116,139,0.25)] bg-white">
          <Image
            src="/placeholders/vendor.svg"
            alt="Vendor logo"
            width={48}
            height={48}
            className="h-full w-full object-contain p-2"
          />
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold text-[var(--color-primary)]">Decision snapshot</div>
          <div className="mt-1 text-sm text-[var(--color-neutral)]">Example output (v1)</div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Radial score */}
        <div className="relative h-20 w-20 shrink-0">
          <div className="absolute inset-0 rounded-full border-4 border-[rgba(11,95,111,0.25)] bg-white" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-[36px] font-bold leading-none text-[var(--color-primary)]">92</div>
              <div className="-mt-1 text-xs font-semibold text-[var(--color-neutral)]">/100</div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="grid gap-2">
            {[
              "PF/ESI/PT/TDS checklist included",
              "Evidence links attached to key claims",
              "Cutover + multi-location risks called out",
            ].map((t) => (
              <div key={t} className="flex items-start gap-2">
                <Icon name="checkmark" className="mt-0.5 h-5 w-5" />
                <div className="text-sm text-[var(--color-neutral)]">{t}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-[rgba(11,95,111,0.10)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
              India-ready
            </span>
            <span className="inline-flex items-center rounded-full bg-[rgba(34,197,94,0.12)] px-3 py-1 text-xs font-semibold text-[var(--color-verified)]">
              Evidence-backed
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/recommend"
          className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[var(--color-accent)] px-6 text-sm font-bold text-white transition-all duration-200 hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          See Full Shortlist
        </Link>
      </div>
    </section>
  );
}
