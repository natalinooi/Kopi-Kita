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
          canvas: "#F8F5F0", // Warm Oat Milk Cream
          espresso: "#2B170B", // Dark Roast CTA & brand
          card: "#FFFFFF", // Card surface
          border: "#E8DED1", // Border color
          mocha: "#7A5C43", // Mocha accent
          sage: "#4F6D48", // Muted sage green
          amber: "#C4823F", // Warm amber
          sand: "#EDE5DB", // Sand container
          light: "#FAF7F2",
          muted: "#8C786A",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        'card': '16px',
        '2card': '20px',
        '3card': '24px',
      },
      boxShadow: {
        warm: "0 4px 20px -2px rgba(43, 23, 11, 0.05), 0 2px 6px -1px rgba(43, 23, 11, 0.03)",
        'warm-lg': "0 10px 25px -3px rgba(43, 23, 11, 0.08), 0 4px 10px -2px rgba(43, 23, 11, 0.04)",
        'warm-xl': "0 20px 35px -5px rgba(43, 23, 11, 0.12), 0 8px 16px -4px rgba(43, 23, 11, 0.06)",
        'bottom-bar': "0 -4px 20px rgba(43, 23, 11, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
