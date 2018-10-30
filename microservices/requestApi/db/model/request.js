const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DRAFT_STATE = 0;
const WIP_STATE = 1;
const AWAITING_REVIEW_STATE = 2;
const IN_REVIEW_STATE = 3;
const APPROVED_STATE = 4;
const DENIED_STATE = 5;
const CANCELLED_STATE = 6;

var chronologySchema = new Schema({
    timestamp: {type: Date, default: Date.now(), required: true},
    enteredState: {type: Number, required: true, default: DRAFT_STATE},
    change_by: {type: String, required: true}
},{_id: false});


var requestSchema = new Schema({
    state: {type: Number, required: true, default: DRAFT_STATE, index: true},
    tags: {type: [String], required: false},

    supportingFiles: {type: [String], required: false},
    purpose: {type: String, required: false},
    variableDescriptions: {type: String, required: false},
    selectionCriteria: {type: String, required: false},
    steps: {type: String, required: false},
    freq: {type: String, required: false},
    confidentiality: {type: String, required: false},
    topic: {type: String, required: false},
    reviewers: {type: [String], required: false, default: []},
    chronology: {type: [chronologySchema], required: true, default: []},
    name: {type: String, required: true, index: true},
    files: {type: [String], required: true},
    author: {type: String, required: true}
});

var model = mongoose.model('request', requestSchema);


model.setChrono = function(doc, userId){
    if (typeof(doc.chronology) === "undefined"){
        doc.chronology = [];
    }

    if ( (typeof(doc._canSetChrono) === "undefined") || (doc._canSetChrono) ) {
        doc._canSetChrono = false;
        var chrono = {
            timestamp: Date.now(),
            enteredState: doc.state,
            change_by: userId
        };
        doc.chronology.push(chrono);
    }
};

model.DRAFT_STATE = DRAFT_STATE;
model.WIP_STATE = WIP_STATE;
model.AWAITING_REVIEW_STATE = AWAITING_REVIEW_STATE;
model.IN_REVIEW_STATE = IN_REVIEW_STATE;
model.APPROVED_STATE = APPROVED_STATE;
model.DENIED_STATE = DENIED_STATE;
model.CANCELLED_STATE = CANCELLED_STATE;

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

var getAllTopics = function(user, callback, page){
    var config = require('config');
    var httpReq = require('request');
    var logger = require('npmlog');

    if (typeof(page) === "undefined"){
        page = 1;
    }

    var limit = 100;
    var topics = [];
    var url = config.get('forumApi') + '/v1?limit='+limit+'&page='+page+'&parent_id=-1';

    httpReq.get({
        url: url,
        headers: {
            'Authorization': "Bearer " + user.jwt
        }
    }, function (apiErr, apiRes, body) {
        if (apiErr || !apiRes) {
            logger.error("Permission error", apiErr);
            callback(apiErr, []);
            return;

        }

        try {
            var topicResults = JSON.parse(body);
        }catch (ex){
            logger.error("Error getting topics, non json returned", body);
            callback("Unknown error", topics);
            return;
        }


        topicResults = topicResults.map(x => x._id);
        topics = topics.concat(topicResults);


        if (topicResults.length >= limit) {
            getAllTopics(user, function (err, topicR) {
                if (typeof(topicR) === "object") {
                    topics.concat(topicR);
                }
                if (err) {
                    callback(err, topics);
                    return;
                }
                callback(null, topics);

            }, (page + 1));
            return;
        }

        callback(null, topics);
    });
};


model.getAll = function(query, limit, page, user, callback){
    var logger = require('npmlog');
    var db = require('../db');
    var skip = limit * (page - 1);
    logger.verbose("request get all, skip, limit", skip, limit);

    getAllTopics(user, function(err, topicR){

        db.Request.aggregate([
            {
                $match: {
                    topic: {$in: topicR}
                }
            },
            {
                $match: query
            }
        ]).limit(limit).skip(skip).exec(callback);
    });
};

module.exports = model;