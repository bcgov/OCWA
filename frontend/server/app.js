const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const history = require('connect-history-api-fallback');
const isEmpty = require('lodash/isEmpty');
const passport = require('passport');
const path = require('path');
const proxy = require('http-proxy-middleware');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

require('./auth');
const authRoute = require('./routes/auth');
const webpackConfig = require('../webpack.dev');

// Main constants and setup
const app = express();
const cookieSecret = config.get('cookieSecret');
const isDevelopment = process.env.NODE_ENV === 'development';
const memoryStore = new MemoryStore({
  checkPeriod: 86400000, // prune expired entries every 24h
});

// Proxy config
const forumApiHost = config.get('forumApiHost');
const forumProxy = proxy('/v1', {
  target: `http://${forumApiHost}`,
  // Need to doctor the proxy request due to some issues with body-parser.
  onProxyReq(proxyReq, req) {
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

// Make sure to set this up before webpack
app.use(
  history({
    htmlAcceptHeaders: ['text/html'],
  })
);

if (isDevelopment) {
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('dist'));

// Auth & Session
app.use(cookieParser(cookieSecret));
app.use(
  session({
    name: 'ocwa_session',
    secret: cookieSecret,
    store: memoryStore,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoute);
app.get('/login', passport.authenticate('openidconnect'));

// Set up some proxy action
app.use('/v1', forumProxy);

module.exports = app;
