import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ciaf-navy': '#0d2040',
        'ciaf-blue': '#1a3d7c',
        'ciaf-sky': '#7ecde8',
        'ciaf-light': '#f0f4fa',
      },
      fontFamily: {
        'barlow': ['var(--font-barlow)', 'sans-serif'],
        'barlow-condensed': ['var(--font-barlow-condensed)', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right, rgba(13,32,64,0.85) 0%, rgba(13,32,64,0.60) 40%, transparent 75%)',
      },
    },
  },
  plugins: [],
}

export default config
