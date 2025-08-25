/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class", // 👈 disables system theme, only "dark" class works
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  