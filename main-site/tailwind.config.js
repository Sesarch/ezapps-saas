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
        // PRIMARY BRAND COLORS (Teal)
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',  // Main brand color
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
        },
        // SECONDARY COLORS (Purple)
        secondary: {
          50: 'var(--secondary-50)',
          100: 'var(--secondary-100)',
          200: 'var(--secondary-200)',
          300: 'var(--secondary-300)',
          400: 'var(--secondary-400)',
          500: 'var(--secondary-500)',
          600: 'var(--secondary-600)',
          700: 'var(--secondary-700)',
          800: 'var(--secondary-800)',
          900: 'var(--secondary-900)',
        },
        // ACCENT COLORS
        accent: {
          blue: 'var(--accent-blue)',
          indigo: 'var(--accent-indigo)',
          pink: 'var(--accent-pink)',
          orange: 'var(--accent-orange)',
          yellow: 'var(--accent-yellow)',
          green: 'var(--accent-green)',
        },
        // STATUS COLORS
        success: {
          light: 'var(--success-light)',
          DEFAULT: 'var(--success)',
          dark: 'var(--success-dark)',
        },
        warning: {
          light: 'var(--warning-light)',
          DEFAULT: 'var(--warning)',
          dark: 'var(--warning-dark)',
        },
        error: {
          light: 'var(--error-light)',
          DEFAULT: 'var(--error)',
          dark: 'var(--error-dark)',
        },
        info: {
          light: 'var(--info-light)',
          DEFAULT: 'var(--info)',
          dark: 'var(--info-dark)',
        },
        // SIDEBAR
        sidebar: {
          bg: 'var(--sidebar-bg)',
          text: 'var(--sidebar-text)',
          hover: 'var(--sidebar-hover)',
          active: 'var(--sidebar-active)',
          'active-bg': 'var(--sidebar-active-bg)',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
        'gradient-secondary': 'linear-gradient(135deg, var(--secondary-500), var(--secondary-600))',
        'gradient-rainbow': 'linear-gradient(135deg, var(--accent-indigo), var(--secondary-500), var(--accent-pink))',
      },
    },
  },
  plugins: [],
}
