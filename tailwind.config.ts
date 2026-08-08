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
        ink: "#18181b",
        paper: "#ffffff",
        signal: "#c9ff3d",
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
        signal: "0 0 0 1px rgba(201,255,61,.2), 0 26px 90px rgba(154,220,0,.18)",
      },
    },
  },
  plugins: [],
};

export default config;
