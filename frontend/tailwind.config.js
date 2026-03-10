/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        yes: {
          DEFAULT: '#2563EB',
          light: '#EFF6FF',
          mid: '#DBEAFE',
          dark: '#1D4ED8',
        },
        no: {
          DEFAULT: '#E11D48',
          light: '#FFF1F2',
          mid: '#FFE4E6',
          dark: '#BE123C',
        },
        surface: '#FFFFFF',
        bg: '#F8FAFC',
        border: '#E2E8F0',
        dark: {
          DEFAULT: '#0B1121',
          50: '#0F172A',
          100: '#1E293B',
          200: '#334155',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Sora', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 8px 25px -5px rgb(0 0 0 / 0.08), 0 4px 10px -6px rgb(0 0 0 / 0.04)',
        'elevated': '0 12px 40px 0 rgb(0 0 0 / 0.1)',
        'glow-blue': '0 0 40px -8px rgba(37, 99, 235, 0.3)',
        'glow-rose': '0 0 40px -8px rgba(225, 29, 72, 0.3)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
