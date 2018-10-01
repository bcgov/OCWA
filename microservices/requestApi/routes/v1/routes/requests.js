var express = require('express');
var router = express.Router();


// path /v1/

/* GET all requests. */
router.get('/', function(req, res, next) {
    var logger = require('npmlog');
    var db = require('../db/db');

    var limit = 100;
    if (typeof(req.query.limit) !== "undefined"){
        limit = req.query.limit;
    }
    if (limit > 100){
        limit = 100;
    }

    var page = 1;
    if (typeof(req.query.page) !== "undefined"){
        page = req.query.page;
    }
    if (page < 1){
        page = 1;
    }

    db.Request.getAll({}, limit, page, req.user, function(err, requestRes){
        if (err || !requestRes){
            res.json({error: err.message});
            return;
        }
        res.json(requestRes);
    });


});

//create a new request
router.post("/", function(req, res, next){
    var db = require('../db/db');
    var config = require('config');

    var request = new db.Request();
    request.name = req.body.name;
    request.tags = req.body.tags;
    request.purpose = req.body.purpose;
    request.variableDescriptions = req.body.variableDescriptions;
    request.selectionCriteria = req.body.selectionCriteria;
    request.steps = req.body.steps;
    request.freq = req.body.freq;
    request.confidentiality = req.body.confidentiality;
    request.author = req.user.id;
    request.topic = null;


    var log = require('npmlog');

    request.save(function(saveErr, result){
        if (saveErr || !result) {
            res.json({error: saveErr});
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
            if (!apiErr){
                result.topic = body._id;
                result.save(function(e, r){
                    if (!e){
                        res.json({message: "Successfully written"});
                        return;
                    }
                    //note not returning if an error as it'll force a delete below
                    log.error("Error updating request", e);
                    db.Request.deleteOne({_id: result._id}, function(e){
                        if (e) {
                            log.error("Error deleting request", result, e);
                        }
                    });
                    res.json({error: "Error updating request with topic topic: " + e});
                });

                return;
            }

            log.error("Error creating topic, deleting request as a result", apiErr, result);
            db.Request.deleteOne({_id: result._id}, function(e){
                if (e) {
                    log.error("Error deleting request", result, e);
                }
            });
            res.json({error: "Error creating forum topic: " + apiErr});
        });



    });

});

/* GET specific request. */
router.get('/:requestId', function(req, res, next) {
    var logger = require('npmlog');
    var db = require('../db/db');
    var requestId = req.params.requestId;

    db.Request.getAll({_id: requestId}, 1, 1, req.user, function(err, requestRes){
        if (err || !requestRes){
            res.json({error: err.message});
            return;
        }
        res.json(requestRes);
    });


});


//update a request
router.put("/:requestId", function(req, res, next){
    var db = require('../db/db');
    var requestId = req.params.requestId;

    var request = new db.Request;
    request._id = requestId;
    request.name = req.body.name;
    request.tags = req.body.tags;
    request.purpose = req.body.purpose;
    request.variableDescriptions = req.body.variableDescriptions;
    request.selectionCriteria = req.body.selectionCriteria;
    request.steps = req.body.steps;
    request.freq = req.body.freq;
    request.confidentiality = req.body.confidentiality;
    request.author = req.user.id;

    db.Request.update({_id: requestId}, request, function(saveErr, result){
        if (saveErr || !result) {
            res.json({error: saveErr.message});
            return;
        }


        res.json({message: "Successfully updated"});
    });

});

//update a request
router.put("/save/:requestId", function(req, res, next){
    var db = require('../db/db');
    var requestId = req.params.requestId;

    var request = new db.Request;
    request._id = requestId;
    request.name = req.body.name;
    request.tags = req.body.tags;
    request.purpose = req.body.purpose;
    request.variableDescriptions = req.body.variableDescriptions;
    request.selectionCriteria = req.body.selectionCriteria;
    request.steps = req.body.steps;
    request.freq = req.body.freq;
    request.confidentiality = req.body.confidentiality;
    request.author = req.user.id;

    request.status = db.Request.WIP_STATE = 1;

    db.Request.update({_id: requestId}, request, function(saveErr, result){
        if (saveErr || !result) {
            res.json({error: saveErr.message});
            return;
        }

        var httpReq = require('request');

        for (var i=0; i<result.files.length; i++) {
            httpReq.put({
                url: config.get('validationApi') + '/v1/validate/' + result.files[i],
                headers: {
                    'X-API-KEY': config.get('validationApiSecret')
                }
            }, function (apiErr, apiRes, body) {
                if (apiErr) {
                    logger.debug("Error validating file: ", apiErr);
                }
            });
        }


        res.json({message: "Successfully updated"});
    });

});

router.put('/submit/:requestId', function(req, res, next){
    var db = require('../db/db');
    var config = require('config');
    var requestId = req.params.requestId;

    var httpReq = require('request');

    db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
        if (reqErr || !reqRes){
            res.json({error: reqErr.message})
        }
        var numResults = 0;
        var allResults = [];
        var pass = true;
        for (var i=0; i<reqRes.files.length; i++) {
            httpReq.get({
                url: config.get('validationApi') + '/v1/validate/'+reqRes.files[i],
                headers: {
                    'X-API-KEY': config.get('validationApiSecret')
                }
            }, function (apiErr, apiRes, body) {
                if (apiErr || ! apiRes) {
                    allResults.push({error: apiErr.message});
                    pass = false;
                }else {
                    // 0 is pass
                    allResults.push({
                        pass: (apiRes.results[0].state === 0),
                        state: apiRes.results[0].state,
                        message: apiRes.results[0].message
                    });
                    if (apiRes.results[0].state !== 0){
                        pass = false;
                    }
                }
                numResults++;
                if (numResults === reqRes.files.length){
                    if (pass){
                        db.Request.update({_id: reqRes._id}, {$set: {state: db.Request.AWAITING_REVIEW_STATE}}, function(updateErr){
                            if (!updateErr){
                                res.json({message: "Request submitted", results: allResults});
                                return;
                            }
                            res.json({error: updateErr.message});
                        });

                        return;
                    }
                    res.json({error: "Request submission failed, validation failed", results: allResults});
                }

            });
        }
    });
});

router.put('/cancel/:requestId', function(req, res){
    var db = require('../db/db');
    var requestId = req.params.requestId;

    db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
        if (reqErr || !reqRes){
            res.json({error: reqErr.message})
        }

        if (reqRes.author === req.user.id) {
            db.Request.update({_id: reqRes._id}, {$set: {state: db.Request.CANCELLED_STATE}}, function (updateErr) {
                if (!updateErr) {
                    res.json({message: "Request cancelled successfully"});
                    return;
                }
                res.json({error: updateErr.message})

            });
        }
        logger.error("User " + req.user.id + " tried to cancel request " + requestId + " but does not have access as is not the author");
        res.json({error: "You do not have permission to cancel this request as you are not the author of this request"})
    });
});

router.put('/approve/:requestId', function(req, res){
    var db = require('../db/db');
    var config = require('config');
    var requestId = req.params.requestId;

    db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
        if (reqErr || !reqRes){
            res.json({error: reqErr.message})
        }

        if (req.user.groups.indexOf(config.get("outputCheckerGroup"))) {
            db.Request.update({_id: reqRes._id}, {$set: {state: db.Request.APPROVED_STATE}}, function (updateErr) {
                if (!updateErr) {
                    res.json({message: "Request approved successfully"});
                    return;
                }
                res.json({error: updateErr.message})

            });
        }
    });
});

router.put('/deny/:requestId', function(req, res){
    var db = require('../db/db');
    var config = require('config');
    var requestId = req.params.requestId;

    db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
        if (reqErr || !reqRes){
            res.json({error: reqErr.message})
        }

        if (req.user.groups.indexOf(config.get("outputCheckerGroup"))) {
            db.Request.update({_id: reqRes._id}, {$set: {state: db.Request.APPROVED_STATE}}, function (updateErr) {
                if (!updateErr) {
                    res.json({message: "Request denied successfully"});
                    return;
                }
                res.json({error: updateErr.message})

            });
        }
    });
});

router.put('/requestRevisions/:requestId', function(req, res){
    var db = require('../db/db');
    var config = require('config');
    var requestId = req.params.requestId;

    db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
        if (reqErr || !reqRes){
            res.json({error: reqErr.message})
        }

        if (req.user.groups.indexOf(config.get("outputCheckerGroup"))) {
            db.Request.update({_id: reqRes._id}, {$set: {state: db.Request.WIP_STATE}}, function (updateErr) {
                if (!updateErr) {
                    res.json({message: "Requested revision(s) successfully"});
                    return;
                }
                res.json({error: updateErr.message})

            });
        }
    });
});


module.exports = router;