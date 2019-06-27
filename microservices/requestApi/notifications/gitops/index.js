var notifications = {};

const path = require('path');
const config = require('config');
const logger = require('npmlog');
const httpReq = require('request');

const db = require('../../db/db');

notifications.process = function(request, user){


    if (!config.has('gitops')){
        logger.debug("Notifications[gitops] - Triggered but not configured");
        return;
    }

    logger.info("Notification[gitops]", "exportType=", request.exportType, ",State=", db.Request.stateToText(request.state), ",Type=", request.type);

    var gitopsConfig = config.get('gitops');
    if (!gitopsConfig.enabled){
        return;
    }

    if (request.exportType != "code") {
        return;
    }

    let transition = this.getTransition(request);

    if (transition == "1-2" || transition == "1-3") {
        let payload = {
            direction: request.type,
            repository: request.repository,
            externalRepository: request.externalRepository,
            branch: request.branch
        }
        httpReq.post({
            url: gitopsConfig.url + '/v1/request',
            json: payload,
            headers: {
                'x-api-key': gitopsConfig.secret
            }
        }, function(apiErr, apiRes, _response){
            if ((!apiErr) && (apiRes.statusCode === 200)){
                var data = (typeof _response === "string" ? JSON.parse(_response):_response);

                notifications.updateRequest(request, data.location);

                logger.info("Notification[gitops] Request Success - ", data);
            } else {
                logger.error("Errors ", apiErr, apiRes.statusCode, apiRes.statusMessage, apiRes.body);
            }
        });

    } else if (transition == "3-1" /* back to WIP */ || transition == "2-1" /* back to WIP */ ) {
        this.callGitops(request, 'delete').then (d => {
            notifications.updateRequest(request, null);
        }).catch (err => {
            logger.error("Errors deleting MR in Gitops", err);
        });

    } else if (request.state == 4 /* approved */) {
        this.callGitops(request, 'approve').catch (err => {
            logger.error("Errors approving MR in Gitops", err);
        });

    } else if (request.state == 5 /* denied */ || request.state == 6 /* cancelled */) {
        this.callGitops(request, 'close').catch (err => {
            logger.error("Errors closing MR in Gitops ", err);
        });

    } else {
        logger.verbose("Notification[gitops] no action taken.  State=", request.state, ", Transition=", transition);
    }

    logger.verbose("Notification[gitops] triggered");
};


notifications.getTransition = function(request) {
    const len = request['chronology'].length;
    return "" + request['chronology'][len-2].enteredState + "-" + request['chronology'][len-1].enteredState
}

notifications.callGitops = function(request, action) {
    var gitopsConfig = config.get('gitops');

    return new Promise(function(resolve, reject) {    
        let payload = {
            direction: request.type,
            repository: request.repository,
            branch: request.branch
        }
        httpReq.put({
            url: gitopsConfig.url + '/v1/request/' + action,
            json: payload,
            headers: {
                'x-api-key': gitopsConfig.secret
            }
        }, function(apiErr, apiRes, _response){
            if ((!apiErr) && (apiRes.statusCode === 200)){
                var data = (typeof _response === "string" ? JSON.parse(_response):_response);

                logger.info("Notification[gitops] ", action, " Success - ", data);
                resolve(data);
            } else {
                logger.error("Errors ", apiErr, apiRes.statusCode, apiRes.statusMessage);
                reject(apiErr);
            }
        });
    });
}

notifications.updateRequest = function(request, link) {
    let id = request._id;
    db.Request.findById(id, (err, requestForUpdate) => {
        requestForUpdate.mergeRequestLink = link;
        db.Request.updateOne({_id: id}, requestForUpdate, (err) => {
            if (err){
                logger.error("Errors updating request", err);
            } else {
                logger.info("Notification[gitops] Update request with link ", link);
            }
        });
    });
}
module.exports = notifications;