const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const history = require('connect-history-api-fallback');
const isFunction = require('lodash/isFunction');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

require('./auth');
const proxy = require('./proxy');
const authRoute = require('./routes/auth');
const webpackConfig = require('../webpack.dev');

// Main constants and setup
const app = express();
const cookieSecret = config.get('cookieSecret');
const isDevelopment = process.env.NODE_ENV === 'development';
const memoryStore = new MemoryStore({
  checkPeriod: 86400000, // prune expired entries every 24h
});

// Make sure to set this up before webpack
// app.use(
//   history({
//     htmlAcceptHeaders: ['text/html'],
//     rewrites: [
//       {
//         from: '/login',
//         to: '/login',
//       },
//     ],
//   })
// );

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
app.use('/api/v1/forums', proxy.forum);
app.use('/api/v1/requests', proxy.request);

app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals = res.locals || {};
  res.locals.message = err.message;
  res.locals.error = isDevelopment ? err : {};

  // render the error page
  if (isFunction(res.status)) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
    });
  }
});

module.exports = app;
