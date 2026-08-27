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
          dark: '#0f172a',      // Slate 900 Main Canvas
          card: '#1e293b',      // Slate 800 Card Container
          border: '#334155',    // Slate 700 Borders
          accent: '#6366f1',    // Indigo 500 Primary Action
          hover: '#4f46e5',     // Indigo 600 Hover Action
          purple: '#8b5cf6',    // Violet 500 Secondary Accent
          text: '#f8fafc',      // Slate 50 Primary Text
          muted: '#94a3b8',     // Slate 400 Muted Text
          badge: '#0284c7'      // Sky 600 Badge Highlight
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
