module.exports = {
  mode: 'jit',
  darkMode: 'class',
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      screens: {
        md: '850px'
      }
    },
    extend: {
      transitionProperty: {
        'height': 'height'
      }
    },
  },
  variants: {},
  plugins: []
};
