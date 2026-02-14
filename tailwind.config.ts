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
        // Sprint token set (DESIGN_SYSTEM.md)
        primary: "#0B5F6F",
        accent: "#D4A574",
        verified: "#22C55E",
        validate: "#F59E0B",
        neutral: "#64748B",
        light_bg: "#F0F9FA",

        // Runtime UI palette (dark-first)
        brand: {
          blue: "#1D4ED8",
          green: "#10B981",
          slate: "#0F172A",
          black: "#000000",
          white: "#FFFFFF",
        },
      },
      boxShadow: {
        soft: "0 12px 34px rgba(0,0,0,0.35)",
        glowGreen: "0 18px 52px rgba(16,185,129,0.18)",
        glowBlue: "0 18px 52px rgba(29,78,216,0.16)",
      },
      backgroundImage: {
        // Spec: radial-gradient emerald 1px, transparent 1px, size 20px, opacity 0.05
        "neural-dots": "radial-gradient(circle at 1px 1px, rgba(16,185,129,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        "neural-dots": "20px 20px",
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
