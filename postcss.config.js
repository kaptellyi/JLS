/* eslint-disable */
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-inline-svg')({
      paths: ['./src/assets/icons', './src/assets/illustrations'],
    }),
  ],
};
