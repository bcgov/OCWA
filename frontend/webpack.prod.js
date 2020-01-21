const merge = require('webpack-merge');
// NOTE: Turn on BundleAnalyzerPlugin to inspect the size if things get too big and slow
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const common = require('./webpack.common');

const DIST_PATH = path.resolve(__dirname, 'dist');

module.exports = merge(common, {
  mode: 'production',
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    filename: '[name].[hash].js',
    path: DIST_PATH,
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEV__: false,
    }),
    // new BundleAnalyzerPlugin(), // Turn on if you want view where the bundle size comes from
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new ManifestPlugin({
      writeToFileEmit: true,
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
        terserOptions: {
          compress: {
            arrows: false,
            booleans: false,
            collapse_vars: false,
            comparisons: false,
            computed_props: false,
            hoist_funs: false,
            hoist_props: false,
            hoist_vars: false,
            if_return: false,
            inline: false,
            join_vars: false,
            keep_infinity: true,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            sequences: false,
            side_effects: false,
            switches: false,
            top_retain: false,
            toplevel: false,
            typeofs: false,
            unused: false,
            // Switch off all types of compression except those needed to convince
            // react-devtools that we're using a production build
            conditionals: true,
            dead_code: true,
            evaluate: true,
          },
          mangle: true,
        },
      }),
    ],
  },
  stats: {
    colors: false,
    hash: true,
    timings: true,
    assets: true,
    chunks: true,
    chunkModules: true,
    modules: true,
    children: true,
  },
});
