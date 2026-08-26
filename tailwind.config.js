/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          dark: '#313338',
          card: '#2b2d31',
          sidebar: '#1e1f22',
          embed: '#2b2d31',
          accent: '#5865f2',
          hover: '#4752c4',
          text: '#dbdee1',
          muted: '#949ba4'
        }
      }
    },
  },
  plugins: [],
}
