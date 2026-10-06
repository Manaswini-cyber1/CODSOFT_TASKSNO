import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1b2a4a",
        "ink-soft": "#47547a",
        parchment: "#f7f3ea",
        "parchment-raised": "#fffdf9",
        rule: "#d9cfbb",
        gold: "#b8863b",
        "gold-soft": "#e4c98f",
        forest: "#3f6b4f",
        burgundy: "#7a2e2e",
      },
      fontFamily: {
        display: ["Source Serif 4", "Georgia", "serif"],
        sans: ["IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "4px",
      },
    },
  },
  plugins: [],
};

export default config;