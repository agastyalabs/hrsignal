import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          HRSignal
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className="text-zinc-700 hover:underline" href="/tools">
            Tools
          </Link>
          <Link className="text-zinc-700 hover:underline" href="/vendors">
            Vendors
          </Link>
          <Link className="rounded-full bg-black px-4 py-2 text-white" href="/stack-builder">
            Get recommendations
          </Link>
        </nav>
      </div>
    </header>
  );
}
