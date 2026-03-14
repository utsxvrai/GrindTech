/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-dark': '#000000',
        'indigo-glow': '#FFFFFF',
        'neon-purple': '#FFFFFF',
        'neon-pink': '#FFFFFF',
        'neon-green': '#6cc24a',
        'aqua-blue': '#00FFFF',
        'cpp-white': '#FFFFFF',
        'python-blue': '#3776AB',
        'python-yellow': '#FFD43B',
        'java-orange': '#ED8B00',
        'javascript-gold': '#F7DF1E',
        'typescript-blue': '#3178C6',
        'dark-bg': '#000000',
        'card-dark': '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'meteor': 'meteor 8s linear infinite',
        'aurora': 'aurora 12s ease-in-out infinite',
        'grid-fade': 'gridFade 4s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108, 99, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(108, 99, 255, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        meteor: {
          '0%': { transform: 'translateY(-300px)', opacity: '0' },
          '3%': { opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'translateY(800px)', opacity: '0' },
        },
        aurora: {
          '0%, 100%': { transform: 'translateX(0%) translateY(0%) rotate(0deg) scale(1)' },
          '33%': { transform: 'translateX(30%) translateY(-20%) rotate(120deg) scale(1.1)' },
          '66%': { transform: 'translateX(-20%) translateY(20%) rotate(240deg) scale(0.9)' },
        },
        gridFade: {
          '0%, 100%': { opacity: '0.03' },
          '50%': { opacity: '0.06' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
}
