/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#08090E',
          'dark-card': '#10131E',
          'dark-card-hover': '#161A2B',
          'dark-border': '#1F253B',
          light: '#F8FAFC',
          'light-card': '#FFFFFF',
          'light-card-hover': '#F1F5F9',
          'light-border': '#E2E8F0',
        },
        brand: {
          purple: '#8B5CF6',
          'purple-light': '#A78BFA',
          'purple-glow': 'rgba(139, 92, 246, 0.35)',
          lime: '#10B981',
          'lime-neon': '#22C55E',
          'lime-bright': '#4ADE80',
          cyan: '#06B6D4',
          'cyan-neon': '#22D3EE',
          pink: '#EC4899',
          'pink-neon': '#F43F5E',
          amber: '#F59E0B',
          fire: '#FF5722',
        }
      },
      fontFamily: {
        sans: ['"SF Pro Display"', '"SF Pro"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['"SF Pro Display"', '"SF Pro"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.45)',
        'glow-lime': '0 0 25px -5px rgba(34, 197, 94, 0.45)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.45)',
        'glow-pink': '0 0 25px -5px rgba(244, 63, 94, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
