var buildStatic = function(db, router){

    router.get('/status_codes', function(req, res, next) {
        res.json(db.Request.stateCodeLookup());
    });

    router.get('/file_status_codes', function(req, res, next) {
        res.json({
            "0": "Pass",
            "1": "Fail",
            "2": "Pending"
        });
    });

    router.get('/request_types', function(req, res, next) {
        res.json({
            "import": db.Request.INPUT_TYPE,
            "export": db.Request.EXPORT_TYPE
        });
    });

    return router;
};

var buildDynamic = function(projectConfig, db, notify, util, router){
    var mongoose = require('mongoose');
    

    /* GET all requests. */
    router.get('/', function(req, res, next) {
        //var logger = require('npmlog');

        var limit = 100;
        if (typeof(req.query.limit) !== "undefined"){
            limit = Number(req.query.limit);
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
            q['state'] = Number(req.query.state);
        }

        if (typeof(req.query.name) !== "undefined"){
            q['name'] = req.query.name;
            if (req.query.name.substring(req.query.name.length-1) === "*"){
                req.query.name = req.query.name.substring(0, req.query.name.length-1);
                q['name'] = {"$regex": req.query.name, "$options": "i"};
            }
        }

        if (typeof(req.query.topic_id) !== "undefined"){
            q['topic'] = req.query.topic_id;
        }

        if (typeof(req.query.type) !== "undefined"){
            q['type'] = req.query.type;
        }

        if (typeof(req.query.start_date) !== "undefined"){
            let split = req.query.start_date.split(/[-\/]/);
            let year = split[0] ? split[0] : 0;
            let month = split[1] ? split[1]-1 : 0;
            let day = split[2] ? split[2] : 0;
            let hour = split[3] ? split[3] : 0;
            let minute = split[4] ? split[4] : 0;
            let second = split[5] ? split[5] : 0;
            q.submittedDate = {$gte:  new Date(year, month, day, hour, minute, second)};
        }

        if (typeof(req.query.end_date) !== "undefined"){
            let split = req.query.end_date.split(/[-\/]/);
            let year = split[0] ? split[0] : 0;
            let month = split[1] ? (split[1]-1) : 0;
            let day = split[2] ? split[2] : 0;
            let hour = split[3] ? split[3] : 0;
            let minute = split[4] ? split[4] : 0;
            let second = split[5] ? split[5] : 0;
            if (typeof(q.submittedDate) === "undefined"){
                q.submittedDate = {$lte:  new Date(year, month, day, hour, minute, second)};
            }else{
                q.submittedDate.$lte = new Date(year, month, day, hour, minute, second);
            }
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

        var request = new db.Request;
        if (typeof(req.body.name) !== "undefined") {
            request.name = req.body.name;
        }

        if (typeof(req.body.tags) !== "undefined") {
            request.tags = req.body.tags;
        }

        if (typeof(req.body.purpose) !== "undefined") {
            request.purpose = req.body.purpose;
        }

        if (typeof(req.body.phoneNumber) !== "undefined") {
            request.phoneNumber = req.body.phoneNumber;
        }

        if (typeof(req.body.variableDescriptions) !== "undefined") {
            request.variableDescriptions = req.body.variableDescriptions;
        }

        if (typeof(req.body.subPopulation) !== "undefined") {
            request.subPopulation = req.body.subPopulation;
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
        
        if (typeof(req.body.branch) !== "undefined") {
            request.branch = req.body.branch;
        }
        
        if (typeof(req.body.codeDescription) !== "undefined") {
            request.codeDescription = req.body.codeDescription;
        }
        
        if (typeof(req.body.externalRepository) !== "undefined") {
            request.externalRepository = req.body.externalRepository;
        }
        
        if (typeof(req.body.repository) !== "undefined") {
            request.repository = req.body.repository;
        }
        
        if (typeof(req.body.exportType) !== "undefined") {
            request.exportType = req.body.exportType;
        }
        
        if (typeof(req.body.confidentiality) !== "undefined") {
            request.confidentiality = req.body.confidentiality;
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
            }
        }

        db.Request.setChrono(request, req.user.id);

        log.verbose("Creating request", request, request.save);

        request.save(function(saveErr, result){
            log.verbose("Created request", saveErr, result);
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
                        db.Request.deleteOne({_id: result._id}, function(e2){
                            if (e2) {
                                log.error("Error deleting request", result, e2);
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

    /* GET specific request. */
    router.get('/:requestId', function(req, res, next) {

        var includeFileStatus = true;
        if (typeof(req.query.include_file_status) !== "undefined"){
            includeFileStatus = req.query.include_file_status == "true";
        }

        var requestId = null;
        try{
            requestId = mongoose.Types.ObjectId(req.params.requestId);
        }catch(ex){
            res.status(400);
            res.json({error: "Invalid Request ID" });
            return;
        }

        db.Request.getAll({_id: requestId}, 1, 1, req.user, function(findErr, findRes){
            if (findErr || !findRes || findRes.length === 0){
                res.status(500);
                res.json({error: findRes && findRes.length === 0 ? "Request Not Found" : findErr.message });
                return;
            }

            findRes = findRes[0];

            if (includeFileStatus) {

                var project = projectConfig.deriveProjectFromUser(req.user);
                projectConfig.get(project, 'autoAccept').then((autoAccept) => {

                    findRes.autoAccept = 
                        (findRes.type === db.Request.INPUT_TYPE && autoAccept.import) ||
                        (findRes.type === db.Request.EXPORT_TYPE && autoAccept.export);

                    util.getFileStatus(findRes.files, function(status) {
                        findRes.fileStatus = status;
                        res.json(findRes);
                    });
                });
            } else {
                res.json(findRes)
            }

        });


    });

    //save a request
    router.put("/save/:requestId", function(req, res, next){
        var requestId = null;
        try{
            requestId = mongoose.Types.ObjectId(req.params.requestId);
        }catch(ex){
            res.status(400);
            res.json({error: "Invalid Request ID" });
            return;
        }
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
            findRes.phoneNumber = (typeof(req.body.phoneNumber) !== "undefined") ? req.body.phoneNumber : findRes.phoneNumber;
            findRes.tags = (typeof(req.body.tags) !== "undefined") ? req.body.tags : findRes.tags;
            findRes.purpose = (typeof(req.body.purpose) !== "undefined") ? req.body.purpose : findRes.purpose;
            findRes.variableDescriptions = (typeof(req.body.variableDescriptions) !== "undefined") ? req.body.variableDescriptions : findRes.variableDescriptions;
            findRes.subPopulation = (typeof(req.body.subPopulation) !== "undefined") ? req.body.subPopulation : findRes.subPopulation;
            findRes.selectionCriteria = (typeof(req.body.selectionCriteria) !== "undefined") ? req.body.selectionCriteria : findRes.selectionCriteria;
            findRes.steps = (typeof(req.body.steps) !== "undefined") ? req.body.steps : findRes.steps;
            findRes.freq = (typeof(req.body.freq) !== "undefined") ? req.body.freq : findRes.freq;
            findRes.confidentiality = (typeof(req.body.confidentiality) !== "undefined") ? req.body.confidentiality : findRes.confidentiality;
            findRes.files = (typeof(req.body.files) !== "undefined") ? req.body.files : findRes.files;
            findRes.supportingFiles = (typeof(req.body.supportingFiles) !== "undefined") ? req.body.supportingFiles : findRes.supportingFiles;
            findRes.branch = (typeof(req.body.branch) !== "undefined") ? req.body.branch : findRes.branch;
            findRes.externalRepository = (typeof(req.body.externalRepository) !== "undefined") ? req.body.externalRepository : findRes.externalRepository;
            findRes.repository = (typeof(req.body.repository) !== "undefined") ? req.body.repository : findRes.repository;
            findRes.codeDescription = (typeof(req.body.codeDescription) !== "undefined") ? req.body.codeDescription : findRes.codeDescription;

            var setChrono = (findRes.state!==db.Request.WIP_STATE) || (Object.keys(objectDelta).length > 0 );
            findRes.state = db.Request.WIP_STATE;

            if (setChrono) {
                db.Request.setChrono(findRes, req.user.id, objectDelta);
            }

            db.Request.updateOne({_id: requestId}, findRes, function(saveErr){
                if (saveErr) {
                    res.json({error: saveErr.message});
                    return;
                }

                var httpReq = require('request');

                var policy = findRes.type + "-" + findRes.exportType;

                for (let i=0; i<findRes.files.length; i++) {
                    ((myFile) => {
                        httpReq.put({
                            url: config.get('validationApi') + '/v1/validate/' + myFile + '/' + policy,
                            headers: {
                                'x-api-key': config.get('validationApiSecret')
                            }
                        }, function (apiErr, apiRes, body) {
                            logger.debug("file", myFile, "put up for validation");
                            logger.verbose("put file", myFile, " up for validation", apiErr, apiRes, body);
                            if (apiErr) {
                                logger.debug("Error validating file: ", apiErr);
                            }
                        });
                    })(findRes.files[i])
                }

                notify.process(findRes, req.user);

                res.json({message: "Successfully updated", result: findRes});
            });
        });

    });


    //submit a request
    router.put('/submit/:requestId', function(req, res, next){
        var logger = require('npmlog');
        
        var requestId = null;
        try{
            requestId = mongoose.Types.ObjectId(req.params.requestId);
        }catch(ex){
            res.status(400);
            res.json({error: "Invalid Request ID" });
            return;
        }

        // Lookup project from user groups
        var project = projectConfig.deriveProjectFromUser(req.user);

        db.Request.getAll({_id: requestId}, 1, 1, req.user, function (reqErr, reqRes) {
            if (reqErr || !reqRes || reqRes.length == 0) {
                res.status(400);
                res.json({error: "No Results"});
                return;
            }

            projectConfig.get(project, 'autoAccept').then((autoAccept) => {

                reqRes = reqRes[0];

                if (reqRes.state !== db.Request.WIP_STATE){
                    res.status(400);
                    res.json({error: "Can't submit a request that isn't in wip state"});
                    return;
                }

                if (req.user.id !== reqRes.author){
                    res.status(403);
                    logger.error("User " + req.user.id + " tried to submit a request they don't own");
                    res.json({error: "Can't submit a request that isn't yours"});
                    return;
                }

                if (reqRes.exportType !== 'code' && reqRes.files.length == 0){
                    res.status(403);
                    res.json({error: "Can't submit a request without files. Nothing to export."});
                    return;
                }

                if (reqRes.exportType === 'code' && reqRes.mergeRequestStatus.code != 200) {
                    res.status(400);
                    res.json({error: reqRes.mergeRequestStatus.message});
                    return;
                }


                if (reqRes.reviewers.length > 0) {
                    reqRes.state = db.Request.IN_REVIEW_STATE;
                } else if ( (reqRes.type === db.Request.INPUT_TYPE && autoAccept.import) || (reqRes.type === db.Request.EXPORT_TYPE && autoAccept.export) ){
                    reqRes.state = db.Request.AWAITING_REVIEW_STATE;
                    db.Request.setChrono(reqRes, req.user.id);
                    reqRes.state = db.Request.APPROVED_STATE;
                } else {
                    reqRes.state = db.Request.AWAITING_REVIEW_STATE;
                }

                db.Request.setChrono(reqRes, req.user.id);
                logger.debug("SET CHRONO2", reqRes.chronology);

                var config = require('config');
                var storageApi = config.get('storageApi');
                var warnSize =  reqRes.type === db.Request.EXPORT_TYPE ? storageApi.warnRequestBundlesize : storageApi.warnImportRequestBundlesize;
                var maxSize = reqRes.type === db.Request.EXPORT_TYPE ? storageApi.maxRequestBundlesize : storageApi.maxImportRequestBundlesize;


                var getFileStatusAndUpdate = function(reqRes){
                    util.getFileStatus(reqRes.files, function(status) {
                        if (Object.keys(status).length !== reqRes.files.length){
                            res.status(403);
                            res.json({error: "Not all files were submitted for validation, did you let save finish?"});
                            return;
                        }

                        let pass = true;
                        let blocked = false;
                        
                        for (let i=0; i < reqRes.files.length; i++) {
                            for (var j=0; j < status[reqRes.files[i]].length; j++) {

                                if ((status[reqRes.files[i]][j].state === 1) && (status[reqRes.files[i]][j].mandatory === true)) {
                                    blocked = true;
                                }

                                if ((status[reqRes.files[i]][j].pass === false) && (status[reqRes.files[i]][j].mandatory === true)) {
                                    pass = false;
                                }
                            }
                        }

                        if (pass) {
                            db.Request.updateOne({_id: reqRes._id}, reqRes, function (updateErr) {
                                if (!updateErr) {
                                    //works around a bug where the date isn't coming back from findOneAndUpdate so just hard casting it properly
                                    reqRes.chronology[reqRes.chronology.length-1].timestamp = new Date(reqRes.chronology[reqRes.chronology.length-1].timestamp);
                                    reqRes.fileStatus = status;
                                    notify.notify(reqRes, req.user, (reqRes.state===db.Request.AWAITING_REVIEW_STATE));
                                    
                                    if ((reqRes.type === db.Request.INPUT_TYPE && autoAccept.import)
                                        || (reqRes.type === db.Request.EXPORT_TYPE && autoAccept.export)) {
                                        notify.gitops().approve(reqRes).then((arg) => {
                                            logRequestFinalState(reqRes, req.user);
                                            res.json({message: "Request approved", result: reqRes});
                                        }).catch(err => {
                                            reqRes.state = db.Request.WIP_STATE;
                                            reqRes.chronology.splice(-1,1);
                                            db.Request.updateOne({_id: reqRes._id}, reqRes, function (uerr) {
                                                if (uerr) {
                                                    logger.error("Unable to revert changes after failed code merge.", uerr);
                                                }
                                            });
                                            res.status(400);
                                            res.json({error: "Error - " + err});
                                            return;
                                        });
                                    } else {
                                        res.json({message: "Request submitted", result: reqRes});
                                    }
                                    return;
                                    
                                }else{
                                    res.status(403);
                                    res.json({error: updateErr.message});
                                    return;
                                }
                            });

                            return;
                        }
                        res.status(403);
                        if (blocked){
                            res.json({error: "Request submission failed, one or more files is blocked", fileStatus: status});
                            return;
                        }
                        res.json({error: "Request submission failed, validation pending, please wait", fileStatus: status});
                        return;
                    });
                }

                if ( (warnSize > 0) || (maxSize > 0)){
                    util.getBundleMeta(reqRes.files, function(metadataRes){

                        var bundleSize = 0;
                        for (let i=0; i<metadataRes.length; i++){
                            bundleSize += metadataRes[i].size;
                            //also available: etag, metaData, lastModified: note this is the stuff from minio/s3 not tus.
                        }

                        if ( (warnSize > 0) && (bundleSize >= warnSize) && (bundleSize < maxSize)){
                            logger.warn("Bundle exceeds warn size but not max size");
                        }

                        if ( (maxSize > 0) && (bundleSize >= maxSize)){
                            logger.error("Bundle exceeds max size");
                            res.status(403);
                            res.json({error: "Request submission failed, total request filesize exceeds maximum", info: maxSize});
                            return;
                        }

                        getFileStatusAndUpdate(reqRes);
                    });
                }else{
                    getFileStatusAndUpdate(reqRes);
                }
            });
        });
    });

    router.put('/cancel/:requestId', function(req, res){
        
        var requestId = null;
        try{
            requestId = mongoose.Types.ObjectId(req.params.requestId);
        }catch(ex){
            res.status(400);
            res.json({error: "Invalid Request ID" });
            return;
        }
        var logger = require('npmlog');

        db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
            if (reqErr || !reqRes || reqRes.length === 0){
                res.status(500);
                res.json({error: "No such request"});
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
                        notify.notify(reqRes, req.user);

                        logRequestFinalState(reqRes, req.user);
                        res.json({message: "Request cancelled successfully", result: reqRes});
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
        
        var requestId = null;
        try{
            requestId = mongoose.Types.ObjectId(req.params.requestId);
        }catch(ex){
            res.status(400);
            res.json({error: "Invalid Request ID" });
            return;
        }
        var logger = require('npmlog');


        db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
            if (reqErr || !reqRes || reqRes.length === 0){
                res.status(500);
                res.json({error: "No such request"});
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
                        notify.notify(reqRes, req.user);
                        res.json({message: "Request withdrawn successfully", result: reqRes});
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
        var config = require('config');
        
        var requestId = null;
        try{
            requestId = mongoose.Types.ObjectId(req.params.requestId);
        }catch(ex){
            res.status(400);
            res.json({error: "Invalid Request ID" });
            return;
        }
        var logger = require('npmlog');

        db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
            if (reqErr || !reqRes || reqRes.length === 0){
                res.status(500);
                res.json({error: "No such request"});
                return;
            }

            reqRes = reqRes[0];

            if (reqRes.state !== db.Request.IN_REVIEW_STATE){
                res.status(400);
                res.json({error: "Only a request in review can be approved"});
                return;
            }

            if (req.user.groups.indexOf(config.get("outputCheckerGroup")) !== -1) {
                var reviewers = reqRes.reviewers;

                if (reviewers.indexOf(req.user.id) === -1) {
                    reviewers.push(req.user.id);
                }

                reqRes.state = db.Request.APPROVED_STATE;
                db.Request.setChrono(reqRes, req.user.id);
                reqRes.reviewers = reviewers;

                db.Request.updateOne({_id: reqRes._id}, reqRes, function (updateErr) {
                    if (!updateErr) {
                        notify.gitops().approve(reqRes).then((arg) => {
                            //works around a bug where the date isn't coming back from findOneAndUpdate so just hard casting it properly
                            reqRes.chronology[reqRes.chronology.length-1].timestamp = new Date(reqRes.chronology[reqRes.chronology.length-1].timestamp);
                            notify.notify(reqRes, req.user);
                            logRequestFinalState(reqRes, req.user);
                            res.json({message: "Request approved successfully", result: reqRes});
                        }).catch(err => {
                            reqRes.state = db.Request.IN_REVIEW_STATE;
                            reqRes.chronology.splice(-1,1);
                            db.Request.updateOne({_id: reqRes._id}, reqRes, function (uerr) {
                                if (uerr) {
                                    logger.error("Unable to revert changes after failed code merge.", uerr);
                                }
                            });
                            res.status(400)
                            res.json({error: "Error - " + err});
                        });
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
        var config = require('config');
        
        var requestId = null;
        try{
            requestId = mongoose.Types.ObjectId(req.params.requestId);
        }catch(ex){
            res.status(400);
            res.json({error: "Invalid Request ID" });
            return;
        }
        var logger = require('npmlog');

        if (config.has('allowDenyRequest') && !config.get('allowDenyRequest')){
            res.status(400);
            res.json({error: "Denying requests is not allowed"});
            return;
        }

        db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
            if (reqErr || !reqRes || reqRes.length === 0){
                res.status(500);
                res.json({error: "No such request"});
                return;
            }

            reqRes = reqRes[0];

            if (reqRes.state !== db.Request.IN_REVIEW_STATE){
                res.status(400);
                res.json({error: "Only a request in review can be denied"});
                return;
            }

            if (req.user.groups.indexOf(config.get("outputCheckerGroup")) !== -1) {
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
                        notify.notify(reqRes, req.user);
                        logRequestFinalState(reqRes, req.user);
                        res.json({message: "Request denied successfully", result: reqRes});
                        return;
                    }
                    res.status(500);
                    res.json({error: updateErr.message})

                });
            }else{
                res.status(403);
                res.json("You do not have the necessary permissions to deny an output request");
                logger.error("User " + req.user.id + " tried to deny an output request but lacks the required permission");
                return;
            }
        });
    });

    router.put('/requestRevisions/:requestId', function(req, res){
        var config = require('config');
        
        var requestId = null;
        try{
            requestId = mongoose.Types.ObjectId(req.params.requestId);
        }catch(ex){
            res.status(400);
            res.json({error: "Invalid Request ID" });
            return;
        }
        var logger = require('npmlog');

        db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
            if (reqErr || !reqRes || reqRes.length === 0){
                res.status(500);
                res.json({error: "No such request"});
                return;
            }

            reqRes = reqRes[0];

            if (reqRes.state !== db.Request.IN_REVIEW_STATE){
                res.status(400);
                res.json({error: "Only a request in review can have revisions requested"});
                return;
            }

            if (req.user.groups.indexOf(config.get("outputCheckerGroup")) !== -1) {
                var reviewers = reqRes.reviewers;

                if (reviewers.indexOf(req.user.id) === -1) {
                    reviewers.push(req.user.id);
                }

                reqRes.state = db.Request.WIP_STATE;
                reqRes.reviewers = reviewers;
                db.Request.setChrono(reqRes, req.user.id);

                db.Request.updateOne({_id: reqRes._id}, reqRes, function (updateErr) {
                    if (!updateErr) {
                        notify.notify(reqRes, req.user);
                        res.json({message: "Requested revision(s) successfully", result: reqRes});
                        return;
                    }
                    res.status(500);
                    res.json({error: updateErr.message});

                });
            }else{
                res.status(403);
                res.json("You do not have the necessary permissions to request revisions on an output request");
                logger.error("User " + req.user.id + " tried to request revisions but lacks the required permission");
                return;
            }
        });
    });

    router.put('/pickup/:requestId', function(req, res){
        var config = require('config');
        var logger = require('npmlog');
        
        var requestId = null;
        try{
            requestId = mongoose.Types.ObjectId(req.params.requestId);
        }catch(ex){
            res.status(400);
            res.json({error: "Invalid Request ID" });
            return;
        }

        db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
            logger.verbose("pickup request", reqErr, reqRes);
            if (reqErr || !reqRes || reqRes.length === 0){
                res.status(500);
                res.json({error: "No such request"});
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
                logger.verbose("pickup request reviewers", reviewers);
                db.Request.setChrono(reqRes, req.user.id);

                db.Request.updateOne({_id: reqRes._id}, reqRes, function (updateErr) {
                    if (!updateErr) {
                        logger.verbose("pickup request successful", reqRes);
                        res.json({message: "Request picked up successfully", result: reqRes});
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
        var config = require('config');
        var logger = require('npmlog');
        
        var requestId = null;
        try{
            requestId = mongoose.Types.ObjectId(req.params.requestId);
        }catch(ex){
            res.status(400);
            res.json({error: "Invalid Request ID" });
            return;
        }

        db.Request.getAll({_id: requestId}, 1, 1, req.user, function(reqErr, reqRes) {
            if (reqErr || !reqRes || reqRes.length <= 0){
                res.status(500);
                res.json({error: "No such request"});
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

            }else{
                res.status(403);
                res.json({error: "You did not create this request and can therefore not delete it"});
            }


        });
    });


    function logRequestFinalState(req, user){

        var logger = require('npmlog');

        logger.info("Request has reached final state, " + db.Request.stateToText(req.state) + " final state reached by user " + user.id, req);

        return;

    }

    return router;
};



module.exports = {
    buildStatic: buildStatic,
    buildDynamic: buildDynamic
};
