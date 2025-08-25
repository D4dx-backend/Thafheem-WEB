/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class", // required for class-based dark mode
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          lightBg: "#ffffff", // white
          darkBg: "#000000",  // black
          lightText: "#000000",
          darkText: "#ffffff",
        },
      },
    },
    plugins: [],
  };
  