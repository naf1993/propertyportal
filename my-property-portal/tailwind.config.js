module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // For App Router (Next.js 13)
    './pages/**/*.{js,ts,jsx,tsx}', // For Pages Router
    './components/**/*.{js,ts,jsx,tsx}', // For Components
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#98FF98',
          100: '#93CD72',
          200: '#9FE3BF',
          300: '#77DD77',
          400: '#93C572',
          500: '#B5E58D',
          600: '#D0E49C',
          700: '#A2C88D',
          800: '#C4D79B',
          900:'#14452F'
        },
        blue: {
          50: '#6A5ACD',
          100: '#4682B4',
          200: '#4682A7',
          300: '#4169E1',
          400: '#003153',
          500: '#191970',
          600: '#367588',
          700: '#0047AB',
          800: '#5F6A8C',
          900: '#36454F',
        },
        tertiary: {
          100: '#4682B4',
        },
      },
    },
  },
  plugins: [],
};
