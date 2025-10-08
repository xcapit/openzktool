/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        stellar: {
          purple: '#7B61FF',
          blue: '#00D1FF',
          dark: '#0A0E27',
        },
        zk: {
          green: '#00FF94',
          cyan: '#00F0FF',
        }
      },
    },
  },
  plugins: [],
}
