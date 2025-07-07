/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Custom semantic colors if needed
        primary: {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#2563eb'
        },
        secondary: {
          light: '#facc15',
          DEFAULT: '#eab308',
          dark: '#ca8a04'
        },
        card: {
          light: '#ffffff',
          dark: '#1f2937'
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Optional: Beautify inputs
    require('@tailwindcss/typography'), // Optional: If you add alerts/messages
  ],
};
