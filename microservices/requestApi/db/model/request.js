const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DRAFT_STATE = 0;
const WIP_STATE = 1;
const AWAITING_REVIEW_STATE = 2;
const IN_REVIEW_STATE = 3;
const APPROVED_STATE = 4;
const DENIED_STATE = 5;
const CANCELLED_STATE = 6;

const requestSchema = new Schema({
    name: {type: String, required: true},
    state: {type: Number, required: true, default: DRAFT_STATE},
    tags: {type: [String], required: false},
    files: {type: [String], required: true},
    supportingFiles: {type: [String], required: false},
    purpose: {type: String, required: false},
    variableDescriptions: {type: String, required: false},
    selectionCriteria: {type: String, required: false},
    steps: {type: String, required: false},
    freq: {type: String, required: false},
    confidentiality: {type: String, required: false},
    author: {type: String, required: true},
    topic: {type: String, required: false}
});

var model = mongoose.model('request', requestSchema);


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

model.getAll = function(query, limit, page, user, callback){
    var logger = require('npmlog');
    var db = require('../db');
    var skip = limit * (page - 1);
    logger.verbose("Comment get all, skip, limit", skip, limit);

    var httpReq = require('request');
    var config = require('config');
    var groups = user.groups;
    groups.push("*");
    var url = config.get('forumApi') + '/v1/permission?user_id='+user.id+"&group_ids="+groups+"&operand=or";
    httpReq.get({
        url: url,
        headers: {
            'X-API-KEY': config.get('validationApiSecret')
        }
    }, function (apiErr, apiRes, body) {
        if (apiErr || !apiRes) {
            logger.error("Permission error", apiErr);
            callback(apiErr);
            return;

        }
        var permissionArr = JSON.parse(body);
        var topicArr = permissionArr.map( value => value.topic_id);
        console.log("TA", topicArr, limit, skip);
        //db.Request.find(query).limit(limit).skip(skip).exec(callback);

        // db.Request.find(
        //             {topic: "5baabd008ab1119699b917ea"}
        // ).limit(limit).skip(skip).exec(callback);
        // return;

        db.Request.aggregate([
            {
                $addFields: {
                    permissions: permissionArr
                }
            },
            {
                $match: {
                    //$expr: {
                        $or: [
                            {"permissions.topic_id": "*"},
                            {topic: {$in: topicArr}}
                        ]
                    //}
                }
            },
            {
                //supress permissions now
                $project: {"permissions": 0}
            }
        ]).limit(limit).skip(skip).exec(callback);
    });
};

module.exports = model;