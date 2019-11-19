var express = require('express');
var logger = require('npmlog');
var router = express.Router();

var messages = require('../messages/messages')

router.get('/', function(req, res) {
    res.json({status:'ok'});
});

router.post('/fileStatus', function(req, res) {
    logger.debug("webhook", "received fileStatus event");

    var json = req.body
    var status = {
        fileId: json.file_id,
        pass: (json.state === 0),
        state: json.state,
        message: json.message,
        name: json.rule_id,
        mandatory: json.mandatory
    }

    messages.sendFileStatusMessage (status);
    res.json({status:'ok'});
});

module.exports = router;
