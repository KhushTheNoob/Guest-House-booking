/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enables class-based dark mode toggling
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // scans all your source files for class names
    "./public/index.html",         // include this if you have inline classes in HTML
  ],
  theme: {
    extend: {
      colors: {
        // Optional: add custom colors here
        brandBlue: '#df6c25ff',
        brandSlate: '#1E293B',
      },
    },
  },
  plugins: [],
};
