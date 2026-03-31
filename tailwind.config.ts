import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy:           '#0a0f1e',
          primary:        '#0a0f1e',
          secondary:      '#0f2044',
          accent:         '#c8a96e',
          'accent-hover': '#b8924f',
          violet:         '#6366f1',
          teal:           '#0d9488',
          'accent-light': '#fdf5e8',
          'violet-light': '#eef2ff',
        },
        surface: {
          app:     '#f8f7f4',
          card:    '#ffffff',
          sidebar: '#0a0f1e',
          surface: '#f2f0eb',
        },
      },
      fontFamily: {
        sora: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        dm:   ['Inter', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0a0f1e 0%, #0f2044 50%, #0d1a38 100%)',
        'hero-gradient':  'linear-gradient(135deg, #0a0f1e 0%, #0f2044 60%, #0d1a38 100%)',
        'gold-gradient':  'linear-gradient(135deg, #c8a96e 0%, #b8924f 100%)',
        'card-gradient':  'none',
      },
      boxShadow: {
        'card':       '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 32px rgba(10,15,30,0.12)',
        'sidebar':    '4px 0 24px rgba(0,0,0,0.35)',
        'gold-glow':  '0 0 20px rgba(200, 169, 110, 0.35)',
        'violet-glow':'0 0 20px rgba(99, 102, 241, 0.35)',
        'teal-glow':  '0 0 20px rgba(13, 148, 136, 0.35)',
        /* backward-compat alias */
        'teal-glow-amber': '0 0 20px rgba(200, 169, 110, 0.45)',
      },
      animation: {
        'marquee':        'marquee 30s linear infinite',
        'pulse-glow':     'pulse-glow 2s ease-in-out infinite',
        'float':          'float 3s ease-in-out infinite',
        'count-up':       'count-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-in':        'fade-in 0.4s ease-out',
        'fade-in-up':     'fade-in-up 0.5s ease-out',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(200, 169, 110, 0.35)' },
          '50%':      { boxShadow: '0 0 24px rgba(200, 169, 110, 0.85)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
