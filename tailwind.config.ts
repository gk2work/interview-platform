import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#0A0F1C',
        'slate': {
          DEFAULT: '#1a1f35',
          '300': '#cbd5e1',
          '400': '#94a3b8',
          '500': '#64748b',
          '700': '#334155',
        },
        'blue': '#3B82F6',
        'emerald': '#10B981',
        'amber': '#F59E0B',
        'rose': '#F43F5E',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -2px rgba(0,0,0,0.3)',
        'inset-soft': 'inset 0 2px 4px 0 rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}
export default config
