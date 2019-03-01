var db = require('../db/db');

var subscribers = {};

subscribers.subscribe = function(topicId, userId, contributed, callback){
    db.Topic.findById(topicId).exec((err, topic) => {
        if (err || topic == null) {
            callback({error:'topic not found'});
        } else {
            var subscribers = topic.subscribers == null ? []:topic.subscribers;

            var update = false;

            if (contributed && !topic.contributors.includes(userId)) {
                topic.contributors.push(userId);
                update = true;
            }

            if (!subscribers.includes (userId)) {
                subscribers.push (userId);
                topic.subscribers = subscribers;
                update = true;
            }
            if (update) {
                db.Topic.updateOne({_id: topicId}, topic, callback);
            } else {
                callback(null);
            }
        }
    });
};

subscribers.unsubscribe = function(topicId, userId, callback){
    db.Topic.findById(topicId).exec((err, topic) => {
        if (err || topic == null) {
            callback({error:'topic not found'});
        } else {
            var subscribers = topic.subscribers == null ? []:topic.subscribers;

            const index = subscribers.indexOf (userId);

            if (index >= 0) {
                subscribers.splice (index, 1);
                topic.subscribers = subscribers;
                db.Topic.updateOne({_id: topicId}, topic, callback);
            } else {
                callback(null);
            }
        }
    });
};


module.exports = subscribers;