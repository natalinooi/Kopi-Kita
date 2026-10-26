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
        kopi: {
          cream: "#F5EFEB", // Soft oat milk cream background
          espresso: "#2B170B", // Deep espresso dark roast
          card: "#FFFFFF", // Card surface
          border: "#E8DED1", // Warm border
          mocha: "#7A5C43", // Mocha accent
          sage: "#4F6D48", // Muted sage green for ready/paid
          amber: "#C4823F", // Warm amber for brewing
          dark: "#1A0E06", // Darker espresso
          sand: "#EFE6DC", // Sand cream container
          light: "#FAF7F2", // Ultra soft card highlight
          muted: "#8C786A", // Muted earth-tone text
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        warm: "0 4px 20px -2px rgba(43, 23, 11, 0.05), 0 2px 6px -1px rgba(43, 23, 11, 0.03)",
        'warm-lg': "0 10px 25px -3px rgba(43, 23, 11, 0.08), 0 4px 10px -2px rgba(43, 23, 11, 0.04)",
        'warm-xl': "0 20px 35px -5px rgba(43, 23, 11, 0.12), 0 8px 16px -4px rgba(43, 23, 11, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
