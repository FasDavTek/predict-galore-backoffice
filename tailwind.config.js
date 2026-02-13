/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'var(--color-primary-500)',
          400: 'var(--color-primary-400)',
          700: 'var(--color-primary-700)',
        },
        secondary: {
          500: 'var(--color-secondary-500)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
        background: {
          DEFAULT: 'var(--color-background)',
          secondary: 'var(--color-background-secondary)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-ultra)'],
      },
    },
  },
  plugins: [],
};

