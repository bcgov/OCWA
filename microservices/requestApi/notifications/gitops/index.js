var gitops = function(db){

    var gitops = {};

    const config = require('config');
    const logger = require('npmlog');
    const httpReq = require('request');

    gitops.process = function(request, user){

        if (!config.has('gitops')){
            logger.debug("Notifications[gitops] - Triggered but not configured");
            return;
        }

        logger.info("[gitops]", "exportType=", request.exportType, ",State=", db.Request.stateToText(request.state), ",Type=", request.type);

        var gitopsConfig = config.get('gitops');
        if (!gitopsConfig.enabled){
            return;
        }

        if (request.exportType != "code") {
            return;
        }

        let transition = this.getTransition(request);

        if (transition == "1-2" /* WIP to Awaiting Review */|| transition == "1-3" /* WIP to In Review */ ) {
        } else if (transition == "-0" /* Created */ ) {
        } else if (transition == "0-1" /* Draft to WIP */ && request.mergeRequestStatus.code == 0) {
            let payload = {
                direction: request.type,
                repository: request.repository,
                externalRepository: request.externalRepository,
                branch: request.branch
            }

            this.updateRequest(request, null, 100, 'Waiting for merge request to be ready.');

            httpReq.post({
                url: gitopsConfig.url + '/v1/request',
                json: payload,
                headers: {
                    'x-api-key': gitopsConfig.secret
                }
            }, function(apiErr, apiRes, _response){
                if ((!apiErr) && (apiRes.statusCode === 200)){
                    var data = (typeof _response === "string" ? JSON.parse(_response):_response);

                    logger.info("[gitops] Request Success - ", data);

                    this.updateRequest(request, data.location, 200, '');

                } else {

                    logger.error("Errors ", apiErr, apiRes.statusCode, apiRes.statusMessage, apiRes.body);
                    if (apiErr || apiRes.statusCode === 400) {
                        this.updateRequest(request, null, 400, (apiErr ? apiErr : apiRes.body['message']));
                    } else {
                        this.updateRequest(request, null, 400, 'Unexpected error - please try again later.');
                    }
                }
            });

        } else if (transition == "3-1" /* back to WIP */ || transition == "2-1" /* back to WIP */ ) {
            //this.callGitops(request, 'delete').then (d => {
            //    this.updateRequest(request, null, 200, '');
            //});

        } else if (request.state == 4 /* approved */) {
            //this.callGitops(request, 'merge');

        } else if (request.state == 5 /* denied */ || request.state == 6 /* cancelled */) {
            this.callGitops(request, 'close').catch (err => {
                logger.error("Errors handling ", action, " MR in Gitops", err);
                this.updateRequest(request, null, 400, err);
            });

        } else {
            logger.verbose("[gitops] no action taken.  State=", request.state, ", Transition=", transition);
        }

        logger.verbose("[gitops] triggered");
    };

    gitops.delete = function(request) {
        if (!config.has('gitops')){
            logger.debug("Delete[gitops] - Triggered but not configured");
            return;
        }

        logger.info("Delete[gitops]", "exportType=", request.exportType, ",State=", db.Request.stateToText(request.state), ",Type=", request.type);

        var gitopsConfig = config.get('gitops');
        if (!gitopsConfig.enabled){
            return;
        }

        if (request.exportType != "code") {
            return;
        }

        this.callGitops(request, 'delete').catch (err => {
            logger.error("Delete[gitops] Error from Gitops", err);
        });
    };

    gitops.approve = function(request) {
        if (!config.has('gitops')){
            logger.debug("Approve[gitops] - Triggered but not configured");
            return this.noop();
        }

        logger.info("Approve[gitops]", "exportType=", request.exportType, ",State=", db.Request.stateToText(request.state), ",Type=", request.type);

        var gitopsConfig = config.get('gitops');
        if (!gitopsConfig.enabled){
            return this.noop();
        }

        if (request.exportType != "code") {
            return this.noop();
        }

        return this.callGitops(request, 'merge');
    };

    gitops.getTransition = function(request) {
        const len = request['chronology'].length;
        if (len == 0) {
            return "";
        } else if (len < 2) {
            return "-" + request['chronology'][len-1].enteredState
        }
        return "" + request['chronology'][len-2].enteredState + "-" + request['chronology'][len-1].enteredState
    }

    gitops.noop = function() {
        return new Promise(function(resolve, reject) {
            resolve(); 
        });
    }

    gitops.callGitops = function(request, action) {
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
                    logger.info("Response = " + _response);
                    var data = (typeof _response === "string" ? JSON.parse(_response):_response);

                    logger.info("[gitops] ", action, " Success - ", data);
                    resolve(data);
                } else {
                    error = 'Unexpected error - please try again later.';
                    if (apiErr || apiRes.statusCode === 400) {
                        error = (apiErr ? apiErr : apiRes.body['message']);
                    }
                    logger.error("Errors ", apiErr, apiRes.statusCode, apiRes.statusMessage, error);
                    reject(error);
                }
            });
        });
    }

    gitops.updateRequest = function(request, link, code, message) {
        let id = request._id;
        return new Promise(function(resolve, reject) {    
            db.Request.findById(id, (err, requestForUpdate) => {
                requestForUpdate.mergeRequestLink = link;
                requestForUpdate.mergeRequestStatus = {
                    code: code,
                    message: message
                };
                db.Request.updateOne({_id: id}, requestForUpdate, (err) => {
                    if (err){
                        logger.error("Errors updating request", err);
                        reject(err);
                    } else {
                        logger.info("[gitops] Update request with link ", link);
                        resolve('');
                    }
                });
            });
        });
    }

    return gitops;
}

module.exports = gitops;