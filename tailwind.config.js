/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF7',
          100: '#FAF7F2',
          200: '#F5EFEB',
          300: '#EFE7E0',
          400: '#E4D9CE',
          500: '#D5C4B4',
        },
        plum: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          300: '#D8B4FE',
          600: '#7E22CE',
          800: '#4A1D6E',
          900: '#2D1F3D',
          950: '#1F142B',
        },
        roseDust: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#E07A8A',
          600: '#C96576',
          700: '#A34657',
        },
        softCoral: {
          50: '#FFF5F2',
          100: '#FDEAE5',
          300: '#F8B4A6',
          400: '#F08080',
          500: '#E76F51',
        },
        lavenderSoft: {
          50: '#F8F6FF',
          100: '#F0ECFE',
          200: '#DDD5FD',
          300: '#C3B3FB',
          400: '#9B87F5',
          500: '#7E69AB',
        },
        sageCare: {
          50: '#F0F9F5',
          100: '#DCF2E7',
          200: '#BAE3CE',
          400: '#6CBF96',
          500: '#40916C',
          600: '#2D6A4F',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(45, 31, 61, 0.06), 0 2px 6px -1px rgba(45, 31, 61, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(45, 31, 61, 0.08), 0 4px 12px -2px rgba(45, 31, 61, 0.04)',
        'rose-glow': '0 8px 24px -4px rgba(224, 122, 138, 0.3)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
}
