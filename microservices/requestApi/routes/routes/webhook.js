
var logger = require('npmlog');

var buildStatic = function(router, messages, db){

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

        messages.sendFileStatusMessage (db, status);
        res.json({status:'ok'});
    });
}

var buildDynamic = function(router, messages){}

module.exports = {
    buildStatic: buildStatic,
    buildDynamic: buildDynamic
};
