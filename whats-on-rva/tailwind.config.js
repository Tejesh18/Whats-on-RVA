/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        rva: {
          brick: '#8B3A3A',
          river: '#1E3A5F',
          cream: '#F7F4EF',
          gold: '#C4A035',
          slate: '#2D3142',
        },
      },
    },
  },
  plugins: [],
};
