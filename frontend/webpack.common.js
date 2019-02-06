const CleanWebpackPlugin = require('clean-webpack-plugin');
const get = require('lodash/get');
const path = require('path');
const webpack = require('webpack');

const { version } = require('./package.json');

const commit = get(process, 'env.GITHASH', '');

module.exports = {
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.css'],
    modules: ['node_modules', path.resolve(__dirname, 'src')],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: /src/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(version),
      COMMIT: JSON.stringify(commit),
    }),
  ],
  stats: {
    colors: true,
  },
};
