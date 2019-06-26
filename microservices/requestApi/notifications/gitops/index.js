var notifications = {};

var fs = require('fs');

var path = require('path');

var db = require('../../db/db');

notifications.process = function(request, user){

    var config = require('config');
    var logger = require('npmlog');

    if (!config.has('gitops')){
        logger.debug("Notifications[gitops] - Triggered but not configured");
        return;
    }

    logger.verbose("Notification[gitops]", request);
    logger.verbose("Notification[gitops]", "exportType=", request.exportType, ",State=", db.Request.stateToText(request.state), ",Type=", request.type);

    var gitopsConfig = config.get('gitops');
    if (!gitopsConfig.enabled){
        return;
    }

    // exportType == "code"
    // type == "export" and state == 3 (In Review) THEN: request_export
    // type == "import" and state == 3 (In Review) THEN: request_import
    // 

    // 1 -> 2 : (awaiting review) request_export (or import)
    // 1 -> 3 : (in review) : request_export (or import)
    // 3 -> 1 : (WIP) : cancel
    // 2 -> 1 : (WIP) : cancel
    // 0 -> 1 : NO ACTION

    // 4, 5 AND 6 ARE END STATES

    // call: POST /request/create
    // - type (export/import)
    // - repository
    // - branch
    // - externalRepository
    //
    // Returns the location URL for Merge Request

    // call: POST /request/merge
    // - type (export/import)
    // - repository
    // - branch
    // - user.id
    // - user.email

    // call: POST /request/close
    // - type (export/import)
    // - repository
    // - branch

    logger.verbose("Notification[gitops] triggered");
};

module.exports = notifications;