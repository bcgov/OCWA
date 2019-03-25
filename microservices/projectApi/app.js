const express = require('express');
const app = express();

const config = require('config');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const log = require('npmlog');

require('./db/db').init();
const v1Router = require('./routes/v1/v1');

app.get('/version', function (req, res) {
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

module.exports = app;
