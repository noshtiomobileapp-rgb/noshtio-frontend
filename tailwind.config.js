/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8D5524",   // Rich Brown
          light: "#C68642",     // Caramel
        },
        accent: {
          DEFAULT: "#D62828",   // Warm Food Red
          light: "#F77F00",     // Saffron
        },
        neutral: {
          50: "#FAFAFA",
          100: "#FFFFFF",
          200: "#E6E6E6",
          600: "#5A5A5A",
          700: "#2F2F2F",
        },
        status: {
          success: "#2E7D32",
          warning: "#FFB703",
          error: "#9E2A2B",
        },
      },
    },
  },
  plugins: [],
};
