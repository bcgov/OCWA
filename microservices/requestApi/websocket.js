var websocket = {};
var config = require('config');
var auth = require('./auth/auth');
var jwt = require('jsonwebtoken');
const WebSocket = require('ws');
var logger = require('npmlog');

websocket.connections = {};
websocket.server = null;

websocket.init = function(){
    var self = this;

    this.server = new WebSocket.Server({
        port: config.get("wsPort"),
        perMessageDeflate: false,
        verifyClient: function(info, cb){
            logger.debug("Websocket / verifying");

            var token = info.req.headers['sec-websocket-protocol'];
            if (!token){
                cb(false, 401, "Unauthorized")
            }else{
                logger.debug("Websocket / Websocket verifying validate JWT");
                jwt.verify(token, config.get("jwtSecret"), function(err, decoded){
                    if (err){
                        logger.error(err);
                        cb(false, 401, "Unauthorized");
                    }else{
                        var userConf =  config.get('user')
                        var user = {
                            jwt: token,
                            email: decoded[userConf.emailField],
                            firstName: decoded[userConf.givenNameField],
                            lastName: decoded[userConf.surNameField],
                            name: decoded[userConf.givenNameField] + " " + decoded[userConf.surNameField],
                            groups: decoded[userConf.groupField],
                            id: decoded[userConf.idField],
                            zone: (decoded.zone) ? decoded.zone : "external",
                            EXTERNAL_ZONE: 'external',
                            INTERNAL_ZONE: 'internal'                            
                        };
                        info.req.user = user;
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

        logger.debug("Websocket / Connection opened for " + req.user.id);
        logger.debug("Websocket / Connection: " + req.url);

        // URL: /{requestId}

        ws.isAlive = true;
        ws.on('pong', heartbeat);
        ws.on('message', (message) => {
            var payload = JSON.parse(message);
            if ('access_token' in payload) {
                logger.debug("Websocket / Refreshed access token for " + ws.user.id);
                logger.debug("Websocket / Access token: " + payload['access_token']);
                ws.user.jwt = payload['access_token']
            }
        });
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

websocket.isOpen = function (client) {
    return (client.readyState === WebSocket.OPEN);
}

module.exports = websocket;