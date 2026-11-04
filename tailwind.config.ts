import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zovra: {
          black: "#111111",
          white: "#FFFFFF",
          softBlue: "#DCEEFF",
          softBlueLight: "#EEF6FF",
          deepBlue: "#244B70",
          deepBlueDark: "#1A3650",
          lightGrey: "#F5F6F7",
          borderGrey: "#E5E7EB",
          charcoal: "#1F2428",
          mutedText: "#555A60",
          subtleText: "#8E959E",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 4px 12px -2px rgba(17, 17, 17, 0.04), 0 2px 6px -1px rgba(17, 17, 17, 0.03)",
        elevated: "0 12px 30px -8px rgba(17, 17, 17, 0.08), 0 4px 10px -2px rgba(17, 17, 17, 0.03)",
      },
    },
  },
  plugins: [],
} satisfies Config;
