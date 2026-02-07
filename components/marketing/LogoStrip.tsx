import Image from "next/image";

const logos = [
  { src: "/logos/vendors/acme.svg", alt: "Acme (placeholder)" },
  { src: "/logos/vendors/globex.svg", alt: "Globex (placeholder)" },
  { src: "/logos/vendors/initech.svg", alt: "Initech (placeholder)" },
  { src: "/logos/vendors/umbrella.svg", alt: "Umbrella (placeholder)" },
  { src: "/logos/vendors/soylent.svg", alt: "Soylent (placeholder)" },
] as const;

export function LogoStrip({ title = "Works with your stack" }: { title?: string }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{title}</div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {logos.map((l) => (
          <div key={l.src} className="flex items-center justify-center rounded-xl bg-zinc-50 p-3">
            <Image
              src={l.src}
              alt={l.alt}
              width={240}
              height={80}
              className="h-10 w-auto opacity-80"
            />
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-zinc-500">Placeholder logos for launch — replace with approved vendor marks.</div>
    </section>
  );
}
