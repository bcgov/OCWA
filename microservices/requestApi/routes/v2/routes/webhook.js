var router = function(db){
    
    var messages = require('../messages/messages');

    var express = require('express');
    var router = express.Router();

    var routes = require('../../routes/webhook');

    routes.buildStatic(router, messages, db);
    routes.buildDynamic(router, messages, db);
    return router;
}

module.exports = router;