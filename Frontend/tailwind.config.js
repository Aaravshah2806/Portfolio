/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Archivo", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
