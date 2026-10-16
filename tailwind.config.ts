import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: "#fdf2f4",
          100: "#fce7eb",
          200: "#f8d2da",
          300: "#f2adbc",
          400: "#e97d96",
          500: "#db4f71",
          600: "#c52d54",
          700: "#9e1c3f",
          800: "#800020",
          900: "#5e0017",
          950: "#4A0014",
        },
      },
      backgroundImage: {
        "burgundy-gradient": "linear-gradient(135deg, #800020 0%, #4A0014 100%)",
        "burgundy-gradient-hover": "linear-gradient(135deg, #920025 0%, #5c0019 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
