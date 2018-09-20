const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = require('config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const DIST_PATH = path.resolve(__dirname, 'dist');

module.exports = {
  devtool: 'source-map',
  entry: ['webpack-hot-middleware/client', '@babel/polyfill', './src/index.js'],
  output: {
    filename: 'main.js',
    path: DIST_PATH,
    publicPath: '/',
  },
  mode: 'development',
  devServer: {
    contentBase: DIST_PATH,
    compress: true,
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
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'OCWA [DEMO]',
      template: path.join(__dirname, 'src/templates/main.html'),
    }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Request App Hello World',
      template: path.join(__dirname, 'src/templates/main.html'),
    }),
    new webpack.EnvironmentPlugin({
      TOKEN: config.get('jwt'),
      API_HOST: process.env.API_HOST || 'localhost',
    }),
  ],
  stats: {
    colors: true,
  },
};
