var messages = {};
var logger = require('npmlog');

function checkRequestPermissions(db, user, fileId, sock, cb){

    var db = require('../db/db');

    logger.debug('messages / Checking permission for file_id:', fileId);

    db.Request.findOne({ files: fileId }, (err, doc) => {
        if (err) {
            logger.error('messages / Not able to find a request with file', fileId, err);
            cb(false, sock);
        } else {
            db.Request.getAll({_id: doc._id}, 1, 1, user, function(findErr, findRes){
                if (findErr || !findRes || findRes.length === 0){
                    logger.debug('messages / Request with file not found for user.', fileId, user, findErr);
                    cb(false, sock);
                    return;
                }
                cb(true, sock);
            });
        }
    })
}

function sendFileStatusMessage(db, fileStatus){
    var websockets = require('../websocket');
    var conns = websockets.getConnections();
    var keys = Object.keys(conns);
    logger.debug('messages / try to send to # connections ', keys.length);
    for (var i=0; i<keys.length; i++){
        // make sure the user has access to the request
        var conn = conns[keys[i]];
        checkRequestPermissions(db, conn.user, fileStatus.fileId, conn, function(send, sock) {
            logger.debug('messages / send - ', send, websockets.isOpen(sock));
            if (send) {
                if (websockets.isOpen(sock)) {
                    sock.send(JSON.stringify(fileStatus));
                }
            }
        });
    }
}

//wrapper to make async
messages.sendFileStatusMessage = function(fileStatus){
    setTimeout(sendFileStatusMessage, 0, fileStatus);
};

module.exports = messages;