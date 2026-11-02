/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0d0d0e',
          surface: '#141416',
          border: '#232326',
          muted: '#71717a',
          ink: '#f4f4f5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      letterSpacing: {
        wider2: '0.15em',
      },
    },
  },
  plugins: [],
};
