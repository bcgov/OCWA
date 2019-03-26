const mongoose = require('mongoose');
const config = require('config');

mongoose.set('useCreateIndex', true);

const dbProps = config.get('database');

dbHost = dbProps.host;
dbUser = dbProps.username;
dbPass = dbProps.password;
dbName = dbProps.dbName;

const db = {};

db.init = function () {
    const logger = require('npmlog');
    const connString = 'mongodb://' + dbUser + ':' + dbPass + '@' + dbHost + '/' + dbName + '?authSource=' + dbName;
    mongoose.connect(connString, {
        useNewUrlParser: true
    });
    db.db = mongoose.connection;

    db.db.on('error', function (error) {
        logger.error(error);
        throw (error);
    });
    db.db.once('open', function () {
        logger.debug('DB connection established');
    });
    db.Project = require('./model/project');
};

module.exports = db;
