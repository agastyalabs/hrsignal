import type { Config } from "tailwindcss";

// Tailwind v4 works without config, but we keep this lightweight file
// to define brand tokens and ensure consistent UI.

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1D4ED8",
          green: "#10B981",
          black: "#000000",
          white: "#FFFFFF",
        },
      },
    },
  },
} satisfies Config;
