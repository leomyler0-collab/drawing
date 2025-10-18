/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        spooky: {
          bg: '#0C0C0F',
          dark: '#0D0D0F',
          card: '#1A1A1F',
          orange: '#FF6B00',
          purple: '#B660FF',
          ghost: '#F5F5F5',
          glow: 'rgba(255, 107, 0, 0.3)',
          purpleGlow: 'rgba(182, 96, 255, 0.3)',
        }
      },
      fontFamily: {
        'creepy': ['Creepster', 'cursive'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'flicker': 'flicker 1.5s ease-in-out infinite',
        'ghost-trail': 'ghost-trail 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 107, 0, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 107, 0, 0.8), 0 0 30px rgba(255, 107, 0, 0.6)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'ghost-trail': {
          '0%': { opacity: '0.8', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.5)' },
        }
      }
    },
  },
  plugins: [],
}
