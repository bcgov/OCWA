const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DRAFT_STATE = 0;
const WIP_STATE = 1;
const AWAITING_REVIEW_STATE = 2;
const IN_REVIEW_STATE = 3;
const APPROVED_STATE = 4;
const DENIED_STATE = 5;
const CANCELLED_STATE = 6;

const INPUT_TYPE = "import";
const EXPORT_TYPE = "export";

const DATA_EXPORT_TYPE = 'data';
const CODE_EXPORT_TYPE = 'code';

var chronologySchema = new Schema({
    timestamp: {type: Date, default: Date.now(), required: true},
    enteredState: {type: Number, required: true, default: DRAFT_STATE},
    change_by: {type: String, required: true},
    changes: {type: Map, of: Schema.Types.Mixed, required: false}
},{_id: false});

function codeTypeValidator() {
    return this.exportType === CODE_EXPORT_TYPE;
}

function dataTypeValidator() {
    return this.exportType === DATA_EXPORT_TYPE && this.type !== INPUT_TYPE;
}

var requestSchema = new Schema({
    state: {type: Number, required: true, default: DRAFT_STATE, index: true},
    tags: {type: [String], required: false},
    phoneNumber: {type: String, required: true},
    supportingFiles: {type: [String], required: false},
    purpose: {type: String, required: false},
    variableDescriptions: {
        type: String,
        required: dataTypeValidator
    },
    subPopulation: {
        type: String,
        required: dataTypeValidator
    },
    selectionCriteria: {type: String, required: false},
    steps: {type: String, required: false},
    freq: {type: String, required: false},
    confidentiality: {type: String, required: false},
    topic: {type: String, required: false},
    reviewers: {type: [String], required: false, default: []},
    chronology: {type: [chronologySchema], required: true, default: []},
    name: {type: String, required: true, index: true},
    files: {type: [String], required: true, index: true},
    author: {type: String, required: true},
    // Code Attributes
    branch: {
        type: String,
        required: codeTypeValidator
    },
    codeDescription: {
        type: String,
        required: codeTypeValidator
    },
    externalRepository: {
        type: String,
        required: codeTypeValidator
    },
    repository: {
        type: String,
        required: codeTypeValidator
    },
    mergeRequestLink: {
        type: String,
        required: false
    },
    mergeRequestStatus: {
        code: {type: Number, required: codeTypeValidator},
        message: { type: String, required: false }
    },
    exportType: {
        type: String,
        required: false,
        enum: [DATA_EXPORT_TYPE, CODE_EXPORT_TYPE],
        default: DATA_EXPORT_TYPE
    },
    type: {
        type: String,
        required: false,
        enum: [EXPORT_TYPE, INPUT_TYPE],
        default: EXPORT_TYPE
    }
});

var model = mongoose.model('request', requestSchema, 'requests');

model.setChrono = function(doc, userId, objectDelta){
    if (typeof(doc.chronology) === "undefined"){
        doc.chronology = [];
    }


    var chrono = {
        timestamp: new Date(),
        enteredState: doc.state,
        change_by: userId
    };

    if (typeof(objectDelta !== "undefined")){
        chrono['changes'] = objectDelta;
    }

    doc.chronology.push(chrono);
};

model.DRAFT_STATE = DRAFT_STATE;
model.WIP_STATE = WIP_STATE;
model.AWAITING_REVIEW_STATE = AWAITING_REVIEW_STATE;
model.IN_REVIEW_STATE = IN_REVIEW_STATE;
model.APPROVED_STATE = APPROVED_STATE;
model.DENIED_STATE = DENIED_STATE;
model.CANCELLED_STATE = CANCELLED_STATE;

model.DATA_EXPORT_TYPE = DATA_EXPORT_TYPE;
model.CODE_EXPORT_TYPE = CODE_EXPORT_TYPE;

model.INPUT_TYPE = INPUT_TYPE;
model.EXPORT_TYPE = EXPORT_TYPE;

model.validState = function(state){
    return state >= DRAFT_STATE && state <= CANCELLED_STATE;
};



model.stateToText = function(state){
    var lookup = this.stateCodeLookup();
    return typeof(lookup[state]) !== "undefined" ? lookup[state] : "INVALID STATE";
};

model.stateCodeLookup = function(){
    var rv = {};
    rv[this.DRAFT_STATE] = "Draft";
    rv[this.WIP_STATE] = "WIP";
    rv[this.AWAITING_REVIEW_STATE] = "Awaiting Review";
    rv[this.IN_REVIEW_STATE] = "In Review";
    rv[this.APPROVED_STATE] = "Approved";
    rv[this.DENIED_STATE] = "Denied";
    rv[this.CANCELLED_STATE] = "Cancelled";
    return rv;
};

var getAllTopics = function(user, filter, callback, page){
    var config = require('config');
    var httpReq = require('request');
    var logger = require('npmlog');

    if (typeof(page) === "undefined"){
        page = 1;
    }

    var limit = 100;
    var topics = [];
    var projects = new Map();
    var url = config.get('forumApi') + '/v1?limit='+limit+'&page='+page;

    if ('id' in filter) {
        url += "&id=" + filter['id']
    }

    httpReq.get({
        url: url,
        headers: {
            'Authorization': "Bearer " + user.jwt
        }
    }, function (apiErr, apiRes, body) {
        if (apiErr || !apiRes) {
            logger.error("Permission error", apiErr);
            callback(apiErr, [], []);
            return;

        }

        try {
            var topicResults = JSON.parse(body);
        }catch (ex){
            logger.error("Error getting topics, non json returned", body);
            callback("Unknown error", topics, projects);
            return;
        }

        if (typeof(topicResults) === "undefined"){
            logger.error("Error getting topics", topicResults);
            callback("API error", topics, projects);
            return;
        }

        try {
            var projectResults = new Map(topicResults.map(x => {
                var groups = x.author_groups;
                var oci = groups.indexOf(config.get('outputCheckerGroup'));
                var expi = groups.indexOf(config.get('requiredRoleToCreateRequest'));

                if (oci !== -1){
                    groups.splice(oci, 1);
                }

                if (expi !== -1){
                    groups.splice(expi, 1);
                }
                return [x._id, groups]
            }));

            topicResults = topicResults.map(x => x._id);
            
            topics = topics.concat(topicResults);
            projects = new Map([...projects, ...projectResults]);

            if (topicResults.length >= limit) {
                getAllTopics(user, filter, function (err, topicR, projectR) {

                    for (var i=0; i<topicR.length; i++){
                        topics.push(topicR[i]);
                    }

                    projects = new Map([...projects, ...projectR]);

                    logger.verbose("Got all topics for a page", page, topicR, topics);
                    if (err) {
                        callback(err, topics, projects);
                        return;
                    }
                    callback(null, topics, projects);

                }, (page + 1));
                return;
            }

            logger.verbose("get all topics Terminal callback", page, topics);
            callback(null, topics, projects);
        }catch(ex){
            logger.error("Error handling topic results", ex);
            callback(ex, [], []);
        }
    });
};

model.getAllTopics = getAllTopics;

model.getZoneRestrict = function(user){
    var zoneRestrict;
    if (user.outputchecker) {
        if (user.zone === user.INTERNAL_ZONE){
            zoneRestrict = {
                $match: {
                    $or: [
                        {type: INPUT_TYPE},
                        {type: EXPORT_TYPE}
                    ]
                }
            }
        } else {
            // Return no records - Outputchecker should not be using external zone
            zoneRestrict = {
                $match: {
                    $and: [
                        {type: INPUT_TYPE},
                        {type: EXPORT_TYPE}
                    ]
                }
            }
        }
    } else if (user.supervisor) {
        // Supervisor has access to the requests regardless of what zone they are in
        zoneRestrict = {
            $match: {
                $or: [
                    {type: INPUT_TYPE},
                    {type: EXPORT_TYPE}
                ]
            }
        }
    } else {
        if (user.zone === user.INTERNAL_ZONE){
            zoneRestrict = {
                $match: {
                    $or: [
                        {type: EXPORT_TYPE},
                        {$and: [
                                {type: INPUT_TYPE},
                                {state: APPROVED_STATE}
                            ]
                        }
                    ]
                }
            };
        } else {
            zoneRestrict = {
                $match: {
                    $or: [
                        {type: INPUT_TYPE},
                        {$and: [
                                {type: EXPORT_TYPE},
                                {state: APPROVED_STATE}
                            ]
                        }
                    ]
                }
            };
        }
    }
    return zoneRestrict;
};


model.getAll = function(query, limit, page, user, callback){
    var logger = require('npmlog');
    var getVersionedDb = require('../db');
    var db = new getVersionedDb.db();
    var skip = limit * (page - 1);
    logger.verbose("request get all, skip, limit", skip, limit);

    var zoneRestrict = model.getZoneRestrict(user);

    logger.verbose("getAll ", user.supervisor, user.outputchecker);   

    var queryRequests = function(err2, topicR, projectR){
        logger.verbose("get all topics model get all", topicR);
        if ('_id' in query) {
            query['_id'] = mongoose.Types.ObjectId(query['_id']);
        }

        var q = [
            {
                $match: {
                    topic: {$in: topicR},
                    phoneNumber: { $exists: true }
                }
            },
            {
                $project: {
                    type: {
                        $ifNull: ["$type", EXPORT_TYPE]
                    },
                    state: 1,
                    tags: 1,
                    phoneNumber: 1,
                    supportingFiles: 1,
                    purpose: 1,
                    variableDescriptions: 1,
                    subPopulation: 1,
                    selectionCriteria: 1,
                    steps: 1,
                    freq: 1,
                    confidentiality: 1,
                    topic: 1,
                    reviewers: 1,
                    chronology: 1,
                    exportType: 1,
                    branch: 1,
                    externalRepository: 1,
                    repository: 1,
                    mergeRequestLink: 1,
                    mergeRequestStatus: 1,
                    codeDescription: 1,
                    name: 1,
                    files: 1,
                    author: 1,
                    submittedDate: {
                        $arrayElemAt: [
                            { 
                                $map: { 
                                    input: {
                                        $filter: {
                                            input: "$chronology",
                                            as: "chrono",
                                            cond: { $eq: [ "$$chrono.enteredState", AWAITING_REVIEW_STATE] }
                                        }
                                    },
                                    as: "ele",
                                    in: "$$ele.timestamp"
                                }
                            }, 0
                        ]
                    }
                }
            },
            zoneRestrict,
            {
                $match: query
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ];
        
        db.Request.aggregate(q).exec(function(err, results){
            if (err){
                return callback(err, []);
            }
            logger.verbose("in topic bind");
            if (results){
                for (var i=0; i<results.length; i++){
                    if ( (typeof(results[i]) !== "undefined") && (typeof(results[i].topic) !== "undefined") ){
                        let topicId = results[i].topic;
                        results[i].projects = projectR.get(topicId);
                    }
                }
            }
            callback(err, results);
        });
    }

    if ('_id' in query) {
        db.Request.findById(query['_id'], (err3, req) => {
            if ( (req !== null) && (typeof(req) !== "undefined") && (typeof(req.topic) !== "undefined") ){
                getAllTopics(user, { id: req.topic }, queryRequests);
            }else{
                callback(null, []);
            }
        });
    } else {
        getAllTopics(user, {}, queryRequests);
    }
};

model.VERSION = 1;

module.exports = model;
