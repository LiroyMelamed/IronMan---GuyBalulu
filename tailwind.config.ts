import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terex: {
          gray: "#F2F2F2",
          navy: "#1A3668",
          blue: "#2E5AAC",
          charcoal: "#1A1A1A",
          muted: "#8A8A8A",
          white: "#FFFFFF",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        sans: ["var(--font-heebo)", "system-ui", "sans-serif"],
        mono: ["var(--font-rubik-mono)", "monospace"],
      },
      borderRadius: {
        lg: "0",
        md: "0",
        sm: "0",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
