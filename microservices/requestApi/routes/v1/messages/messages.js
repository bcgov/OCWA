var messages = {};
var logger = require('npmlog');

function checkRequestPermissions(user, requestId, fileId, sock, cb){

    var db = require('../db/db');

    logger.debug('Checking request permission', requestId, fileId);

    db.Request.getAll({_id: requestId}, 1, 1, user, function(findErr, findRes){
        if (findErr || !findRes || findRes.length === 0){
            logger.debug('Request not found.', requestId, findErr);
            cb(false, sock);
            return;
        }
        // Verify that the fileId is in the request files list
        if (!(fileId in findRes.files)) {
            logger.debug('File not found in request.', requestId);
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
        checkRequestPermissions(conn.user, conn.requestId, fileStatus.fileId, conn, function(send, sock) {
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