var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var log = require ('npmlog');
var config = require('config');

var v1Router = require('./routes/v1/v1');
var v2Router = require('./routes/v2/v2');

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

log.level = config.get('logLevel');
log.addLevel('debug', 2900, { fg: 'green' });

if (process.env.NODE_ENV !== 'test') {
    app.use(logger(config.get('morganLogType')));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/v1', v1Router);
app.use('/v2', v2Router);

module.exports = app;

