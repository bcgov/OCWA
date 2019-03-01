var db = require('../db/db');

var subscribers = {};

subscribers.subscribe = function(topicId, userId, callback){
    db.Topic.findById(topicId).exec((err, topic) => {
        if (err || topic == null) {
            callback({error:'topic not found'});
        } else {
            var subscribers = topic.subscribers == null ? []:topic.subscribers;

            if (subscribers.includes (userId)) {
                callback(null);
            } else {
                subscribers.push (userId);
                topic.subscribers = subscribers;
                db.Topic.updateOne({_id: topicId}, topic, callback);
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