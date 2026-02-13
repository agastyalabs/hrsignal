import Image from "next/image";

function Icon({ name }: { name: string }) {
  return <Image src={`/icons/${name}.svg`} alt="" width={48} height={48} className="h-12 w-12" aria-hidden />;
}

function Step({
  icon,
  title,
  desc,
  mock,
}: {
  icon: string;
  title: string;
  desc: string;
  mock: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[rgba(100,116,139,0.25)] bg-white p-6">
      <Icon name={icon} />
      <h3 className="mt-4 text-[var(--color-primary)]" style={{ fontSize: "var(--size-h3)", fontWeight: "var(--weight-semibold)" }}>
        {title}
      </h3>
      <p className="mt-2 text-[var(--color-neutral)]" style={{ fontSize: "var(--size-body)" }}>
        {desc}
      </p>
      <div className="mt-4">{mock}</div>
    </div>
  );
}

function DashedArrow() {
  return (
    <div className="hidden items-center justify-center px-2 lg:flex" aria-hidden>
      <div className="h-px w-16 border-t border-dashed border-[rgba(100,116,139,0.55)]" />
      <div className="ml-2 h-2 w-2 rotate-45 border-r border-t border-[rgba(100,116,139,0.55)]" />
    </div>
  );
}

export function ProcessFlow() {
  return (
    <section className="bg-[var(--color-light-bg)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <Step
            icon="puzzle"
            title="Define Your Constraints"
            desc="Capture headcount, modules, integrations, and compliance complexity in a simple form."
            mock={
              <div className="grid gap-2">
                <div className="h-9 rounded-lg bg-[rgba(240,249,250,0.9)]" />
                <div className="h-9 rounded-lg bg-[rgba(240,249,250,0.9)]" />
                <div className="h-9 w-8/12 rounded-lg bg-[rgba(240,249,250,0.9)]" />
              </div>
            }
          />

          <DashedArrow />

          <Step
            icon="target"
            title="Get Explainable Shortlist"
            desc="See 3–5 best-fit vendors with deterministic reasons and validation checkpoints."
            mock={
              <div className="grid gap-2">
                {["Vendor A", "Vendor B", "Vendor C"].map((v) => (
                  <div key={v} className="rounded-lg border border-[rgba(100,116,139,0.20)] bg-[var(--color-light-bg)] px-3 py-2">
                    <div className="text-sm font-semibold text-[var(--color-dark)]">{v}</div>
                    <div className="mt-1 text-xs text-[var(--color-neutral)]">Fit score + reasons</div>
                  </div>
                ))}
              </div>
            }
          />

          <DashedArrow />

          <Step
            icon="scale"
            title="Compare with Confidence"
            desc="Side-by-side comparisons: features, compliance outputs, integrations, and risk flags."
            mock={
              <div className="overflow-hidden rounded-lg border border-[rgba(100,116,139,0.20)]">
                <div className="grid grid-cols-3 bg-[rgba(240,249,250,0.9)] px-3 py-2 text-xs font-semibold text-[var(--color-primary)]">
                  <div>Criteria</div>
                  <div>Vendor A</div>
                  <div>Vendor B</div>
                </div>
                {["PF/ESI", "Audit logs", "Multi-state"].map((r) => (
                  <div key={r} className="grid grid-cols-3 px-3 py-2 text-xs text-[var(--color-neutral)]">
                    <div className="text-[var(--color-dark)]">{r}</div>
                    <div>✓</div>
                    <div>—</div>
                  </div>
                ))}
              </div>
            }
          />
        </div>

        {/* Mobile dividers */}
        <div className="mt-6 grid gap-2 text-sm text-[var(--color-neutral)] lg:hidden">
          <div className="h-px w-full bg-[rgba(100,116,139,0.20)]" />
          <div className="h-px w-full bg-[rgba(100,116,139,0.20)]" />
        </div>
      </div>
    </section>
  );
}
