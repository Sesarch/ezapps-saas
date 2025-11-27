/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Your Custom Color Palette
        gold: '#ffce00',
        turquoise: '#7fe1e5',
        peach: '#FCA47C',
        // Extended shades
        'turquoise-light': '#a8eef1',
        'turquoise-dark': '#5cbec2',
        'gold-light': '#ffe066',
        'gold-dark': '#e6b800',
        'peach-light': '#fdb99a',
        'peach-dark': '#fb8f5e',
        // Neutral colors
        dark: '#1a1a2e',
        navy: '#2d3748',
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
