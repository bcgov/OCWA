var express = require('express');
var router = express.Router();


// path /v1/

/* GET all permissions */
router.get('/', function(req, res, next) {
    var db = require('../db/db');

    var mongoose = require('mongoose');
    var q = new mongoose.Query();

    var operand = (typeof(req.query.operand) !== "undefined") ? req.query.operand : "and";

    if (typeof(req.query.topic_id) !== "undefined"){
        q[operand]([{topic_id: req.query.topic_id}]);
    }

    if (typeof(req.query.comment_id) !== "undefined"){
        q[operand]([{comment_id: req.query.topic_id}]);
    }

    if (typeof(req.query.user_id) !== "undefined"){
        q[operand]([{user_id: req.query.user_id}]);
    }

    if (typeof(req.query.group_ids) !== "undefined"){
        var groups = req.query.group_ids.split(",");
        q[operand]([{group_ids: { $in: groups }}]);
    }

    db.Permission.find(q, function(err, results){
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
            return;
        }
        res.json({message: "Successfully written"});
    });
});

module.exports = router;