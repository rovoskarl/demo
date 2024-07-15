/** @type {import('tailwindcss').Config} */
const colors = require('./src/components/Theme/colors');

module.exports = {
  content: ['./src/*.{js,jsx,ts,tsx}', './src/**/**/*.{js,jsx,ts,tsx}', 'src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors,
    },
  },
  plugins: [],
};
