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
        primary: {
          50: '#e8f4f8',
          100: '#caf0f8',
          200: '#90e0ef',
          300: '#00b4d8',
          400: '#00adb5',
          500: '#0096c7',
          600: '#0077b6',
          700: '#0f3460',
          800: '#16213e',
          900: '#1a1a2e',
        },
        dark: '#1a1a2e',
        navy: '#16213e',
        deepblue: '#0f3460',
        teal: '#00adb5',
        cyan: '#00b4d8',
        lightcyan: '#caf0f8',
        ice: '#e8f4f8',
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
