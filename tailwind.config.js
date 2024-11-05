/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "wordle-gray": "#3a3a3c",
        "wordle-yellow": "#b59f3b",
        "wordle-green": "#528d4e",
      },
    },
  },
  plugins: [],
};
