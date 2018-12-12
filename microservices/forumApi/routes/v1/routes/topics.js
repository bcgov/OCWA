var express = require('express');
var router = express.Router();


// path /v1/


/* GET all topics */
router.get('/', function(req, res, next) {
    var db = require('../db/db');

    var limit = 100;
    if (typeof(req.query.limit) !== "undefined"){
        limit = req.query.limit;
        limit = parseInt(limit);
    }
    if (limit > 100){
        limit = 100;
    }

    var page = 1;
    if (typeof(req.query.page) !== "undefined"){
        page = req.query.page;
        page = parseInt(page);
    }
    if (page < 1){
        page = 1;
    }

    var q = {};

    if (typeof(req.query.parent_id) !== "undefined"){

        var pid = (req.query.parent_id == "-1") ? null : req.query.parent_id;
        q['parent_id'] = pid;
    }

    db.Topic.getAll(q, limit, page, req.user, function(err, results){
        var log = require('npmlog');
        if (err){
            log.error("Error finding ", err);
            res.status(500);
            res.json(err);
            return;
        }
        res.json(results);
    });


});

//create a new topic
router.post("/", function(req, res, next){
    var db = require('../db/db');
    var config = require('config');

    var topic = new db.Topic;

    var log = require('npmlog');

    topic.name = req.body.name;
    topic.contributors.push(req.user.id);

    var groups = req.user.groups.slice();

    var typeParentId = typeof(req.body.parent_id);
    topic.parent_id = ( (typeParentId === "string") || (typeParentId === "number") ) ? req.body.parent_id : null;

    if (config.has('requiredRoleToCreateTopic')){
        var reqRole = config.get('requiredRoleToCreateTopic');
        var reqIndex = req.user.groups.indexOf(reqRole);
        if (reqIndex===-1){
            log.error('User ' + req.user.id + " tried to create a topic but lacks required role: " + reqRole);
            res.status(401);
            res.json({error: "Lack required role to create a topic"}).status(401);
            return;
        }else{
            groups.splice(reqIndex, 1);
        }

    }

    var ignoreGroups = config.has('ignoreGroupsFromConsideration') ? config.get('ignoreGroupsFromConsideration') : [];
    for (var i=0; i<ignoreGroups.length; i++){
        var ignoreIndex = groups.indexOf(ignoreGroups[i]);
        if (ignoreIndex !== -1){
            groups.splice(ignoreIndex, 1);
        }
    }

    topic.author_groups = groups;

    log.debug("Creating topic: ", topic);


    if (topic.parent_id !== null){
        db.Topic.getAll({_id: topic.parent_id}, 1, 1, req.user, function(err, resList){
            log.debug("Topic find one", resList, err);
            if (err || resList==null || resList.length === 0){
                res.status(400);
                res.json({error: "No such parent topic"});
                return;
            }
            var result = resList[0];

            if ((typeof(result.parent_id) !== "undefined") && (result.parent_id !== null)){
                res.status(400);
                res.json({error: "Currently the api only supports nesting 1 topic level"});
                return;
            }

            topic.save(function(saveErr, saveRes){
                if (saveErr){
                    res.status(500);
                    res.json({error: saveErr.message});
                    return;
                }
                var messages = require('../messages/messages');
                messages.sendTopicMessage(topic);
                res.json({message: "Successfully written", _id: saveRes._id, result: saveRes});
            });
        });
    }else{
        topic.save(function(saveErr, saveRes){
            if (saveErr){
                res.status(500);
                res.json({error: saveErr});
                return
            }
            var messages = require('../messages/messages');
            messages.sendTopicMessage(topic);
            res.json({message: "Successfully written", _id: saveRes._id, result: saveRes});
        });
    }
});

module.exports = router;