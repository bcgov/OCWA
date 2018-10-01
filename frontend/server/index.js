const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const isEmpty = require('lodash/isEmpty');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const proxy = require('http-proxy-middleware');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

require('./auth');
const authRoute = require('./routes/auth');
const webpackConfig = require('../webpack.dev');

const app = express();
const port = config.get('port');
const forumApiHost = config.get('forumApiHost');
const forumProxy = proxy('/v1', {
  target: `http://${forumApiHost}`,
  // Need to doctor the proxy request due to some issues with body-parser.
  onProxyReq(proxyReq, req, res) {
    const contentType = proxyReq.getHeader('Content-Type');
    let bodyData;

    if (isEmpty(req.body) || !Object.keys(req.body).length) {
      return;
    }

    if (contentType === 'application/json') {
      bodyData = JSON.stringify(req.body);
    }

    if (bodyData) {
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
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

// Express config
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('dist'));
app.use('/auth', authRoute);

// Set up some proxy action
app.use('/v1', forumProxy);

app.listen(port, error => {
  if (!error) {
    console.log(`OWCA is running on port: ${port}...`); // eslint-disable-line
  }
});

module.exports = app;
