const CleanWebpackPlugin = require('clean-webpack-plugin');
const getLocalIdent = require('css-loader/lib/getLocalIdent');
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
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              getLocalIdent: (context, localIdentName, localName, options) => {
                // Turn off ident parsing for bootstrap related content
                // so the Form.io layout works.
                if (context.resourcePath.includes('form.scss')) {
                  return localName;
                }

                return getLocalIdent(
                  context,
                  localIdentName,
                  localName,
                  options
                );
              },
              localIdentName: '[path][name]_[local]--[hash:base64:8]',
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
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
