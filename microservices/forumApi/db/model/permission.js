const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
    priority: {type: Number, required: true},
    allow: {type: Boolean, required: true, default: false},
    topic_id: {type: String, ref: 'topic', required: false},
    comment_id: {type: String, ref: 'user', required: false},
    user_ids: {type: [String], required: false},
    group_ids: {type: [String], required: false}

});

permissionSchema.pre('validate', function(next){

    var emptyTopic = ( (typeof(this.topic_id) === "undefined") || (this.topic_id === null) );
    var emptyComment = ( (typeof(this.comment_id) === "undefined") || (this.comment_id === null) );

    if (emptyTopic && emptyComment) {
        //neither defined
        return next(new Error("Must defined one of topic id or comment id"));

    }else if (!emptyTopic && !emptyComment) {
        //both defined
        return next(new Error("Cannot define both comment id and topic id"));
    }

    var emptyUsers = ( (typeof(this.user_ids) === "undefined") || (this.user_ids === null) || (this.user_ids.length === 0));
    var emptyGroups = ( (typeof(this.group_ids) === "undefined") || (this.group_ids === null) || (this.group_ids.length === 0));

    if (emptyUsers && emptyGroups){
        //neither defined
        return next(new Error("Must defined one of user ids or group ids"));
    }else if (!emptyUsers && !emptyGroups){
        //both defined
        return next(new Error("Cannot define both user ids and group ids"));
    }

    //valid
    next();

});

const findHook = function(next){
    var logger = require('npmlog');

    var q = new mongoose.Query();
    var oldQ = this.getQuery();
    logger.verbose("permissions.findHook oldq", oldQ);
    var topic_id = oldQ.topic_id;
    var comment_id = oldQ.comment_id;

    var emptyTopic = ( (typeof(topic_id) === "undefined") || (topic_id === null) );
    var emptyComment = ( (typeof(comment_id) === "undefined") || (comment_id === null) );

    if (!emptyTopic){
        q.or([ {topic_id: topic_id}, {topic_id: '*'} ]);
    }else{
        q.or([ {topic_id: "*"}, {topic_id: null} ]);
    }

    if (!emptyComment){
        q.or([ {comment_id: comment_id}, {comment_id: '*'} ]);
    }else{
        q.or([ {comment_id: "*"}, {comment_id: null} ]);
    }

    this.setQuery(q.getQuery());
    //sort is asc by default;
    this.sort('priority');
    logger.verbose("permissions.findHook:", q.getQuery(), this.getQuery());
    next()
};


//permissionSchema.pre('find', findHook);
//permissionSchema.pre('findOne', findHook);

module.exports = mongoose.model('permission', permissionSchema);