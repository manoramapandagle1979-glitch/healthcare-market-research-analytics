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
        // ── Canonical palette ────────────────────────────────────────────
        ink:        '#0b1220',
        'ink-soft': '#1c2739',
        'ink-muted':'#475569',
        paper:      '#f7f5f0',
        'paper-pure':'#ffffff',
        signal:     '#0d6b63',
        'signal-soft':'#d7ece9',
        'signal-deep':'#074541',
        ember:      '#c2410c',
        'ember-soft':'#fde9d9',

        // ── Material-derived semantic tokens (still used across pages) ───
        'primary':                    '#0b1220',
        'on-primary':                 '#ffffff',
        'primary-container':          '#1c2739',
        'on-primary-container':       '#cbd5e1',
        'primary-fixed':              '#d8e3fb',
        'primary-fixed-dim':          '#bcc7de',
        'on-primary-fixed':           '#0b1220',
        'on-primary-fixed-variant':   '#334155',
        'inverse-primary':            '#cbd5e1',

        'secondary':                  '#0d6b63',
        'on-secondary':               '#ffffff',
        'secondary-container':        '#d7ece9',
        'on-secondary-container':     '#074541',
        'secondary-fixed':            '#d7ece9',
        'secondary-fixed-dim':        '#b8ddd8',
        'on-secondary-fixed':         '#00201d',
        'on-secondary-fixed-variant': '#074541',

        'tertiary':                   '#c2410c',
        'on-tertiary':                '#ffffff',
        'tertiary-container':         '#fde9d9',
        'on-tertiary-container':      '#7c2d12',
        'tertiary-fixed':             '#fde9d9',
        'tertiary-fixed-dim':         '#fbd1b0',
        'on-tertiary-fixed':          '#431407',
        'on-tertiary-fixed-variant':  '#9a3412',

        'background':                 '#f7f5f0',
        'on-background':               '#0b1220',
        'surface':                    '#f7f5f0',
        'on-surface':                  '#0b1220',
        'surface-variant':            '#e2e8f0',
        'on-surface-variant':         '#475569',
        'surface-bright':             '#ffffff',
        'surface-dim':                '#e2e8f0',
        'surface-tint':               '#1c2739',
        'surface-container-lowest':   '#ffffff',
        'surface-container-low':      '#f8fafc',
        'surface-container':          '#f1f5f9',
        'surface-container-high':     '#e2e8f0',
        'surface-container-highest':  '#cbd5e1',
        'inverse-surface':            '#1e293b',
        'inverse-on-surface':         '#f1f5f9',

        'outline':                    '#94a3b8',
        'outline-variant':            '#e2e8f0',

        'error':                      '#b91c1c',
        'on-error':                   '#ffffff',
        'error-container':            '#fee2e2',
        'on-error-container':         '#7f1d1d',

        'surface-app':                '#f7f5f0',

        // ── Legacy brand.* tokens (remapped forward) ─────────────────────
        brand: {
          navy:           '#0b1220',
          primary:        '#0b1220',
          secondary:      '#1c2739',
          accent:         '#0d6b63',
          'accent-hover': '#074541',
          violet:         '#c2410c',
          teal:           '#0d6b63',
          'accent-light': '#d7ece9',
          'violet-light': '#fde9d9',
        },
        'surface-card':    '#ffffff',
        'surface-sidebar': '#0b1220',
      },
      fontFamily: {
        display:  ['Fraunces', 'Georgia', 'serif'],
        headline: ['Geist', 'system-ui', 'sans-serif'],
        body:     ['Geist', 'system-ui', 'sans-serif'],
        label:    ['Geist', 'system-ui', 'sans-serif'],
        mono:     ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        // legacy aliases — all remap to Geist
        sora:  ['Geist', 'system-ui', 'sans-serif'],
        dm:    ['Geist', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0b1220 0%, #101a2d 60%, #1c2739 100%)',
        'hero-gradient':  'linear-gradient(135deg, #0b1220 0%, #101a2d 60%, #1c2739 100%)',
        'signal-gradient':'linear-gradient(135deg, #0d6b63 0%, #074541 100%)',
        'gold-gradient':  'linear-gradient(135deg, #0d6b63 0%, #074541 100%)', // legacy alias
        'card-gradient':  'none',
      },
      boxShadow: {
        'card':       '0 1px 2px rgba(11,18,32,0.04), 0 4px 16px rgba(11,18,32,0.05)',
        'card-hover': '0 6px 32px rgba(11,18,32,0.12)',
        'sidebar':    '4px 0 24px rgba(0,0,0,0.35)',
        'signal-glow':'0 0 24px rgba(13,107,99,0.35)',
        'ember-glow': '0 0 20px rgba(194,65,12,0.30)',
        // legacy aliases
        'gold-glow':       '0 0 24px rgba(13,107,99,0.35)',
        'violet-glow':     '0 0 20px rgba(194,65,12,0.30)',
        'teal-glow':       '0 0 24px rgba(13,107,99,0.35)',
        'teal-glow-amber': '0 0 20px rgba(194,65,12,0.30)',
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
          '0%, 100%': { boxShadow: '0 0 5px rgba(13,107,99,0.35)' },
          '50%':      { boxShadow: '0 0 24px rgba(13,107,99,0.75)' },
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
