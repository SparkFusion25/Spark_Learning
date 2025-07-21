/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spark: {
          purple: '#667eea',
          pink: '#f093fb',
          blue: '#4facfe',
          green: '#43e97b',
          orange: '#ff9a56',
          yellow: '#feca57'
        }
      },
      fontFamily: {
        'kid': ['Comic Neue', 'cursive'],
        'parent': ['Inter', 'sans-serif'],
        'display': ['Fredoka One', 'cursive']
      },
      borderRadius: {
        'kid': '24px',
        'parent': '12px',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem'
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'sparkle': 'sparkle 2s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' }
        }
      },
      boxShadow: {
        'kid': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'magical': '0 0 20px rgba(103, 126, 234, 0.3)',
        'glow': '0 0 30px rgba(240, 147, 251, 0.4)'
      },
      backgroundImage: {
        'kid-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'parent-gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'success-gradient': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'warning-gradient': 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)'
      }
    },
  },
  plugins: [],
}