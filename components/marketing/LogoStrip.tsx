const companies = [
  "Shree Logistics Pvt Ltd",
  "Sahyadri Engineering",
  "Kaveri Foods",
  "BluePeak Retail",
  "NovaFin Services",
] as const;

export function LogoStrip({ title = "Early access teams" }: { title?: string }) {
  return (
    <section className="rounded-2xl border border-[#1F2937] bg-[#111827] p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{title}</div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {companies.map((name) => (
          <div
            key={name}
            className="flex items-center justify-center rounded-xl border border-[#1F2937] bg-[#0F172A] px-3 py-3 text-center text-xs font-semibold text-[#CBD5E1]"
          >
            {name}
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-[#94A3B8]">Early access customers (logos updated on approval).</div>
    </section>
  );
}
