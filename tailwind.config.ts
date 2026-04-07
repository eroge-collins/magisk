import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          50: '#e8e4f0',
          100: '#c4bdd6',
          200: '#9d92b8',
          300: '#76679a',
          400: '#5a4c83',
          500: '#3e326c',
          600: '#2e2758',
          700: '#1e1e42',
          800: '#161630',
          900: '#0c0c1c',
          950: '#070710',
        },
        surface: {
          DEFAULT: '#12121e',
          raised: '#1a1a2e',
          overlay: '#222240',
        },
        gold: {
          DEFAULT: '#c9a96e',
          light: '#dfc08a',
          dark: '#a8884e',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          hover: '#7c3aed',
          muted: '#6d3fbf',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        feed: '620px',
      },
      borderRadius: {
        card: '16px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
