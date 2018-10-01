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

    db.Topic.getAll({}, limit, page, req.user, function(err, results){
        var log = require('npmlog');
        if (err){
            log.error("Error finding ", err);
            res.json(err);
            return;
        }
        res.json(results);
    });


});

//create a new topic
router.post("/", function(req, res, next){
    var db = require('../db/db');

    var topic = new db.Topic;

    var log = require('npmlog');

    topic.name = req.body.name;
    topic.contributors.push(req.user.id);
    var typeParentId = typeof(req.body.parent_id);
    topic.parent_id = ( (typeParentId === "string") || (typeParentId === "number") ) ? req.body.parent_id : null;

    log.debug("Creating topic: ", topic);

    if (topic.parent_id !== null){
        db.Topic.findOne({id: topic.parent_id}, function(err, result){
            log.debug("Topic find one", res, err);
            if (err || result==null){
                res.json({error: "No such parent topic"});
                return;
            }
            topic.save(function(saveErr, saveRes){
                if (saveErr){
                    res.json({error: "No such parent topic"});
                }
                res.json({message: "Successfully written", _id: saveRes._id});
            });
        });
    }else{
        topic.save(function(saveErr, saveRes){
            if (saveErr){
                res.json({error: saveErr});
                return
            }
            var messages = require('../messages/messages');
            messages.sendTopicMessage(topic);
            res.json({message: "Successfully written", _id: saveRes._id});
        });
    }
});

module.exports = router;