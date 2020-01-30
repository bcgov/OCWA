var mongoose = require('mongoose');
var config = require('config');

mongoose.set('useCreateIndex', true);

const dbProps = config.get('database');

const dbHost = dbProps.host;
const dbUser = dbProps.username;
const dbPass = dbProps.password;
const dbName = dbProps.dbName;

var db = {};

db.init = function(){
    var logger = require('npmlog');
    var connString = "mongodb://" + dbUser + ":" + dbPass + "@" + dbHost + "/" + dbName + "?authSource="+dbName;

    mongoose.connect(connString, {
        useNewUrlParser: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        bufferMaxEntries: 0
    });

    db.db = mongoose.connection;

    db.db.on('error', function(error){
        logger.error(error);
        throw (error);
    });
    db.db.once('open', function(){
        logger.debug("Db connection established");
    });
    db.Comment = require('./model/comment');
    db.Topic = require('./model/topic');
    db.Permission = require('./model/permission');
    db.User = require('./model/user');

}



module.exports = db;