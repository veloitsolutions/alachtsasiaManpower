/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E91E63',
          light: '#F06292',
          dark: '#C2185B',
        },
        neutral: {
          black: '#212121',
          'dark-gray': '#424242',
          gray: '#757575',
          'light-gray': '#e0e0e0',
          white: '#ffffff',
        },
        accent: {
          gold: '#D4AF37',
          blue: '#1E3A8A',
        },
      },
    },
  },
  plugins: [],
}
