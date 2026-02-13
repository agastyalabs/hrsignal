import Image from "next/image";

function Icon({ name }: { name: string }) {
  return <Image src={`/icons/${name}.svg`} alt="" width={48} height={48} className="h-12 w-12" aria-hidden />;
}

function TrustCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-[rgba(100,116,139,0.25)] bg-[var(--color-light-bg)] p-6 transition-all duration-200 md:hover:scale-[1.02] md:hover:border-[var(--color-accent)]">
      <Icon name={icon} />
      <h3
        className="mt-4 text-[var(--color-primary)]"
        style={{ fontSize: "var(--size-h3)", fontWeight: "var(--weight-semibold)" }}
      >
        {title}
      </h3>
      <p className="mt-2 text-[var(--color-neutral)]" style={{ fontSize: "var(--size-body)" }}>
        {desc}
      </p>
    </div>
  );
}

export function TrustCards() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <TrustCard
            icon="link"
            title="Every Claim Has Evidence"
            desc="Key claims are tied to sources so you can verify fast during demos and internal review."
          />
          <TrustCard
            icon="clock"
            title="You Know What’s Verified"
            desc="Freshness signals help you spot what needs re-checking before month‑end and cutover."
          />
          <TrustCard
            icon="map-india"
            title="Built for India’s Complexity"
            desc="Payroll compliance, multi-state edge cases, and audit readiness are treated as first‑class requirements."
          />
        </div>
      </div>
    </section>
  );
}
