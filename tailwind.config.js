/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class", // 👈 disables system theme, only "dark" class works
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
      spacing: {
        '42': '10.5rem', // 168px - Custom spacing for button positioning
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
    plugins: [],
  }
  