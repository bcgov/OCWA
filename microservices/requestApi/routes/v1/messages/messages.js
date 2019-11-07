var messages = {};
var logger = require('npmlog');

function checkRequestPermissions(user, fileId, sock, cb){

    var db = require('../db/db');

    logger.debug('messages / Checking permission for file_id:', fileId);

    db.Request.getAll({files: fileId}, 1, 1, user, function(findErr, findRes){
        if (findErr || !findRes || findRes.length === 0){
            logger.debug('messages / Request with file not found.', fileId, findErr);
            cb(false, sock);
            return;
        }
        cb(true, sock);
    });
}

function sendFileStatusMessage(fileStatus){
    var websockets = require('../../../websocket');
    var conns = websockets.getConnections();
    var keys = Object.keys(conns);
    for (var i=0; i<keys.length; i++){
        // make sure the user has access to the request
        var conn = conns[keys[i]];
        checkRequestPermissions(conn.user, fileStatus.fileId, conn, function(send, sock) {
            if (send) {
                if (websockets.isOpen(sock)) {
                    sock.send(JSON.stringify({fileStatus: fileStatus}));
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