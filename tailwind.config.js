/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        anna: {
          dark: '#090d16',      // Deep Canvas Background
          card: '#1e293b',      // Card Container Layer
          cardHover: '#293548', // Inset / Hover Card Layer
          border: '#334155',    // Border Layer
          accent: '#6366f1',    // Indigo 500 Primary Action
          hover: '#4f46e5',     // Indigo 600 Hover Action
          purple: '#8b5cf6',    // Violet 500 Secondary Accent
          text: '#f8fafc',      // Slate 50 Primary Text
          muted: '#94a3b8',     // Slate 400 Muted Text
        },
        discord: {
          dark: '#313338',
          card: '#2b2d31',
          sidebar: '#2b2d31',
          serverRail: '#1e1f22',
          accent: '#5865f2',
          hover: '#4752c4',
          text: '#dbdee1',
          muted: '#949ba4'
        }
      }
    }
  },
  plugins: [],
}
