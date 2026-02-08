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
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] motion-reduce:transition-none ${className}`}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? (
        <span aria-hidden="true">☾</span>
      ) : (
        <span aria-hidden="true">☼</span>
      )}
    </button>
  );
}
