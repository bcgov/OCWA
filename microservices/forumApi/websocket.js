var websocket = {};
var config = require('config');
var auth = require('./auth/auth');
var jwt = require('jsonwebtoken');

websocket.connections = {};
websocket.server = null;

websocket.init = function(){
    var self = this;
    const WebSocket = require('ws');

    this.server = new WebSocket.Server({
        port: config.get("wsPort"),
        perMessageDeflate: false,
        verifyClient: function(info, cb){
            var token = info.req.headers['sec-websocket-protocol'];
            if (!token){
                cb(false, 401, "Unauthorized")
            }else{
                jwt.verify(token, config.get("jwtSecret"), function(err, decoded){
                    if (err){
                        cb(false, 401, "Unauthorized");
                    }else{
                        var userConf = config.get('user');
                        decoded.id = decoded[userConf.idField];
                        info.req.user = decoded;
                        cb(true);
                    }
                })
            }
        }
    });

    function heartbeat() {
        this.isAlive = true;
    }

    this.server.on('connection', function connection(ws, req) {
        var logger = require('npmlog');
        logger.debug("Websocket connection opened for " + req.user.id);
        ws.isAlive = true;
        ws.on('pong', heartbeat);
        ws.user = req.user;
        self.connections[req.user.id] = ws;
    });


//terminate stale websockets
    const interval = setInterval(function ping() {
        self.server.clients.forEach(function each(ws) {
            if (ws.isAlive === false) return ws.terminate();

            ws.isAlive = false;
            ws.ping(function(){});
        });
    }, 30000);
};

websocket.getConnections = function(){
    return this.connections;
};

websocket.updateClient = function(message, id){
    this.connections[id].send(message);
};

module.exports = websocket;