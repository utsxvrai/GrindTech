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
