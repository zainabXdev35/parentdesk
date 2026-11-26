/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
      colors: {
        brand: {
          50: '#eefaf6', 100: '#d4f1e7', 200: '#aae3d0', 300: '#78cfb5', 400: '#46b898',
          500: '#1f9d7a', 600: '#178466', 700: '#136a54', 800: '#115544', 900: '#0c3b30',
        },
        ink: '#14201c',
      },
    },
  },
  plugins: [],
};
