import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#111827', // near-slate-900 for Kinescope vibe
        },
      },
      borderRadius: {
        '2xl': '1rem'
      }
    },
  },
  plugins: [],
}
export default config
