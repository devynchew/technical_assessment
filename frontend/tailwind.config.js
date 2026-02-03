/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Make Inter the default font for the whole website
        sans: ['Inter', 'sans-serif'],
        
        // Create a custom class for Barlow Condensed
        barlow: ['"Barlow Condensed"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

