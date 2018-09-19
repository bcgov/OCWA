var messages = {};
var logger = require('npmlog');

function checkTopicPermissions(user, topicId, sock, cb){

    var db = require('../db/db');
    var mongoose = require('mongoose');
    var q = new mongoose.Query();
    q.and([
        { $or: [{topic_id: topicId}, {topic_id: '*'}] },
        { $or: [{user_id: user.id}, {user_id: '*'}, {group_ids: {$in: user.Groups}}, {group_ids: "*"}]},
        { allow: true }
    ]);

    db.Permission.find(q).sort('priority').exec(function(err, results){
        if (err || !results || results.length === 0){
            cb(false, sock);
            return;
        }
        cb(true, sock);
    });
}

function checkCommentPermissions(user, topicId, commentId, sock, cb){
    checkTopicPermissions(user, topicId, sock, function(send, s){
        if (!send){
            return false;
        }

        var db = require('../db/db');
        var mongoose = require('mongoose');
        var q = new mongoose.Query();
        q.and([
            { $or: [{comment_id: commentId}, {comment_id: '*'}] },
            { $or: [{user_id: user.id}, {user_id: '*'}, {group_id: {$in: user.Groups}}, {group_id: "*"}]},
            { allow: false }
        ]);

        db.Permission.find(q).sort('priority').exec(function(err, results){
            if (err || ( (typeof(results) === "object") && (results.length > 0) )){
                console.log(user);
                cb(false, sock);
                return;
            }
            cb(true, sock);
        });

    })
}

//This file describes the function for how v1 sends messages over the websockets
function sendTopicMessage(topic){
    var websockets = require('../../../websocket');
    var conns = websockets.getConnections();
    var keys = Object.keys(conns);
    for (var i=0; i<keys.length; i++){
        checkTopicPermissions(conns[keys[i]].user, topic._id, function(send, sock) {
            if (send) {
                sock.send({topic: JSON.stringify(topic)});
            }
        });
    }
}

//wrapper to make async
messages.sendTopicMessage = function(topic){
    setTimeout(sendTopicMessage, 0, topic);
};

function sendCommentMessage(topicId, comment){
    var websockets = require('../../../websocket');
    var conns = websockets.getConnections();
    var keys = Object.keys(conns);
    for (var i=0; i<keys.length; i++){
        checkCommentPermissions(conns[keys[i]].user, topicId, comment._id, conns[keys[i]], function(send, sock) {
            if (send) {
                sock.send(JSON.stringify({comment: comment}));
            }
        });
    }
}

messages.sendCommentMessage = function(topic, comment){
    setTimeout(sendCommentMessage, 1, topic, comment);
};

module.exports = messages;