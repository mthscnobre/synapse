// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Adicione esta linha
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // ... seu tema existente
  },
  plugins: [],
};
export default config;
