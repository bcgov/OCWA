const config = require('config');
const express = require('express');
const proxy = require('http-proxy-middleware');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../webpack.config.js');

const app = express();
const port = config.get('port');
const compiler = webpack(webpackConfig);
const forumProxy = proxy('/v1', {
  target: `http://${process.env.API_HOST}:3000`,
});

// Webpack Configuration (dev and hot reload)
app.use(
  webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    host: '0.0.0.0',
  })
);
app.use(webpackHotMiddleware(compiler));

// Set up some proxy action
app.use('/v1', forumProxy);

app.listen(port, error => {
  if (!error) {
    console.log(`OWCA is running on port: ${port}...`); // eslint-disable-line
  }
});

module.exports = app;
