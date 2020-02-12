var getVersionedDb = require('../../../db/db');
var db = new getVersionedDb.db("v2");
db.Request = require('./model/request');
//db.User = require('../../../db/model/user');

module.exports = db;