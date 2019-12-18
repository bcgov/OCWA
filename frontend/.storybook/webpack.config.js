const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');

const srcDir = path.resolve(__dirname, '../src');

module.exports = {
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
  plugins: [
    new webpack.DefinePlugin({
      SOCKET_HOST: JSON.stringify('ws://localhost:3002'),
      FILES_API_HOST: JSON.stringify('http://localhost:3000'),
      REQUEST_SOCKET_HOST: JSON.stringify('http://localhost:3000'),
      COMMIT: JSON.stringify('123'),
      ID_FIELD: JSON.stringify('id'),
      EXPORTER_GROUP: JSON.stringify('exporter'),
      OC_GROUP: JSON.stringify('oc'),
      REPORTS_GROUP: JSON.stringify('reports'),
      EXPORTER_MODE: JSON.stringify('export'),
      CODE_EXPORT_ENABLED: true,
      REPOSITORY_HOST: JSON.stringify('http://test.com'),
      ZONE: JSON.stringify('import'),
      HELP_URL: JSON.stringify('/test'),
      VERSION: JSON.stringify('1.0.0'),
    }),
  ],
  resolve: {
    alias: {
      '@src': srcDir,
    },
    extensions: ['.js', '.jsx', '.css'],
    modules: ['node_modules', srcDir],
  },
};
