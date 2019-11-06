
const WebSocket = require('ws');

var config = require('config');

let token = config.get('testWebsocketJWT')
let wsPort = config.get('wsPort')
let requestId = "5dc30362c8a0710019533ab8"
const ws = new WebSocket('ws://localhost:' + wsPort + '/' + requestId, null, { headers: { "sec-websocket-token": token }});

ws.on('open', function open() {
  console.log("Opened");
});

ws.on('close', function open() {
    console.log("Closed");
  });
  
ws.on('message', function incoming(data) {
    console.log("Received Message");
    console.log(data);
});

setTimeout(() => ws.terminate(), 20000);