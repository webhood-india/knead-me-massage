/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#171512',
          50: '#f6f5f3',
          100: '#e8e5df',
          800: '#25221d',
          900: '#171512',
          950: '#0d0c0a',
        },
        brass: {
          DEFAULT: '#B08D57',
          50: '#f8f3ea',
          100: '#efe3cc',
          300: '#d3b47f',
          500: '#B08D57',
          600: '#93713e',
          700: '#755a32',
        },
        sage: {
          DEFAULT: '#6E7F52',
          50: '#f2f4ee',
          100: '#e1e6d5',
          400: '#8a9c68',
          500: '#6E7F52',
          600: '#586641',
        },
        cream: '#FAF7F2',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Work Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
