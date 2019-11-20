var router = function(db){
    
    var messages = require('../messages/messages');

    var express = require('express');
    var router = express.Router();

    var routes = require('../../routes/webhook');

    routes.buildStatic(router, messages);
    routes.buildDynamic(router, messages);
    return router;
}

module.exports = router;