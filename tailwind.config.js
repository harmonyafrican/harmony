/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          200: '#FDE68A',
          300: '#FCD34D', 
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        orange: {
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C', 
          500: '#F97316',
          600: '#EA580C',
        },
        blue: {
          200: '#DBEAFE',
          400: '#60A5FA',
          500: '#3B82F6',
        },
        purple: {
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
        },
        pink: {
          400: '#F472B6',
          500: '#EC4899',
        },
        red: {
          500: '#EF4444',
        },
        emerald: {
          300: '#6EE7B7',
          500: '#10B981',
        },
        cyan: {
          500: '#06B6D4',
        },
        green: {
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
        },
        slate: {
          50: '#F8FAFC',
          600: '#475569',
          800: '#1E293B',
        },
        indigo: {
          100: '#E0E7FF',
        },
      },
    },
  },
  plugins: [],
}