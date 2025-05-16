/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9e6',
          100: '#d8efc3',
          200: '#bde49d',
          300: '#a1d977',
          400: '#86cf51',
          500: '#6cb52a', // Main primary color
          600: '#57931f',
          700: '#437016',
          800: '#2e4d0e',
          900: '#1a2a05',
        },
        secondary: {
          50: '#fcf8e9',
          100: '#f8edc5',
          200: '#f3e29f',
          300: '#eed779',
          400: '#e9cc54',
          500: '#e4c12e', // Main secondary color
          600: '#c3a118',
          700: '#927912',
          800: '#61500c',
          900: '#312806',
        },
        accent: {
          50: '#eeedfc',
          100: '#d2d0f8',
          200: '#b6b2f3',
          300: '#9994ee',
          400: '#7d77e9',
          500: '#6159e5', // Main accent color
          600: '#4c46bb',
          700: '#38348d',
          800: '#24235e',
          900: '#12112f',
        },
        neutral: {
          50: '#f8f8f4',
          100: '#eeede5',
          200: '#dfdccf',
          300: '#cac5b3',
          400: '#b5ae97',
          500: '#a39c84',
          600: '#8c8672',
          700: '#6b6757',
          800: '#49453a',
          900: '#24221d',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'medium': '0 8px 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};