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
          dark: '#313338',       // Main Chat Canvas
          card: '#2b2d31',       // Card Container
          sidebar: '#2b2d31',    // Sidebar List
          serverRail: '#1e1f22', // Far-left Server Rail Bar
          accent: '#5865f2',     // Discord Blurple
          hover: '#4752c4',      // Blurple Hover
          text: '#dbdee1',       // Primary Text
          muted: '#949ba4',      // Muted / Title Text
          header: '#313338',     // Channel Top Bar
          cardHover: '#383a40',  // Hover on Card Items
          green: '#23a55a',      // Discord Online Dot
          gray: '#80848e'        // Discord Offline Dot
        }
      }
    }
  },
  plugins: [],
}
