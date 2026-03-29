/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'DM Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        /** Richmond-inspired: brick row houses, James / capital blues, bell-tower gold, river-mist panels */
        rva: {
          brick: '#8B3A3A',
          'brick-deep': '#6B2D32',
          river: '#1E3A5F',
          'river-light': '#2A4D6E',
          james: '#2F5A6B',
          cream: '#F7F4EF',
          parchment: '#EDE8DF',
          gold: '#C4A035',
          slate: '#2D3142',
        },
      },
      backgroundImage: {
        'rva-hero-glow':
          'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(196,160,53,0.18), transparent 55%), radial-gradient(ellipse 70% 50% at 85% 0%, rgba(47,90,107,0.2), transparent 50%), radial-gradient(ellipse 55% 70% at 50% 100%, rgba(139,58,58,0.25), transparent 48%)',
        'rva-main-fade':
          'linear-gradient(180deg, #F7F4EF 0%, #E8E4DB 42%, #E4EDF2 100%)',
      },
    },
  },
  plugins: [],
};
