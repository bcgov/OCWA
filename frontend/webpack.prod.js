const merge = require('webpack-merge');
const webpack = require('webpack');

const common = require('./webpack.common');

module.exports = merge(common, {
  entry: ['@babel/polyfill', './src/index.js'],
  mode: 'production',
  devtool: 'source-map',
});
