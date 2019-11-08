var logger = require('npmlog');
const WebSocket = require('ws');

var config = require('config');

let token = config.get('testWebsocketJWT')
let wsPort = config.get('wsPort')
const ws = new WebSocket('ws://localhost:' + wsPort, null, { headers: { "sec-websocket-protocol": token }});

ws.on('open', function open() {
  logger.debug("Test WS / Opened");
});

ws.on('close', function open() {
    logger.debug("Test WS / Closed");
});
  
ws.on('message', function incoming(data) {
    logger.debug("Test WS / Received Message");
    logger.debug("Test WS /", data);
});

setTimeout(() => ws.terminate(), 20000);