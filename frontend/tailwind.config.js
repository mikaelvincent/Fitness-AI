// tailwind.config.cjs

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: "#FF6500",
          100: "#FF3C00",
        },
        white: "#FFFFFF",
        gray: {
          100: "#383838",
          200: "#2D2D2D",
          300: "#232323",
          400: "#1A1A1A",
        },
        green: "#09A70E",
        red: "#FF0000",
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'league-spartan': ['"League Spartan"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
