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
        primary: "#0B5F6F",
        accent: "#D4A574",
        verified: "#22C55E",
        validate: "#F59E0B",
        neutral: "#64748B",
        light_bg: "#F0F9FA",

        brand: {
          blue: "#1D4ED8",
          green: "#10B981",
          black: "#000000",
          white: "#FFFFFF",
        },
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
