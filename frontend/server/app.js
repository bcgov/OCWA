const bodyParser = require('body-parser');
const config = require('config');
const cookieParser = require('cookie-parser');
const express = require('express');
const fs = require('fs');
const isFunction = require('lodash/isFunction');
const get = require('lodash/get');
const log = require('npmlog');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const manifestHelpers = require('express-manifest-helpers-upgraded');
const MemoryStore = require('memorystore')(session);
const morgan = require('morgan');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const { checkAuth } = require('./auth');
const { getZone, parseApiHost, parseWsHost, storeUrl } = require('./utils');
const proxy = require('./proxy');
const authRoute = require('./routes/auth');
const filesRoute = require('./routes/files');
const versionsRoute = require('./routes/versions');
const webpackConfig = require('../webpack.dev');

// Main constants and setup
const app = express();
const cookieSecret = config.get('cookieSecret');
const help = config.has('help') ? config.get('help') : {};
const helpURL = config.has('helpURL') ? config.get('helpURL') : null;
const isDevelopment = process.env.NODE_ENV === 'development';
const filesApiHost = config.get('filesApiHost');
const forumSocket = config.get('forumSocket');
const idField = config.get('user.idField');
const exporterGroup = config.get('exporterGroup');
const ocGroup = config.get('ocGroup');
const reportsGroup = config.get('reportsGroup');
const requestSocket = config.get('requestSocket');
const exporterMode = config.get('exporterMode');
const codeExportEnabled = config.get('codeExportEnabled');
const repositoryHost = config.get('repositoryHost');
const logLevel = config.get('logLevel');
const morganLogLevel = config.get('morganLogLevel');

log.level = logLevel;
log.addLevel('debug', 2900, { fg: 'green' });

log.level = 'debug'; // config.get('logLevel');
log.addLevel('debug', 2900, { fg: 'green' });

const memoryStore = new MemoryStore({
  checkPeriod: 86400000, // prune expired entries every 24h
});

if (process.env.NODE_ENV !== 'test') {
  const logger = morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'logs', 'frontend.log'), {
      flags: 'a',
    }),
  });
  app.use(logger);
  app.use(morgan(morganLogLevel));
}

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
app.use(
  manifestHelpers.default({
    manifestPath: path.resolve(__dirname, '..', 'dist', 'manifest.json'),
    cache: !isDevelopment,
  })
);
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
app.use('/api/v2/requests', proxy.request);
app.use('/api/v1/files', filesRoute);
app.use('/versions', versionsRoute);

app.get('/hello', (req, res) => {
  res.status(200).send('hi');
});

app.post('/log', (req, res) => {
  const { state, action } = req.body;
  const date = new Date().toString();

  fs.writeFile(
    path.join(__dirname, 'logs', `state-${date}.log`),
    JSON.stringify({
      state,
      action,
    }),
    () => res.send('Log Received')
  );
});

app.get('*', checkAuth, storeUrl, (req, res) => {
  res.render('index', {
    isDevelopment,
    title: 'OCWA | Output Checker Workflow App',
    filesApiHost: parseApiHost(filesApiHost),
    socketHost: parseWsHost(forumSocket),
    requestSocketHost: parseWsHost(requestSocket),
    commit: get(process, 'env.GITHASH', ''),
    help,
    helpURL,
    codeExportEnabled,
    idField,
    exporterGroup,
    ocGroup,
    reportsGroup,
    exporterMode,
    repositoryHost,
    zone: getZone(),
  });
});

app.use((err, req, res) => {
  // set locals, only providing error in development
  /* eslint-disable no-param-reassign */
  res.locals = res.locals || {};
  res.locals.message = err.message;
  res.locals.error = isDevelopment ? err : {};
  /* eslint-enable no-param-reassign */

  log.error('app error', err);
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
