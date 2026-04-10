/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        sky:   '#0B1A2E',
        sky2:  '#112240',
        gold:  '#F5C842',
        gold2: '#FFAB00',
        teal:  '#00C9A7',
        coral: '#FF6B6B',
        cream: '#F8F4EC',
        muted: '#8BA3BF',
        card:  '#162035',
        card2: '#1E2D47',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        app: '18px',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 'var(--lo, 0.1)' },
          '50%':       { opacity: 'var(--hi, 0.7)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-7px)' },
          '40%':      { transform: 'translateX(7px)' },
          '60%':      { transform: 'translateX(-4px)' },
          '80%':      { transform: 'translateX(4px)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,107,107,0.5)' },
          '50%':      { boxShadow: '0 0 0 9px rgba(255,107,107,0)' },
        },
      },
      animation: {
        twinkle:  'twinkle var(--d, 3s) ease-in-out infinite var(--delay, 0s)',
        slideUp:  'slideUp 0.35s cubic-bezier(0.22,1,0.36,1)',
        shake:    'shake 0.4s ease',
        spin:     'spin 1s linear infinite',
        fadeIn:   'fadeIn 0.4s ease',
        pulse:    'pulse 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
