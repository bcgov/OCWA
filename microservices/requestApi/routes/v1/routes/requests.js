var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// path /v1/

router.get('/status_codes', function(req, res, next) {
    var db = require('../db/db');
    res.json(db.Request.stateCodeLookup());
});

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

    var q = {};
    if (typeof(req.query.state) !== "undefined"){
        q['state'] = req.query.state;
    }

    if (typeof(req.query.name) !== "undefined"){
        q['name'] = req.query.name;
    }


    db.Request.getAll(q, limit, page, req.user, function(err, requestRes){
        if (err || !requestRes){
            res.status(500);
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
    if (typeof(req.body.name) !== "undefined") {
        request.name = req.body.name;
    }

    if (typeof(req.body.tags) !== "undefined") {
        request.tags = req.body.tags;
    }

    if (typeof(req.body.purpose) !== "undefined") {
        request.purpose = req.body.purpose;
    }

    if (typeof(req.body.variableDescriptions) !== "undefined") {
        request.variableDescriptions = req.body.variableDescriptions;
    }

    if (typeof(req.body.selectionCriteria) !== "undefined") {
        request.selectionCriteria = req.body.selectionCriteria;
    }

    if (typeof(req.body.steps) !== "undefined") {
        request.steps = req.body.steps;
    }

    if (typeof(req.body.freq) !== "undefined") {
        request.freq = req.body.freq;
    }

    if (typeof(req.body.confidentiality) !== "undefined") {
        request.confidentiality = req.body.confidentiality;
    }

    request.author = req.user.id;
    request.state = db.Request.DRAFT_STATE;
    request.topic = null;

    db.Request.setChrono(request, req.user.id);


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
            if (!apiErr){
                result.topic = body._id;
                result.save(function(e, r){
                    if (!e){
                        res.json({message: "Successfully written", result: result});
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

            log.error("Error creating topic, deleting request as a result", apiErr, result);
            db.Request.deleteOne({_id: result._id}, function(e){
                if (e) {
                    log.error("Error deleting request", result, e);
                }
            });
            res.status(500);
            res.json({error: "Error creating forum topic: " + apiErr});
        });



    });

});

/* GET specific request. */
router.get('/:requestId', function(req, res, next) {
    var logger = require('npmlog');
    var db = require('../db/db');

    var requestId = mongoose.Types.ObjectId(req.params.requestId);

    db.Request.getAll({_id: requestId}, 1, 1, req.user, function(findErr, findRes){
        if (findErr || !findRes){
            res.status(500);
            res.json({error: findErr.message});
            return;
        }
        res.json(findRes);
    });


});

//save a request
router.put("/save/:requestId", function(req, res, next){
    var db = require('../db/db');
    var requestId = mongoose.Types.ObjectId(req.params.requestId);
    var logger = require('npmlog');

    db.Request.getAll({_id: requestId}, 1, 1, req.user, function(findErr, findRes){
        if (findErr || !findRes){
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

        findRes.name = (typeof(req.body.name) !== "undefined") ? req.body.name : findRes.name;
        findRes.tags = (typeof(req.body.tags) !== "undefined") ? req.body.tags : findRes.tags;
        findRes.purpose = (typeof(req.body.purpose) !== "undefined") ? req.body.purpose : findRes.purpose;
        findRes.variableDescriptions = (typeof(req.body.variableDescriptions) !== "undefined") ? req.body.variableDescriptions : findRes.variableDescriptions;
        findRes.selectionCriteria = (typeof(req.body.selectionCriteria) !== "undefined") ? req.body.selectionCriteria : findRes.selectionCriteria;
        findRes.steps = (typeof(req.body.steps) !== "undefined") ? req.body.steps : findRes.steps;
        findRes.freq = (typeof(req.body.freq) !== "undefined") ? req.body.freq : findRes.freq;
        findRes.confidentiality = (typeof(req.body.confidentiality) !== "undefined") ? req.body.confidentiality : findRes.confidentiality;

        var setChrono = findRes.state!==db.Request.WIP_STATE;
        findRes.state = db.Request.WIP_STATE;

        if (setChrono) {
            db.Request.setChrono(findRes, req.user.id);
        }

        db.Request.updateOne({_id: requestId}, findRes, function(saveErr){
            if (saveErr) {
                res.json({error: saveErr.message});
                return;
            }

            var httpReq = require('request');

            for (var i=0; i<findRes.files.length; i++) {
                httpReq.put({
                    url: config.get('validationApi') + '/v1/validate/' + findRes.files[i],
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

});

//submit a request
router.put('/submit/:requestId', function(req, res, next){
    var db = require('../db/db');
    var config = require('config');
    var logger = require('npmlog');
    var requestId = mongoose.Types.ObjectId(req.params.requestId);

    var httpReq = require('request');

    db.Request.getAll({_id: requestId}, 1, 1, req.user, function (reqErr, reqRes) {
        if (reqErr || !reqRes || reqRes.length<0) {
            res.status(400);
            res.json({error: reqErr.message});
            return;
        }

        reqRes = reqRes[0];

        if (reqRes.state !== db.Request.WIP_STATE){
            res.status(400);
            res.json({error: "Can't submit a request that isn't in wip state"});
            return;
        }

        if (req.user.id !== reqRes.author){
            res.status(403);
            logger.error("User " + res.user.id + " tried to submit a request they don't own");
            res.json({error: "Can't submit a request that isn't yours"});
            return;
        }

        var numResults = 0;
        var allResults = [];
        var pass = true;


        if (reqRes.reviewers.length > 0){
            reqRes.state = db.Request.IN_REVIEW_STATE;
        }else {
            reqRes.state = db.Request.AWAITING_REVIEW_STATE;
        }

        console.log("RR", reqRes);
        db.Request.setChrono(reqRes, req.user.id);

        if (reqRes.files.length <= 0){
            db.Request.updateOne({_id: reqRes._id}, reqRes, function (updateErr) {
                if (!updateErr) {
                    res.json({message: "Request submitted", results: allResults});
                    return;
                }
                res.json({error: updateErr.message});
            });
        }

        for (var i = 0; i < reqRes.files.length; i++) {
            httpReq.get({
                url: config.get('validationApi') + '/v1/validate/' + reqRes.files[i],
                headers: {
                    'X-API-KEY': config.get('validationApiSecret')
                }
            }, function (apiErr, apiRes, body) {
                if (apiErr || !apiRes) {
                    allResults.push({error: apiErr.message});
                    pass = false;
                } else {
                    // 0 is pass
                    allResults.push({
                        pass: (apiRes.results[0].state === 0),
                        state: apiRes.results[0].state,
                        message: apiRes.results[0].message
                    });
                    if (apiRes.results[0].state !== 0) {
                        pass = false;
                    }
                }
                numResults++;
                if (numResults === reqRes.files.length) {
                    if (pass) {
                        db.Request.updateOne({_id: reqRes._id}, reqRes, function (updateErr) {
                            if (!updateErr) {
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
    var requestId = mongoose.Types.ObjectId(req.params.requestId);
    var logger = require('npmlog');

    db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
        if (reqErr || !reqRes){
            res.status(500);
            res.json({error: reqErr.message});
            return;
        }

        reqRes = reqRes[0];

        if ( (reqRes.state === db.Request.APPROVED_STATE) || (reqRes.state === db.Request.DENIED_STATE) ) {
            res.status(400);
            res.json({error: "Can't cancel a request that has been approved or denied"});
            return;
        }

        if (reqRes.state === db.Request.CANCELLED_STATE){
            res.status(400);
            res.json({error: "Can't cancel a request that is already cancelled"});
            return;
        }

        reqRes.state = db.Request.CANCELLED_STATE;
        db.Request.setChrono(reqRes, req.user.id);

        if (reqRes.author === req.user.id) {
            db.Request.updateOne({_id: reqRes._id}, reqRes, function (updateErr) {
                if (!updateErr) {
                    //works around a bug where the date isn't coming back from findOneAndUpdate so just hard casting it properly
                    reqRes.chronology[reqRes.chronology.length-1].timestamp = new Date(reqRes.chronology[reqRes.chronology.length-1].timestamp);

                    logRequestFinalState(reqRes, req.user);
                    res.json({message: "Request cancelled successfully"});
                    return;
                }
                res.status(500);
                res.json({error: updateErr.message});
                return;
            });
            return;
        }
        logger.error("User " + req.user.id + " tried to cancel request " + requestId + " but does not have access as is not the author");
        res.status(403);
        res.json({error: "You do not have permission to cancel this request as you are not the author of this request"})
    });
});

router.put('/withdraw/:requestId', function(req, res){
    var db = require('../db/db');
    var requestId = mongoose.Types.ObjectId(req.params.requestId);
    var logger = require('npmlog');


    db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
        if (reqErr || !reqRes || reqRes.length === 0){
            res.status(500);
            res.json({error: reqErr.message});
            return;
        }

        reqRes = reqRes[0];

        if ( (reqRes.state === db.Request.APPROVED_STATE) || (reqRes.state === db.Request.DENIED_STATE) ) {
            res.status(400);
            res.json({error: "Can't withdraw a request that has been approved or denied"});
            return;
        }

        if ( (reqRes.state === db.Request.DRAFT_STATE) || (reqRes.state === db.Request.WIP_STATE) ) {
            res.status(400);
            res.json({error: "No need to withdraw a request that hasn't been submitted"});
            return;
        }

        if (reqRes.state === db.Request.CANCELLED_STATE){
            res.status(400);
            res.json({error: "Can't withdraw a cancelled request"});
            return;
        }

        reqRes.state = db.Request.WIP_STATE;
        db.Request.setChrono(reqRes, req.user.id);

        if (reqRes.author === req.user.id) {
            db.Request.updateOne({_id: reqRes._id}, reqRes, function (updateErr) {
                if (!updateErr) {
                    res.json({message: "Request withdrawn successfully"});
                    return;
                }
                res.status(500);
                res.json({error: updateErr.message});
            });
            return;
        }
        logger.error("User " + req.user.id + " tried to withdraw request " + requestId + " but does not have access as is not the author");
        res.status(403);
        res.json({error: "You do not have permission to cancel this request as you are not the author of this request"})
    });
});

router.put('/approve/:requestId', function(req, res){
    var db = require('../db/db');
    var config = require('config');
    var requestId = mongoose.Types.ObjectId(req.params.requestId);
    var logger = require('npmlog');

    db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
        if (reqErr || !reqRes){
            res.status(500);
            res.json({error: reqErr.message});
            return;
        }

        reqRes = reqRes[0];

        if (reqRes.state !== db.Request.IN_REVIEW_STATE){
            res.status(400);
            res.json({error: "Only a request in review can be approved"});
            return;
        }

        if (req.user.groups.indexOf(config.get("outputCheckerGroup"))) {
            var reviewers = reqRes.reviewers;

            if (reviewers.indexOf(req.user.id) === -1) {
                reviewers.push(req.user.id);
            }

            reqRes.state = db.Request.APPROVED_STATE;
            db.Request.setChrono(reqRes, req.user.id);
            reqRes.reviewers = reviewers;

            db.Request.updateOne({_id: reqRes._id}, reqRes, function (updateErr) {
                if (!updateErr) {
                    //works around a bug where the date isn't coming back from findOneAndUpdate so just hard casting it properly
                    reqRes.chronology[reqRes.chronology.length-1].timestamp = new Date(reqRes.chronology[reqRes.chronology.length-1].timestamp);
                    logRequestFinalState(reqRes, req.user);
                    res.json({message: "Request approved successfully"});
                    return;
                }
                res.status(500);
                res.json({error: updateErr.message});
                return;

            });
        }else{
            res.status(403);
            res.json("You do not have the necessary permissions to approve an output request");
            logger.error("User " + req.user.id + " tried to approve an output request but lacks the required permission");
            return;
        }
    });
});

router.put('/deny/:requestId', function(req, res){
    var db = require('../db/db');
    var config = require('config');
    var requestId = mongoose.Types.ObjectId(req.params.requestId);
    var logger = require('npmlog');

    if (config.has('allowDenyRequest') && !config.get('allowDenyRequest')){
        res.status(400);
        res.json({error: "Denying requests is not allowed"});
        return;
    }

    db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
        if (reqErr || !reqRes){
            res.status(500);
            res.json({error: reqErr.message});
            return;
        }

        reqRes = reqRes[0];

        if (reqRes.state !== db.Request.IN_REVIEW_STATE){
            res.status(400);
            res.json({error: "Only a request in review can be denied"});
            return;
        }

        if (req.user.groups.indexOf(config.get("outputCheckerGroup"))) {
            var reviewers = reqRes.reviewers;

            if (reviewers.indexOf(req.user.id) === -1) {
                reviewers.push(req.user.id);
            }

            reqRes.state = db.Request.DENIED_STATE;
            db.Request.setChrono(reqRes, req.user.id);
            reqRes.reviewers = reviewers;

            db.Request.updateOne({_id: reqRes._id}, reqRes, function (updateErr) {
                if (!updateErr) {
                    //works around a bug where the date isn't coming back from findOneAndUpdate so just hard casting it properly
                    reqRes.chronology[reqRes.chronology.length-1].timestamp = new Date(reqRes.chronology[reqRes.chronology.length-1].timestamp);
                    logRequestFinalState(reqRes, req.user);
                    res.json({message: "Request denied successfully"});
                    return;
                }
                res.status(500);
                res.json({error: updateErr.message})

            });
        }else{
            res.status(403);
            res.json("You do not have the necessary permissions to approve an output request");
            logger.error("User " + req.user.id + " tried to deny an output request but lacks the required permission");
            return;
        }
    });
});

router.put('/requestRevisions/:requestId', function(req, res){
    var db = require('../db/db');
    var config = require('config');
    var requestId = mongoose.Types.ObjectId(req.params.requestId);
    var logger = require('npmlog');

    db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
        if (reqErr || !reqRes){
            res.status(500);
            res.json({error: reqErr.message});
            return;
        }

        reqRes = reqRes[0];

        if (reqRes.state !== db.Request.IN_REVIEW_STATE){
            res.status(400);
            res.json({error: "Only a request in review can have revisions requested"});
            return;
        }

        if (req.user.groups.indexOf(config.get("outputCheckerGroup"))) {
            var reviewers = reqRes.reviewers;

            if (reviewers.indexOf(req.user.id) === -1) {
                reviewers.push(req.user.id);
            }

            reqRes.state = db.Request.WIP_STATE;
            reqRes.reviewers = reviewers;
            db.Request.setChrono(reqRes, req.user.id);

            db.Request.updateOne({_id: reqRes._id}, reqRes, function (updateErr) {
                if (!updateErr) {
                    res.json({message: "Requested revision(s) successfully"});
                    return;
                }
                res.status(500);
                res.json({error: updateErr.message})

            });
        }else{
            res.status(403);
            res.json("You do not have the necessary permissions to approve an output request");
            logger.error("User " + req.user.id + " tried to request revisions but lacks the required permission");
            return;
        }
    });
});

router.put('/pickup/:requestId', function(req, res){
    var db = require('../db/db');
    var config = require('config');
    var logger = require('npmlog');
    var requestId = mongoose.Types.ObjectId(req.params.requestId);

    db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
        if (reqErr || !reqRes){
            res.status(500);
            res.json({error: reqErr.message});
            return;
        }

        reqRes = reqRes[0];

        if ( (reqRes.state !== db.Request.AWAITING_REVIEW_STATE) && (reqRes.state !== db.Request.IN_REVIEW_STATE) ){
            res.status(400);
            res.json({error: "Can't pick up a request that isn't awaiting review or already in review"});
            return;
        }


        if ( (req.user.groups.indexOf(config.get("outputCheckerGroup")) !== -1) ) {
            var reviewers = reqRes.reviewers;

            if (reviewers.indexOf(req.user.id) === -1) {
                reviewers.push(req.user.id);
            }

            reqRes.state = db.Request.IN_REVIEW_STATE;
            reqRes.reviewers = reviewers;
            db.Request.setChrono(reqRes, req.user.id);

            db.Request.updateOne({_id: reqRes._id}, reqRes, function (updateErr) {
                if (!updateErr) {
                    res.json({message: "Request picked up successfully"});
                    return;
                }
                res.status(500);
                res.json({error: updateErr.message})

            });
        }else{
            res.status(403);
            res.json({error: "You aren't allowed to pick up requests"});
            logger.error('User ' + req.user.id + " tried to pick up a request but doesn't have the required group");
            return;
        }
    });
});

router.delete('/:requestId', function(req, res){
    var db = require('../db/db');
    var config = require('config');
    var logger = require('npmlog');
    var requestId = mongoose.Types.ObjectId(req.params.requestId);

    db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
        if (reqErr || !reqRes || reqRes.length <= 0){
            res.status(500);
            res.json({error: reqErr.message});
            return;
        }

        reqRes = reqRes[0];

        if (reqRes.author = req.user.id){
            if (reqRes.state > db.Request.WIP_STATE){
                res.status(403);
                res.json({error: "You cannot delete a request that isn't in the draft/wip state"});
                return;
            }

            var map = reqRes.chronology.map(x => x.enteredState);

            console.log("MAP ", map);

            if (map.indexOf(db.Request.AWAITING_REVIEW_STATE) !== -1){
                res.status(403);
                res.json({error: "You cannot delete a request if it has ever been submitted"})
                return;
            }

            db.Request.deleteOne({_id: requestId}, function(err, result){
                if (err){
                    res.status(500);
                    res.json({error: err});
                    return;
                }
                res.json({message: "Record successfully deleted"});
            });

        }else{
            res.status(403);
            res.json({error: "You did not create this request and can therefore not delete it"});
        }


    });
});


function logRequestFinalState(req, user){
    var db = require('../db/db');

    var logger = require('npmlog');

    logger.info("Request has reached final state, " + db.Request.stateToText(req.state) + " final state reached by user " + user.id, req);

    return;

}

module.exports = router;