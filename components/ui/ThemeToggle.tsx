"use client";

import { useEffect, useState } from "react";

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function getInitialTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("hrsignal_theme");
  if (stored === "light" || stored === "dark") return stored;
  return getSystemTheme();
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">(() => getInitialTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("hrsignal_theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] px-3 text-xs font-semibold text-[var(--text)] transition-all duration-200 hover:bg-[var(--surface-2)] hover:-translate-y-0.5 motion-reduce:transition-none ${className}`}
      aria-label="Toggle theme"
    >
      <span className="text-[var(--text-muted)]">Theme</span>
      <span>{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
