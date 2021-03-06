const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const common = require('./webpack.common');

const DIST_PATH = path.resolve(__dirname, 'dist');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  entry: ['webpack-hot-middleware/client', '@babel/polyfill', './src/index.js'],
  output: {
    filename: '[name].js',
    path: DIST_PATH,
    publicPath: '/',
  },
  devServer: {
    contentBase: DIST_PATH,
    compress: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
