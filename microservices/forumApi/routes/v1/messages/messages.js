var messages = {};
var logger = require('npmlog');

function checkTopicPermissions(user, topicId, sock, cb){

    var db = require('../db/db');

    db.Topic.getAll({}, 1, 1, user, function(err, results){
        if (err || !results || results.length < 1){
            cb(false, sock);
            return;
        }
        cb(true, sock);
    });
}

function checkCommentPermissions(user, topicId, commentId, sock, cb){

    var db = require('../db/db');

    db.Comment.getAll({}, 1, 1, user, function(err, results){
        if (err || !results || results.length < 1){
            cb(false, sock);
            return;
        }
        cb(true, sock);
    });

}

//This file describes the function for how v1 sends messages over the websockets
function sendTopicMessage(topic){
    var websockets = require('../../../websocket');
    var conns = websockets.getConnections();
    var keys = Object.keys(conns);
    for (var i=0; i<keys.length; i++){
        checkTopicPermissions(conns[keys[i]].user, topic._id, conns[keys[i]], function(send, sock) {
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