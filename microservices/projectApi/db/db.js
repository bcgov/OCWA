var mongoose = require('mongoose');
var config = require('config');

mongoose.set('useCreateIndex', true);

const dbProps = config.get('database');

dbHost = dbProps.host;
dbUser = dbProps.username;
dbPass = dbProps.password;
dbName = dbProps.dbName;

var db = {};

db.init = function(){
    var logger = require('npmlog');
    var connString = "mongodb://" + dbUser + ":" + dbPass + "@" + dbHost + "/" + dbName + "?authSource="+dbName;
    mongoose.connect(connString, {
        useNewUrlParser: true
    });
    db.db = mongoose.connection;

    db.db.on('error', function(error){
        logger.error(error);
        throw (error);
    });
    db.db.once('open', function(){
        logger.debug("Db connection established");
    });
    db.Request = require('./model/request');
    db.User = require('./model/project');

    var collections = Object.keys(db.db.collections);
};



module.exports = db;