const config = require('config');
const express = require('express');
const proxy = require('http-proxy-middleware');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../webpack.dev');

const app = express();
const port = config.get('port');
const host = config.get('host');
const forumProxy = proxy('/v1', {
  target: `http://${host}:3000`,
});

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig);
  // Webpack Configuration (dev and hot reload)
  app.use(
    webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
      host: '0.0.0.0',
    })
  );
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static('dist'));
// Set up some proxy action
app.use('/v1', forumProxy);

app.listen(port, error => {
  if (!error) {
    console.log(`OWCA is running on port: ${port}...`); // eslint-disable-line
  }
});

module.exports = app;
