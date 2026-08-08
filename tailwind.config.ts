import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        paper: "#f4f4ef",
        signal: "#c7ff4a",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Aptos",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "SFMono-Regular",
          "Cascadia Code",
          "Roboto Mono",
          "monospace",
        ],
      },
      letterSpacing: {
        tighter: "-0.045em",
      },
      boxShadow: {
        signal: "0 0 0 1px rgba(199,255,74,.14), 0 26px 90px rgba(199,255,74,.08)",
      },
    },
  },
  plugins: [],
};

export default config;
