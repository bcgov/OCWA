const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
    name: {type: Schema.Types.String, required: true, unique: true, index: true},
    parent_id: {type: Schema.Types.ObjectId, ref: 'topic', default: null, index: true},
    contributors: {type: [Schema.Types.String], required: true},
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

    if (defaultPermIsGroup){
        defaultPermOverride = {
            author_groups: {$in: user.groups}
        };
    }

    db.Topic.aggregate([
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
                 "author_groups": 0
             }
        },
        {
            $match: query
        }

    ]).limit(limit).skip(skip).exec(callback);
};

module.exports = model;