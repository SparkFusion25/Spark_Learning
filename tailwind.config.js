/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spark: {
          50: '#f8f5ff',
          100: '#f0e8ff',
          200: '#e4d4ff',
          300: '#d1b3ff',
          400: '#b885ff',
          500: '#9c5dff',
          600: '#8b3dff',
          700: '#7c22ff',
          800: '#6a0fff',
          900: '#5b00d6',
          950: '#3d0099',
        },
      },
      fontFamily: {
        'kid': ['Fredoka One', 'cursive'],
        'parent': ['Poppins', 'sans-serif'],
        'display': ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'kid': '24px',
        'parent': '12px',
        '4xl': '2rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(5px) rotate(-1deg)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(139, 95, 191, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(139, 95, 191, 0.8)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        },
      },
      boxShadow: {
        'magical': '0 10px 30px rgba(139, 95, 191, 0.3)',
        'float': '0 5px 15px rgba(240, 98, 146, 0.2)',
        'glow': '0 0 20px rgba(255, 213, 79, 0.4)',
      },
      backgroundImage: {
        'gradient-magical': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-kid': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-parent': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      },
    },
  },
  plugins: [],
}