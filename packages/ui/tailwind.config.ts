import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          bg: 'rgba(12, 13, 17, 0.85)',
          border: 'rgba(255, 107, 26, 0.4)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          strong: '#ff8946',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        ztarknet: {
          background: '#040405',
          foreground: '#f4f4f6',
          muted: '#777c8e',
          accent: '#ff6b1a',
          'accent-strong': '#ff8946',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: [
          'Space Grotesk',
          'var(--font-sans)',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'var(--font-mono)',
          'SFMono-Regular',
          'ui-monospace',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      maxWidth: {
        container: 'var(--max-width)',
      },
      letterSpacing: {
        widest: '0.2em',
      },
      keyframes: {
        slideIn: {
          from: {
            opacity: '0',
            transform: 'translateY(-20px)',
            borderColor: '#ff6b1a',
            boxShadow: '0 0 30px rgba(255, 107, 26, 0.6)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
            borderColor: 'rgba(255, 137, 70, 0.2)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      animation: {
        slideIn: 'slideIn 0.5s ease-out',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
