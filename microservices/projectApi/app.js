const express = require('express');
const app = express();

const config = require('config');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const log = require('npmlog');

require('./db/db').init();
const v1Router = require('./routes/v1/v1');

app.get('/version', function(_, res) {
    const hash = (process.env.GITHASH) ? process.env.GITHASH : '';
    const pjson = require('./package.json');
    const v = pjson.version;
    const version = v

    if (hash !== '') {
        version += '-' + hash
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

// v1 Router
app.use('/v1', v1Router);

// Handle 500
app.use(function(err, _, res, _) {
    log.error(err.stack)
    res.status(500);
    res.json({
        status: 500,
        message: 'Internal Server Error: ' + err.stack.split('\n', 1)[0]
    });
});

// Handle 404
app.use(function(_, res) {
    res.status(404);
    res.json({
        status: 404,
        message: 'Page Not Found'
    });
});

module.exports = app;
