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
        // ── Insight Architect Design System ──────────────────────────────
        'primary':                    '#091426',
        'on-primary':                 '#ffffff',
        'primary-container':          '#1e293b',
        'on-primary-container':       '#8590a6',
        'primary-fixed':              '#d8e3fb',
        'primary-fixed-dim':          '#bcc7de',
        'on-primary-fixed':           '#111c2d',
        'on-primary-fixed-variant':   '#3c475a',
        'inverse-primary':            '#bcc7de',

        'secondary':                  '#006a61',
        'on-secondary':               '#ffffff',
        'secondary-container':        '#86f2e4',
        'on-secondary-container':     '#006f66',
        'secondary-fixed':            '#89f5e7',
        'secondary-fixed-dim':        '#6bd8cb',
        'on-secondary-fixed':         '#00201d',
        'on-secondary-fixed-variant': '#005049',

        'tertiary':                   '#1c0048',
        'on-tertiary':                '#ffffff',
        'tertiary-container':         '#35007b',
        'on-tertiary-container':      '#a375ff',
        'tertiary-fixed':             '#eaddff',
        'tertiary-fixed-dim':         '#d2bbff',
        'on-tertiary-fixed':          '#25005a',
        'on-tertiary-fixed-variant':  '#5a00c6',

        'background':                 '#f7f9fb',
        'on-background':              '#191c1e',
        'surface':                    '#f7f9fb',
        'on-surface':                 '#191c1e',
        'surface-variant':            '#e0e3e5',
        'on-surface-variant':         '#45474c',
        'surface-bright':             '#f7f9fb',
        'surface-dim':                '#d8dadc',
        'surface-tint':               '#545f73',
        'surface-container-lowest':   '#ffffff',
        'surface-container-low':      '#f2f4f6',
        'surface-container':          '#eceef0',
        'surface-container-high':     '#e6e8ea',
        'surface-container-highest':  '#e0e3e5',
        'inverse-surface':            '#2d3133',
        'inverse-on-surface':         '#eff1f3',

        'outline':                    '#75777d',
        'outline-variant':            '#c5c6cd',

        'error':                      '#ba1a1a',
        'on-error':                   '#ffffff',
        'error-container':            '#ffdad6',
        'on-error-container':         '#93000a',

        'surface-app':                '#f7f9fb',

        // ── Legacy brand tokens (backward compat) ────────────────────────
        brand: {
          navy:           '#0a0f1e',
          primary:        '#091426',
          secondary:      '#1e293b',
          accent:         '#006a61',
          'accent-hover': '#005049',
          violet:         '#1c0048',
          teal:           '#006a61',
          'accent-light': '#86f2e4',
          'violet-light': '#eaddff',
        },
        'surface-card':    '#ffffff',
        'surface-sidebar': '#091426',
      },
      fontFamily: {
        headline: ['Manrope', 'system-ui', 'sans-serif'],
        body:     ['Inter', 'system-ui', 'sans-serif'],
        label:    ['Inter', 'system-ui', 'sans-serif'],
        // legacy aliases
        sora:  ['Manrope', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        dm:    ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Manrope', 'Georgia', 'sans-serif'],
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
