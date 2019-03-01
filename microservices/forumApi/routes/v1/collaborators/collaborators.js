var db = require('../db/db');

var collaborators = {};

collaborators.subscribe = function(topicId, userId, callback){
    db.Topic.findById(topicId).exec((err, topic) => {
        if (err) { 
            callback(err); 
        } else if (topic.contributors.includes (userId)) {
            callback();
        } else {
            topic.contributors.push (userId);
            db.Topic.updateOne({_id: topicId}, topic, callback);
        }
    });
};

collaborators.unsubscribe = function(topicId, userId, callback){
    db.Topic.findById(topicId).exec((err, topic) => {
        if (err) {
            callback(err);
        } else {
            index = topic.contributors.indexOf (userId);

            if (index >= 0) {
                topic.contributors.splice (index, 1);
                db.Topic.updateOne({_id: topicId}, topic, callback);
            } else {
                callback();
            }
        }
    });
};


module.exports = collaborators;