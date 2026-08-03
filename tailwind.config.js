/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
      },
      colors: {
        brand: {
          primary: '#0F2A2A',
          secondary: '#D9FAF4',
          accent: '#00BFA6',
          DEFAULT: '#0F2A2A',
        },
        // Full ramps for primary, secondary, accent + success/warning/error
        ink: {
          50: '#F3F8F7',
          100: '#E3EDEB',
          200: '#C6DAD6',
          300: '#9BBDB7',
          400: '#6A9891',
          500: '#4A7C74',
          600: '#38635D',
          700: '#2C4F4A',
          800: '#1F3A36',
          900: '#0F2A2A',
          950: '#081816',
        },
        mint: {
          50: '#EFFFFC',
          100: '#D9FAF4',
          200: '#B3F5E9',
          300: '#80EBD8',
          400: '#47DBC3',
          500: '#1FC4AC',
          600: '#00BFA6',
          700: '#00A590',
          800: '#008674',
          900: '#006659',
        },
        success: {
          50: '#ECFDF3',
          100: '#D1FADF',
          500: '#12B76A',
          600: '#039855',
          700: '#027A48',
        },
        warning: {
          50: '#FFFAEB',
          100: '#FEF0C7',
          500: '#F79009',
          600: '#DC6803',
          700: '#B54708',
        },
        error: {
          50: '#FEF3F2',
          100: '#FEE4E2',
          500: '#F04438',
          600: '#D92D20',
          700: '#B42318',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 2px rgba(15, 42, 42, 0.06), 0 1px 3px rgba(15, 42, 42, 0.04)',
        'card-hover': '0 12px 32px -8px rgba(15, 42, 42, 0.18), 0 4px 12px rgba(15, 42, 42, 0.08)',
        'glow': '0 0 0 1px rgba(0, 191, 166, 0.25), 0 8px 24px -6px rgba(0, 191, 166, 0.35)',
        'glow-strong': '0 0 0 1px rgba(0, 191, 166, 0.4), 0 12px 36px -4px rgba(0, 191, 166, 0.5)',
      },
      borderRadius: {
        'xl2': '1.25rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};
