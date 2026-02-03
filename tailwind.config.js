/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colors based on the visual identity document
        primary: {
          DEFAULT: '#06b6d4', // Cyan
          light: '#22d3ee',
          dark: '#0891b2',
        },
        secondary: {
          DEFAULT: '#3b82f6', // Blue
          light: '#60a5fa',
          dark: '#2563eb',
        },
        dark: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
          lighter: '#334155',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
