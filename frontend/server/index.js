const express = require('express');
const config = require('config');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();
const port = config.get('port');
const webpackConfig = require('../webpack.config.js');
const compiler = webpack(webpackConfig);

app.use(
  webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  })
);
app.use(webpackHotMiddleware(compiler));

app.listen(port, error => {
  if (!error) {
    console.log(`SRE is running on port: ${port}...`); // eslint-disable-line
  }
});

module.exports = app;
