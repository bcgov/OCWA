const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const DIST_PATH = path.resolve(__dirname, 'dist');

module.exports = {
  devtool: 'source-map',
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    filename: 'main.js',
    path: DIST_PATH,
    publicPath: '/',
  },
  mode: 'development',
  devServer: {
    contentBase: DIST_PATH,
    compress: true,
    hot: true,
    host: '0.0.0.0',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Request App Hello World',
      template: path.join(__dirname, 'src/templates/main.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Request App Hello World',
      template: path.join(__dirname, 'src/templates/main.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  stats: {
    colors: true,
  },
};
