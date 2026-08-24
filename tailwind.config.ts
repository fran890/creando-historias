import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          500: '#e91e63', // Primary Pink/Magenta from reference site
          600: '#d81b60',
          700: '#c2185b',
          800: '#9c27b0', // Deep Purple
          900: '#880e4f',
        },
        editorial: {
          bg: '#f8f9fa',
          paper: '#ffffff',
          ink: '#212529',
          muted: '#6c757d',
          accent: '#e91e63',
          border: '#e9ecef',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        serif: ['"Roboto Slab"', 'Merriweather', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
