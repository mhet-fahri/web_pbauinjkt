import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f7fb',
          100: '#e1ecf6',
          200: '#cbddec',
          300: '#a7c6df',
          400: '#7ba7cf',
          500: '#5a8abf',
          600: '#466fa4',
          700: '#3a5986',
          800: '#324b6e',
          900: '#002147', // Oxford Blue
          950: '#001530',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [
    typography,
  ],
}
