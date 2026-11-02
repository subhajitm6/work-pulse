/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#5B5FEF', // Main primary accent from plan.md
          600: '#484CDC', // Accent hover from plan.md
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#181A1F',
          darker: '#111215',
        },
        muted: {
          light: '#737B89',
          dark: '#9CA3AF',
        },
        border: {
          light: '#E7EAF0',
          dark: '#2D3139',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
