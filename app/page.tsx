import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="HRSignal logo"
          width={100}
          height={20}
          priority
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50">
            HRSignal – your AI guide to HR software for Indian SMEs &amp; MSMEs.
          </h1>

          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A focused discovery platform only for the HR ecosystem – HRMS, payroll,
            background verification, LMS, recruitment, performance and engagement.
            Tell us about your team and budget, and our AI shortlists the tools
            that actually fit your business.
          </p>

          <ul className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Only HR:
              </span>{" "}
              No CRMs or ERPs – just the HR stack.
            </li>
            <li>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                India‑first:
              </span>{" "}
              Built for Indian SMEs &amp; MSMEs – pricing, compliance and support
              realities here.
            </li>
            <li>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                AI‑assisted:
              </span>{" "}
              Compare features, pricing and reviews in minutes, not weeks of demos.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row mt-8">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[190px]"
            href="#get-started"
          >
            Get recommendations
          </a>

          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[190px]"
            href="mailto:founders@hrsignal.in?subject=HRSignal%20%E2%80%93%20Help%20me%20choose%20HR%20software"
          >
            Talk to an expert
          </a>
        </div>
      </main>
    </div>
  );
}