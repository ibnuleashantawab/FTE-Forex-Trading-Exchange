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
        gold: {
          300: "#F3E5AB",
          400: "#E6C665",
          500: "#D4AF37",
          600: "#AA7C11",
          700: "#85600E",
        },
        silver: {
          300: "#F0F0F0",
          400: "#E0E0E0",
          500: "#C0C0C0",
          600: "#9E9E9E",
        },
        obsidian: {
          950: "#07090D",
          900: "#0B0E14",
          850: "#0F141D",
          800: "#131822",
          750: "#181E2C",
          700: "#1C2433",
          600: "#232D3F",
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #AA7C11 100%)",
        "gold-gradient-shine": "linear-gradient(90deg, #D4AF37 0%, #FFF3C4 50%, #D4AF37 100%)",
        "silver-gradient": "linear-gradient(135deg, #FFFFFF 0%, #C0C0C0 50%, #808080 100%)",
        "obsidian-card-gradient": "linear-gradient(180deg, rgba(19, 24, 34, 0.9) 0%, rgba(15, 20, 29, 0.95) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
