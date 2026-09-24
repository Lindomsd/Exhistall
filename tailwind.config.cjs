/** @type {import(tailwindcss).Config} */
module.exports = {
  content: [./index.html, ./{components,data,pages,services}/**/*.{ts,tsx}, ./App.tsx],
  theme: {
    extend: {
      colors: {
        brand-blue: #071D49,
        brand-gold: #F7C948,
        brand-light: #F4F7FC,
        brand-dark: #EAF1FF,
        brand-secondary: #B9C8E5
      }
    }
  },
  plugins: []
};
