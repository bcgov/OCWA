var getRouter = function(db){
    var notify = require('../notifications/notifications')(db);
    const projectConfig = require('../clients/project_config_client');
    const formioClient = require('../clients/formio_client');
    var util = require('../util/util');

    var express = require('express');
    var router = express.Router();

    const FORMS_SUB_ROUTE = '/forms';

    var routes = require('../../routes/requests');

    router.get(FORMS_SUB_ROUTE+'/defaults', async function(req, res, next){
        var exportFormName = await projectConfig.get(req.project, 'formio.defaultExportFormName');
        var importFormName = await projectConfig.get(req.project, 'formio.defaultImportFormName');
        var exportCodeFormName = await projectConfig.get(req.project, 'formio.defaultExportCodeFormName');
        var importCodeFormName = await projectConfig.get(req.project, 'formio.defaultImportCodeFormName');
        
      res.json({
        forms: {
          internal: [
            { value: 'data', form: exportFormName },
            { value: 'code', form: exportCodeFormName },
          ],
          external: [
            {  value: 'data', form: importFormName },
            {  value: 'code', form: importCodeFormName },
          ]
        }
       });
    });

    router.get(FORMS_SUB_ROUTE, function(req, res, next){
        formioClient.getForms(function(formErr, formRes){
            if (formErr){
                res.status(500);
                res.json({error: formErr});
                return;
            }
            res.json(JSON.parse(formRes));
        });
    });

    router.post(FORMS_SUB_ROUTE, function(req, res, next){
        let adminGroup = config.get("adminGroup");
        if (req.user.groups.indexOf(adminGroup) === -1){
            res.status(403);
            res.json({error: "Forbidden"});
        }
        formioClient.postForm(req.body, function(formErr, formRes){
            if (formErr){
                res.status(500);
                res.json({error: formErr});
                return;
            }
            res.json(JSON.parse(formRes));
        });
    });

    router = routes.buildStatic(db, router);

    //create a new request
    router.post("/", async function(req, res, next){
        
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


        request.project = req.user.getProject();
        var exportFormName = await projectConfig.get(request.project, 'formio.defaultExportFormName');
        var importFormName = await projectConfig.get(request.project, 'formio.defaultImportFormName');
        var exportCodeFormName = await projectConfig.get(request.project, 'formio.defaultExportCodeFormName');
        var importCodeFormName = await projectConfig.get(request.project, 'formio.defaultImportCodeFormName');


        request.formName = request.type===db.Request.EXPORT_TYPE ? (request.exportType==="code" ? exportCodeFormName : exportFormName) : (request.exportType==="code" ? importCodeFormName : importFormName);
        

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

    //save a request
    router.put("/save/:requestId", function(req, res, next){
        var mongoose = require('mongoose');
        var requestId = mongoose.Types.ObjectId(req.params.requestId);
        var config = require('config');
        var logger = require('npmlog');

        db.Request.getAll({_id: requestId}, 1, 1, req.user, function(findErr, findRes){
            if (findErr || !findRes || findRes.length <= 0){
                res.status(400);
                res.json({error: "No such request"});
                return;
            }

            findRes = findRes[0];

            if (findRes.state > db.Request.WIP_STATE){
                res.status(400);
                res.json({error: "Can't update a request that is in a state other than Draft/WIP"});
                return;
            }

            var objectDelta = {};
            if ( (typeof(req.body.files) !== "undefined") && (JSON.stringify(req.body.files) !== JSON.stringify(findRes.files)) ){
                objectDelta['files'] = findRes.files;
            }

            if ( (typeof(req.body.supportingFiles) !== "undefined") && (JSON.stringify(req.body.supportingFiles) !== JSON.stringify(findRes.supportingFiles)) ){
                objectDelta['supportingFiles'] = findRes.supportingFiles;
            }

            findRes.name = (typeof(req.body.name) !== "undefined") ? req.body.name : findRes.name;
            findRes.files = (typeof(req.body.files) !== "undefined") ? req.body.files : findRes.files;
            findRes.supportingFiles = (typeof(req.body.supportingFiles) !== "undefined") ? req.body.supportingFiles : findRes.supportingFiles;

            var setChrono = (findRes.state!==db.Request.WIP_STATE) || (Object.keys(objectDelta).length > 0 );
            findRes.state = db.Request.WIP_STATE;

            if (setChrono) {
                db.Request.setChrono(findRes, req.user.id, objectDelta);
            }

            formioClient.putSubmission(findRes.formName, findRes.submissionId, req.body, function(formErr, formRes){
                logger.verbose("formio put resp", formErr, formRes);
    
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

                db.Request.updateOne({_id: requestId}, findRes, function(saveErr){
                    if (saveErr) {
                        res.json({error: saveErr.message});
                        return;
                    }

                    var httpReq = require('request');

                    var policy = findRes.type + "-" + findRes.exportType;

                    for (var i=0; i<findRes.files.length; i++) {
                        var myFile = findRes.files[i];
                        httpReq.put({
                            url: config.get('validationApi') + '/v1/validate/' + myFile + '/' + policy,
                            headers: {
                                'x-api-key': config.get('validationApiSecret')
                            }
                        }, function (apiErr, apiRes, body) {
                            logger.debug("put file " + myFile + " up for validation", apiErr, apiRes, body);
                            if (apiErr) {
                                logger.debug("Error validating file: ", apiErr);
                            }
                        });
                    }

                    notify.process(findRes, req.user);

                    var keys = Object.keys(formRes.data);
                    for (var i=0; i<keys.length; i++){
                        if (db.Request.schemaFields.indexOf(keys[i]) === -1){
                            findRes[keys[i]] = formRes.data[keys[i]];
                        }
                    }

                    res.json({message: "Successfully updated", result: findRes});
                });
            });
        });

    });

    router.delete('/:requestId', function(req, res){
        var mongoose = require('mongoose');
        var config = require('config');
        var logger = require('npmlog');
        var requestId = mongoose.Types.ObjectId(req.params.requestId);

        db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
            if (reqErr || !reqRes || reqRes.length <= 0){
                res.status(500);
                res.json({error: reqErr});
                return;
            }

            reqRes = reqRes[0];
            var topicId = reqRes.topic;

            if (reqRes.author == req.user.id){
                if (reqRes.state > db.Request.WIP_STATE){
                    res.status(403);
                    res.json({error: "You cannot delete a request that isn't in the draft/wip state"});
                    return;
                }

                var map = reqRes.chronology.map(x => x.enteredState);

                if (map.indexOf(db.Request.AWAITING_REVIEW_STATE) !== -1){
                    res.status(403);
                    res.json({error: "You cannot delete a request if it has ever been submitted"});
                    return;
                }

                formioClient.deleteSubmission(reqRes.formName, reqRes.submissionId, function(formErr, formRes){
                    if (formErr){
                        res.status(500);
                        res.json({error: formErr});
                        return;
                    }

                    db.Request.deleteOne({_id: requestId}, function(err, result){
                        if (err){
                            res.status(500);
                            res.json({error: err});
                            return;
                        }

                        var httpReq = require('request');
                        httpReq.delete({
                            url: config.get('forumApi')+'/v1/'+topicId,
                            headers: {
                                'Authorization': "Bearer "+req.user.jwt
                            }
                        }, function(apiErr, apiRes, body){
                            if ((!apiErr) && (apiRes.statusCode === 200)){
                                logger.debug("Deleted request topic");
                            }else{
                                logger.error("Error deleting topic: ", apiErr, body);
                            }
                        });

                        notify.gitops().delete(reqRes);

                        res.json({message: "Record successfully deleted"});
                    });
                });

            }else{
                res.status(403);
                res.json({error: "You did not create this request and can therefore not delete it"});
            }


        });
    });

    router.get(FORMS_SUB_ROUTE+'/:formName', function(req, res, next){
        var formName = req.params.formName;
        formioClient.getForm(formName, function(formErr, formRes){
            if (formErr){
                res.status(500);
                res.json({error: formErr});
                return;
            }
            res.json(JSON.parse(formRes));
        });
    });

    router.put(FORMS_SUB_ROUTE+'/:formName', function(req, res, next){
        let adminGroup = config.get("adminGroup");
        if (req.user.groups.indexOf(adminGroup) === -1){
            res.status(403);
            res.json({error: "Forbidden"});
        }
        var formName = req.params.formName;
        formioClient.putForm(formName, req.body, function(formErr, formRes){
            if (formErr){
                res.status(500);
                res.json({error: formErr});
                return;
            }
            res.json(JSON.parse(formRes));
        });
    });

    router.delete('/formio/:formName', function(req, res, next){
        var adminGroup = config.get("adminGroup");

        if (req.user.groups.indexOf(adminGroup) === -1){
            res.status(403);
            res.json({error: "Forbidden"});
        }
        var formName = req.params.formName;
        formioClient.putForm(formName, req.body, function(formErr, formRes){
            if (formErr){
                res.status(500);
                res.json({error: formErr});
                return;
            }
            res.json(JSON.parse(formRes));
        });
    });

    router = routes.buildDynamic(projectConfig, db, notify, util, router);

    return router;
};

module.exports = getRouter;
