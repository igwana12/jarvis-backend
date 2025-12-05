/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk Dark Mode
        'bg-primary': '#0a0a0a',
        'bg-secondary': '#1a1a1a',
        'accent': '#00ff00',
        'accent-dim': '#00cc00',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        'border': '#2a2a2a',
        'neon-green': '#00ff00',
        'neon-blue': '#00ffff',
        'neon-purple': '#ff00ff',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 0, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 0, 0.4)' },
        },
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 0, 0.3)',
        'neon-strong': '0 0 30px rgba(0, 255, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
