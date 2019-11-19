var getRouter = function(db){
    var notify = require('../notifications/notifications')(db);
    const projectConfig = require('../clients/project_config_client');
    const formioClient = require('../clients/formio_client');
    var util = require('../util/util');

    var express = require('express');
    var router = express.Router();

    var routes = require('../../routes/requests');

    router = routes.buildStatic(db, router);

    //create a new request
    router.post("/", function(req, res, next){
        
        var config = require('config');
        var log = require('npmlog');

        if (config.has('requiredRoleToCreateRequest')){
            var reqRole = config.get('requiredRoleToCreateRequest');
            if (req.user.groups.indexOf(reqRole)===-1){
                log.error('User ' + req.user.id + " tried to create a request but lacks required role: " + reqRole);
                res.status(403);
                res.json({error: "Lack required role to create a request"});
                return;
            }
        }

        var request = new db.Request();
        
        if (typeof(req.body.exportType) !== "undefined") {
            request.exportType = req.body.exportType;
        }

        if (typeof(req.body.name) !== "undefined") {
            request.name = req.body.name;
        }
        
        request.type = db.Request.INPUT_TYPE;
        if (req.user.zone && req.user.zone == req.user.INTERNAL_ZONE){
            request.type = db.Request.EXPORT_TYPE;
        }

        request.author = req.user.id;
        request.state = db.Request.DRAFT_STATE;
        request.topic = null;

        if (request.exportType === "code") {
            request.mergeRequestStatus = {
                code: 0,
                message: ''
            };
        }

        request.formName = config.get("formio.defaultFormName");
        request.project = req.user.getProject();

        db.Request.setChrono(request, req.user.id);

        formioClient.postSubmission(request.formName, req.body, function(formErr, formRes){
            log.verbose("formio post resp", formErr, formRes);

            if (formErr){
                res.status(500);
                res.json({error: formErr});
                return;
            }

            if (typeof(formRes) === 'string'){
                try{
                    formRes = JSON.parse(formRes);
                }catch(e){
                    res.status(500);
                    res.json({error: e});
                    return;
                }
            }

            request.submissionId = formRes._id;

            request.save(function(saveErr, result){
                if (saveErr || !result) {
                    res.status(500);
                    res.json({error: saveErr.message});
                    return;
                }

                var httpReq = require('request');

                httpReq.post({
                    url: config.get('forumApi')+'/v1/',
                    headers: {
                        'Authorization': "Bearer "+req.user.jwt
                    },
                    json: {
                        name: request.name
                    }
                }, function(apiErr, apiRes, body){
                    if ((!apiErr) && (apiRes.statusCode === 200)){
                        result.topic = body._id;
                        result.save(function(e, r){
                            if (!e){
                                res.json({message: "Successfully written", result: result});
                                notify.notify(request, req.user);
                                return;
                            }
                            //note not returning if an error as it'll force a delete below
                            log.error("Error updating request", e);
                            db.Request.deleteOne({_id: result._id}, function(e){
                                if (e) {
                                    log.error("Error deleting request", result, e);
                                }
                            });
                            res.status(500);
                            res.json({error: "Error updating request with topic topic: " + e});
                        });

                        return;
                    }

                    log.error("Error creating topic, deleting request as a result", apiRes.statusCode, apiErr, result);
                    db.Request.deleteOne({_id: result._id}, function(e){
                        if (e) {
                            log.error("Error deleting request", result, e);
                        }
                        formioClient.deleteSubmission(request.formName, request.submissionId, function(fe, fr){
                            if (fe){
                                log.error("Error deleting formio submission", fe);
                            }else{
                                log.debug("formio submission deleted");
                            }
                        });
                    });
                    res.status(500);
                    if (apiErr) {
                        res.json({error: "Error creating forum topic: " + apiErr});
                        return;
                    }else if (body.error){
                        res.json({error: "Error creating forum topic: " + body.error});
                        return;
                    }
                    res.json({error: "Unknown Error creating forum topic"})
                });



            });
        });

    });

    router = routes.buildDynamic(projectConfig, db, notify, util, router);

    return router;
}

module.exports = getRouter;
