import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff3fd4',
          purple: '#6a00ff',
          violet: '#9b5cff',
          blue: '#00e0ff',
        },
      },
      boxShadow: {
        glow: '0 0 30px rgba(155, 92, 255, 0.55)',
        elevated: '0 20px 60px rgba(0,0,0,.35), 0 8px 24px rgba(0,0,0,.25)',
        neonViolet: '0 0 40px rgba(155,92,255,.55), 0 10px 40px rgba(155,92,255,.25)',
      },
      dropShadow: {
        neon: '0 0 10px rgba(155,92,255,.65)',
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      },
      backgroundImage: {
        aurora:
          'radial-gradient(60% 80% at 20% 10%, rgba(255,63,212,0.25) 0%, rgba(255,63,212,0) 60%), radial-gradient(70% 90% at 90% 10%, rgba(0,224,255,0.22) 0%, rgba(0,224,255,0) 60%), radial-gradient(60% 60% at 50% 80%, rgba(106,0,255,0.30) 0%, rgba(106,0,255,0) 60%)',
      },
    },
  },
  plugins: [],
} satisfies Config


