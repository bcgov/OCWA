var express = require('express');
var router = express.Router();


// path /v1/

/* GET all permissions */
router.get('/', function(req, res, next) {
    var db = require('../db/db');

    db.Permission.find({}, function(err, results){
        var log = require('npmlog');
        if (err){
            log.error("Error finding ", err);
            res.json(err);
            return;
        }
        res.json(results);
    });


});

//Create new permission? NOTE THIS DOES NOT VALIDATE given topic or comment ids.
//NOTE that the allow flag does matter, but it is implied to be allow true for topics and allow false for comments
router.post("/", function(req, res, next){
    var db = require('../db/db');

    var permission = new db.Permission;

    var log = require('npmlog');

    permission.priority = req.body.priority;
    if (typeof(req.body.allow) !== "undefined") {
        permission.allow = req.body.allow;
    }

    permission.topic_id = (typeof(req.body.topic_id) !== "undefined") ? req.body.topic_id : null ;
    permission.comment_id = (typeof(req.body.comment_id) !== "undefined") ? req.body.comment_id : null ;
    permission.user_ids = (typeof(req.body.user_ids) !== "undefined") ? req.body.user_ids : null ;
    permission.group_ids = (typeof(req.body.group_ids) !== "undefined") ? req.body.group_ids : null ;

    log.debug("Creating permission: ", permission);

    permission.save(function(saveErr, saveRes){
        if (saveErr){
            res.json({error: saveErr.message});
        }
        res.json({message: "Successfully written"});
    });
});

module.exports = router;