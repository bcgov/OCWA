const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const { version } = require('./package.json');

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
    }),
  ],
  stats: {
    colors: true,
  },
};
