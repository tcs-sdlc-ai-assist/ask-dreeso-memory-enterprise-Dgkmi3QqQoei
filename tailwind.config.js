/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
      },
      colors: {
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        gradient: {
          start: '#2563eb',
          mid: '#3b82f6',
          end: '#60a5fa',
          'dark-start': '#1e3a8a',
          'dark-mid': '#1e40af',
          'dark-end': '#2563eb',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.15)',
          medium: 'rgba(255, 255, 255, 0.25)',
          heavy: 'rgba(255, 255, 255, 0.40)',
          border: 'rgba(255, 255, 255, 0.18)',
          'dark-light': 'rgba(0, 0, 0, 0.15)',
          'dark-medium': 'rgba(0, 0, 0, 0.25)',
          'dark-heavy': 'rgba(0, 0, 0, 0.40)',
          'dark-border': 'rgba(0, 0, 0, 0.18)',
        },
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
        'gradient-blue-dark': 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
        glass: '12px',
        'glass-heavy': '20px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
        'glass-lg': '0 12px 48px 0 rgba(31, 38, 135, 0.5)',
        'uber': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'uber-md': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'uber-lg': '0 16px 48px rgba(0, 0, 0, 0.16)',
      },
      borderRadius: {
        'glass': '10px',
        'uber': '8px',
        'uber-lg': '16px',
        'uber-xl': '24px',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        112: '28rem',
        128: '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'glass-shimmer': 'glassShimmer 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glassShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};