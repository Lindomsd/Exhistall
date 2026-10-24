/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './App.tsx', './{components,data,pages,services}/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Exhistall brand palette (see Exhistall-Brand Pack / brand-guidelines.md)
        'brand-blue': '#102653', // Market Navy — header, hero, primary text
        'brand-midnight': '#091B42', // Midnight Market — dark hero surfaces
        'brand-gold': '#E2A316', // Market Gold — buttons, highlights
        'brand-sunlit': '#FFD24A', // Sunlit Gold — bright accents on navy
        'brand-light': '#FFF9EC', // Stall Cream — warm page background
        'brand-dark': '#102653', // Market Navy — dark text / surfaces
        'brand-secondary': '#53627C', // Market Slate — secondary text
        surface: '#FFFFFF', // Market White — cards
        'surface-soft': '#F7EFDF', // warm subtle section surface
        border: '#E8DFCE', // Border Sand — dividers, card borders
        focus: '#1B5CB8',
        danger: '#B42318',
        success: '#157347',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Arial', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
