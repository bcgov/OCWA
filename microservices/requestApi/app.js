var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var log = require ('npmlog');
var config = require('config');

var db = require('./db/db').init();
var v1Router = require('./routes/v1/v1');

app.get("/version", function(req, res){
    var hash = (process.env.GITHASH) ? process.env.GITHASH : "";
    var pjson = require('./package.json');
    var v = pjson.version;

    var version = v
    if (hash !== ""){
        version += "-"+hash
    }

    res.json({
        v: v,
        hash: hash,
        version: version,
        name: 'Request API'
    })
});

var websockets = require('./websocket');
var wss = websockets.init();

log.level = config.get('logLevel');
log.addLevel('debug', 2900, { fg: 'green' });

if (process.env.NODE_ENV !== 'test') {
    app.use(logger(config.get('morganLogType')));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/v1', v1Router);

module.exports = app;

