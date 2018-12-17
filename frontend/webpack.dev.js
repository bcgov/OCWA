const merge = require('webpack-merge');
const webpack = require('webpack');

const common = require('./webpack.common');

module.exports = merge(common, {
  entry: ['webpack-hot-middleware/client', '@babel/polyfill', './src/index.js'],
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: common.output.path,
    compress: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              localIdentName: '[path][name]_[local]--[hash:base64:8]',
            },
          },
        ],
      },
    ],
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],
});
