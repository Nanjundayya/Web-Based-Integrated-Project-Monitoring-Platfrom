/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        travell: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          brand: '#FF5A1F',
          vibrant: '#FF4500',
          amber: '#FF8A00',
          peach: '#FFF3EB',
          surface: '#FFFBF9',
          card: '#FFFFFF',
          dark: '#1A1310'
        }
      },
      boxShadow: {
        'orange-glow': '0 8px 30px -4px rgba(255, 90, 31, 0.25)',
        'orange-sm': '0 2px 10px rgba(255, 90, 31, 0.15)',
        'orange-lg': '0 12px 40px rgba(255, 90, 31, 0.35)',
        'card-soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
      },
      backgroundImage: {
        'gradient-orange': 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
        'gradient-warm': 'linear-gradient(180deg, #FFF9F5 0%, #FFFFFF 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #FFA07A 0%, #FF5A1F 100%)',
        'gradient-dark': 'linear-gradient(135deg, #2D1810 0%, #150D0A 100%)'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        pulseLight: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'pulse-subtle': 'pulseLight 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out forwards'
      }
    },
  },
  plugins: [],
}
