var baseModel = require('../../../../db/model/request');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var config = require('config');
const formioClient = require('../../clients/formio_client');

const DEFAULT_FORM = config.get("formio.defaultFormName");
const DEFAULT_CODE_FORM = config.get("formio.defaultCodeFormName");

const schemaFields = ['name', 'state', 'supportingFiles', 'topic', 'reviewers', 'chronology', 'files', 'author', 'project', 'exportType', 'type', 'formName', 'submissionId'];

var requestSchema = new Schema({
    name: {type: String, required: true, index: true},
    state: {type: Number, required: true, default: baseModel.DRAFT_STATE, index: true},
    supportingFiles: {type: [String], required: false},
    topic: {type: String, required: false},
    reviewers: {type: [String], required: false, default: []},
    chronology: {type: [baseModel.chronologySchema], required: true, default: []},
    files: {type: [String], required: true},
    author: {type: String, required: true},
    project: {type: String, required: true},
    mergeRequestStatus: {
        code: {
            type: Number, 
            required: function(){
                return this.exportType && this.exportType === baseModel.CODE_EXPORT_TYPE;
            }
        },
        message: { type: String, required: false }
    },
    exportType: {
        type: String,
        required: false,
        enum: [baseModel.DATA_EXPORT_TYPE, baseModel.CODE_EXPORT_TYPE],
        default: baseModel.DATA_EXPORT_TYPE
    },
    type: {
        type: String,
        required: false,
        enum: [baseModel.EXPORT_TYPE, baseModel.INPUT_TYPE],
        default: baseModel.EXPORT_TYPE
    },
    formName: {
        type: String,
        required: true,
        default: DEFAULT_FORM
    },
    submissionId: {
        type: String,
        required: true,
    }
});

var model = mongoose.model('request.v2', requestSchema, 'requests');

model.setChrono = baseModel.setChrono;

model.DRAFT_STATE = baseModel.DRAFT_STATE;
model.WIP_STATE = baseModel.WIP_STATE;
model.AWAITING_REVIEW_STATE = baseModel.AWAITING_REVIEW_STATE;
model.IN_REVIEW_STATE = baseModel.IN_REVIEW_STATE;
model.APPROVED_STATE = baseModel.APPROVED_STATE;
model.DENIED_STATE = baseModel.DENIED_STATE;
model.CANCELLED_STATE = baseModel.CANCELLED_STATE;

model.INPUT_TYPE = baseModel.INPUT_TYPE;
model.EXPORT_TYPE = baseModel.EXPORT_TYPE;

model.schemaFields = schemaFields;

model.validState = baseModel.validState;



model.stateToText = baseModel.stateToText;

model.stateCodeLookup = baseModel.stateCodeLookup;

var getAllTopics = baseModel.getAllTopics;
model.getAllTopics = getAllTopics;

model.getZoneRestrict = baseModel.getZoneRestrict;


model.getAll = function(query, limit, page, user, callback){
    var logger = require('npmlog');
    var db = require('../db');
    var skip = limit * (page - 1);
    logger.verbose("v2 request get all, skip, limit", skip, limit);

    var zoneRestrict = model.getZoneRestrict(user);

    logger.verbose("v2 getAll ", user.supervisor, user.outputchecker);

   this.getAllTopics(user, function(err, topicR, projectR){
        logger.verbose("V2 get all topics model get all", topicR);

        db.Request.aggregate([
            {
                $match: {
                    topic: {$in: topicR}
                }
            },
            {
                $project: {
                    name: 1,
                    type: {
                        $ifNull: ["$type", this.EXPORT_TYPE]
                    },
                    state: 1,
                    supportingFiles: 1,
                    topic: 1,
                    reviewers: 1,
                    chronology: 1,
                    mergeRequestStatus: 1,
                    exportType: 1,
                    files: 1,
                    author: 1,
                    project: 1,
                    formName: {
                        $ifNull: ["$formName", { $cond: { if: { $eq: [ "$exportType", baseModel.CODE_EXPORT_TYPE ] }, then: DEFAULT_CODE_FORM, else: DEFAULT_FORM } } ]
                    },
                    submissionId: 1,
                    submittedDate: {
                        $arrayElemAt: [
                            { 
                                $map: { 
                                    input: {
                                        $filter: {
                                            input: "$chronology",
                                            as: "chrono",
                                            cond: { $eq: [ "$$chrono.enteredState", this.AWAITING_REVIEW_STATE] }
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
        ]).exec(function(err, results){
            logger.verbose('v2 finished db call', err, results);
            var processed = 0;
            if (results){
                if (results.length === 0){
                    logger.verbose('v2 returning no results', err, results);
                    callback(null, results);
                    return;
                }
                var v2Results = [];
                for (var i=0; i<results.length; i++){
                    let topicId = results[i].topic;
                    results[i].projects = projectR.get(topicId);
                    
                    let workingReq = results[i];
                    logger.verbose('v2 about to get formio submissions request model');
                    formioClient.getSubmission(results[i].formName, workingReq.submissionId, function(formErr, formRes){
                        logger.verbose('v2 got formio submissions request model', formErr, formRes);
                        if (formRes && workingReq.submissionId){
                            try{
                                var submis = JSON.parse(formRes);
                                var keys = Object.keys(submis.data);
                                logger.verbose("adding fields to ", workingReq);
                                for (var j=0; j<keys.length; j++){
                                    var key = keys[j];
                                    //protect schema fields
                                    if (schemaFields.indexOf(key) === -1){
                                        var val = submis.data[key];
                                        workingReq[key] = val;
                                    }
                                }
                            }catch(e){}
                        }
                        v2Results.push(workingReq);
                        processed += 1;
                        if (processed === results.length){
                            callback(null, v2Results);
                        }
                    });
                }
            }
            
        });

    });
};

module.exports = model;
