var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var log = require ('npmlog');
var config = require('config');

var db = require('./db/db').init();
var v1Router = require('./routes/v1/v1');

log.level = config.get('logLevel');
log.addLevel('debug', 2900, { fg: 'green' });

app.use(logger(config.get('morganLogType')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/v1', v1Router);

module.exports = app;

