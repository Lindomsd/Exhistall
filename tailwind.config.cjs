/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './App.tsx',
    './{components,data,pages,services}/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#071D49',
        'brand-gold': '#C58A12',
        'brand-light': '#F4F7FC',
        'brand-dark': '#172B4D',
        'brand-secondary': '#52647A',
        'surface': '#FFFFFF',
        'surface-soft': '#EEF3FA',
        'border': '#C7D3E3',
        'focus': '#1B5CB8',
        'danger': '#B42318',
        'success': '#157347'
      }
    }
  },
  plugins: []
};
