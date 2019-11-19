var router = function(db){
    var notify = require('../notifications/notifications')(db);
    var projectConfig = require('../clients/project_config_client');
    var util = require('../util/util');

    var express = require('express');
    var router = express.Router();

    var routes = require('../../routes/requests');

    routes.buildStatic(db, router);
    routes.buildDynamic(projectConfig, db, notify, util, router);
    return router;
}

module.exports = router;