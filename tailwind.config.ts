import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#15120F',
        ink: '#211C17',
        cream: '#F7F2E9',
        parchment: '#F1E9DA',
        gold: {
          DEFAULT: '#B8935B',
          light: '#D9BD8E',
          dark: '#8A6B3F',
        },
        amber: {
          DEFAULT: '#6B3F23',
          deep: '#4A2A17',
        },
        blush: '#E4D8C8',
        success: '#5C7A5C',
        error: '#A8482F',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'oil-sheen': 'linear-gradient(115deg, transparent 20%, rgba(184,147,91,0.35) 45%, rgba(217,189,142,0.55) 50%, rgba(184,147,91,0.35) 55%, transparent 80%)',
        'gold-radial': 'radial-gradient(circle at 30% 20%, #D9BD8E 0%, #B8935B 45%, #6B3F23 100%)',
      },
      keyframes: {
        pour: {
          '0%': { height: '0%', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { height: '100%', opacity: '1' },
        },
        sheen: {
          '0%': { backgroundPosition: '-150% 0' },
          '100%': { backgroundPosition: '150% 0' },
        },
        drift: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        pour: 'pour 1.4s cubic-bezier(0.65,0,0.35,1) forwards',
        sheen: 'sheen 2.8s linear infinite',
        drift: 'drift 6s ease-in-out infinite',
        ripple: 'ripple 2.4s ease-out infinite',
      },
      borderRadius: {
        droplet: '50% 50% 50% 0%',
      },
      letterSpacing: {
        widest2: '0.28em',
      },
    },
  },
  plugins: [],
};
export default config;
