import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: "#FFD1DC",
          mint: "#B5EAD7",
          blue: "#C7CEEA",
          yellow: "#FFF5BA",
          purple: "#E2F0CB",
        },
      },
    },
  },
  plugins: [],
};

export default config;
