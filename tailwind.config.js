/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        porscheBlack: '#000000',
        porscheGray: {
          light: '#f7f7f7',
          DEFAULT: '#d3d3d3',
          dark: '#404040',
        },
        porscheRed: '#c40000',
        porscheWhite: '#ffffff',
      },
      fontFamily: {
        porsche: ['PorscheNext', 'sans-serif'],
      },
    },
  },
  plugins: [],
}