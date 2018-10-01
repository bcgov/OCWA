const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = require('config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const DIST_PATH = path.resolve(__dirname, 'dist');

module.exports = {
  output: {
    filename: 'main.js',
    path: DIST_PATH,
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
      title: 'OCWA [DEMO]',
      template: path.join(__dirname, 'src/templates/main.html'),
    }),
    new webpack.EnvironmentPlugin({
      FORUM_API_HOST: config.get('forumApiHost'),
      FORUM_SOCKET: config.get('forumSocket'),
    }),
  ],
  stats: {
    colors: true,
  },
};
