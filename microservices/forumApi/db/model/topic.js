const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
    name: {type: Schema.Types.String, required: true, index: true},
    parent_id: {type: Schema.Types.ObjectId, ref: 'topic', default: null, index: true},
    contributors: {type: [Schema.Types.String], required: true},
    subscribers: {type: [Schema.Types.String], required: true},
    author_groups: {type: [Schema.Types.String], required: true}
});


var model = mongoose.model('topic', topicSchema);

model.getAll = function(query, limit, page, user, callback){
    var config = require('config');
    var logger = require('npmlog');
    var db = require('../db');
    var skip = limit * (page - 1);
    logger.verbose("Topic get all, skip, limit", skip, limit);

    var defaultPermIsGroup = config.has('defaultAccessIsGroup') ? config.get('defaultAccessIsGroup') : 'false';

    var defaultPermOverride = {
        "contributors.0": user.id
    };

    var checkGroups = user.groups.slice();
    if ((defaultPermIsGroup) && (config.has('requiredRoleToCreateTopic'))){
        var removeGroup = config.get('requiredRoleToCreateTopic');

        var index = checkGroups.indexOf(removeGroup);
        if (index !== -1){
            checkGroups.splice(index,1);
        }

        var index = checkGroups.indexOf('/oc');
        if (index !== -1){
            checkGroups.splice(index,1);
        }
    }
    if (defaultPermIsGroup) {
        defaultPermOverride = {
            author_groups: {$in: checkGroups}
        };
    }

    if ('_id' in query) {
        query['_id'] = new ObjectId(query['_id']);
    }

    var agg = [
        {
            $match: query
        },
        {
            $lookup:{
                from: "permissions",
                let: { topicId: "$_id", parent: "$parent_id"},
                pipeline: [
                    {$match: {
                            $expr: {
                                $and: [
                                    {$or: [
                                            {$eq: ["$topic_id", "$$topicId"] },
                                            {$eq: ["$topic_id", "$$parent"] },
                                            {$eq: ["$topic_id", "*"] }
                                        ]},
                                    {$eq: ["$allow", true]}
                                ]
                            }
                        }},
                    {
                        $match: {
                            $or: [
                                {user_ids: user.id},
                                {user_ids: "*"},
                                {group_ids: "*"},
                                {group_ids: {$in: user.groups}}
                            ]
                        }
                    },
                    {$sort: {priority: 1}}
                ],
                as: "permissions"
            }
        },
        {
            $match:{
                $or: [
                    {"permissions.0": {$exists: true}},
                    defaultPermOverride
                ]
            }
        },
        {
            $project: {
                "permissions": 0,
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }

    ];

    //note skip MUST be before limit or this will not work
    //note because this is an aggregate query the skip and limit must be in the aggregate not the inline functions

    //var util = require('util');

    //console.log("get topic ", util.inspect(agg, {showHidden: false, depth: null}));

    //console.log("l", limit, "s", skip);
    db.Topic.aggregate(agg).exec(callback);
};

module.exports = model;