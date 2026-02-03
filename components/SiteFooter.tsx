export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-10 sm:grid-cols-3">
        <div>
          <div className="text-sm font-semibold">HRSignal</div>
          <p className="mt-2 text-sm text-zinc-600">
            India-first HR software discovery for SMEs: HRMS, payroll compliance, attendance, ATS, performance.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Explore</div>
          <ul className="mt-2 space-y-1 text-sm text-zinc-600">
            <li>
              <a className="hover:underline" href="/tools">
                Browse tools
              </a>
            </li>
            <li>
              <a className="hover:underline" href="/vendors">
                Browse vendors
              </a>
            </li>
            <li>
              <a className="hover:underline" href="/stack-builder">
                Stack Builder
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Trust</div>
          <ul className="mt-2 space-y-1 text-sm text-zinc-600">
            <li>Explainable recommendations</li>
            <li>India-first compliance notes</li>
            <li>Lead shared with one best-fit vendor</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-zinc-500">© {new Date().getFullYear()} HRSignal</div>
    </footer>
  );
}
