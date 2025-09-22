// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      // You can add custom theme properties here if needed in the future
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Adds better default styles for form elements
  ],
}