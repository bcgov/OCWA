const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
    name: {type: Schema.Types.String, required: true, unique: true},
    parent_id: {type: Schema.Types.ObjectId, ref: 'topic', default: null},
    contributors: {type: [Schema.Types.String], required: true}
});


var model = mongoose.model('topic', topicSchema);

model.getAll = function(query, limit, page, user, callback){
    var logger = require('npmlog');
    var db = require('../db');
    var skip = limit * (page - 1);
    logger.verbose("Topic get all, skip, limit", skip, limit);
    db.Topic.aggregate([
        {
            $lookup:{
                    from: "permissions",
                    let: { topicId: "$_id" },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    {$or: [
                                        {$eq: ["$topic_id", "$$topicId"] },
                                        {$eq: ["$topic_id", "*"] }
                                    ]},
                                    {$or: [
                                        {user_ids: user.id},
                                        {user_ids: "*"},
                                        {$in: ["$group_id", user.groups]},
                                        {group_ids: "*"}
                                    ]},
                                    {$eq: ["$allow", true]}
                                ]
                            }
                        }},
                        {$sort: {priority: 1}}
                    ],
                    as: "permissions"
            }
        },
        {
            $match:{
                "permissions.0": {$exists: true}
            },
        },
        {
            $project: {"permissions": 0}
        }
    ]).limit(limit).skip(skip).exec(callback);
};

module.exports = model;
