const bodyParser = require('body-parser');
const config = require('config');
const cookieParser = require('cookie-parser');
const express = require('express');
const isFunction = require('lodash/isFunction');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

require('./auth');
const { parseApiHost } = require('./utils');
const proxy = require('./proxy');
const authRoute = require('./routes/auth');
const webpackConfig = require('../webpack.dev');

// Main constants and setup
const app = express();
const cookieSecret = config.get('cookieSecret');
const isDevelopment = process.env.NODE_ENV === 'development';
const filesApiHost = config.get('filesApiHost');
const memoryStore = new MemoryStore({
  checkPeriod: 86400000, // prune expired entries every 24h
});

if (isDevelopment) {
  const compiler = webpack(webpackConfig);
  // Webpack Configuration (dev and hot reload)
  app.use(
    webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
      host: '0.0.0.0',
      hot: true,
    })
  );
  app.use(webpackHotMiddleware(compiler));
}

// Express config
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'dist')));

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

app.get('/hello', (req, res) => {
  res.status(200).send('hi');
});

app.get(/^((?!.json|__webpack_hmr).)*$/, (req, res) => {
  res.render('index', {
    title: 'OCWA [Development Version]',
    filesApiHost: parseApiHost(filesApiHost),
  });
});

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
