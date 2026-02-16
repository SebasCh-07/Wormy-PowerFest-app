/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        success: '#10b981',
        error: '#ef4444',
        dark: '#0f172a',
        light: '#f8fafc',
      },
    },
  },
  plugins: [],
}
