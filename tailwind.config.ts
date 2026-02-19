import type { Config } from "tailwindcss";

// Tailwind v4 works without config, but we keep this lightweight file
// to define brand tokens and ensure consistent UI.
// DESIGN_SYSTEM.md tokens are mirrored here for Tailwind utilities.

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Global tokens (prefer CSS vars so components can evolve without churn)
        primary: "var(--primary-blue)",
        primaryDark: "var(--primary-dark)",
        surface: {
          bg: "var(--bg)",
          0: "var(--surface-0)",
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          grey: "var(--surface-grey)",
        },
        text: {
          main: "var(--text-main)",
          muted: "var(--text-muted-base)",
        },
        border: {
          soft: "var(--border-soft)",
        },
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        float: "var(--shadow-float)",
        glow: "var(--shadow-glow)",
      },
      fontSize: {
        h1: ["52px", { lineHeight: "1.1" }],
        h2: ["36px", { lineHeight: "1.2" }],
        h3: ["24px", { lineHeight: "1.25" }],
        body: ["16px", { lineHeight: "1.6" }],
        sm: ["14px", { lineHeight: "1.6" }],
      },
      fontWeight: {
        bold: "700",
        semibold: "600",
        regular: "400",
      },
    },
  },
} satisfies Config;
