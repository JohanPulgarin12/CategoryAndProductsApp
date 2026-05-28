/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          950: '#0A0C10',
          900: '#0F1117',
          800: '#161B24',
          700: '#1E2535',
          600: '#252E42',
        },
        acid: {
          400: '#C8F135',
          500: '#B5E020',
          600: '#9DC918',
        },
        slate: {
          450: '#8896A8',
        }
      },
    },
  },
  plugins: [],
}
