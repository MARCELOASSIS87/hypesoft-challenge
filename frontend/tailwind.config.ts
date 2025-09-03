import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6366f1',
          soft: '#eef2ff'
        }
      },
      boxShadow: {
        card: '0 6px 24px -6px rgba(15,23,42,.06)'
      }
    }
  },
  plugins: []
}

export default config
