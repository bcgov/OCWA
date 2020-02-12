var express = require('express');
var router = express.Router();


// path /v1/

/* GET all comments for request no. */
router.get('/:topicId', function(req, res, next) {
    var logger = require('npmlog');
    var db = require('../db/db');
    var topicId = req.params.topicId;

    var limit = 100;
    if (typeof(req.query.limit) !== "undefined"){
        limit = req.query.limit;
    }
    if (limit > 100){
        limit = 100;
    }

    var page = 1;
    if (typeof(req.query.page) !== "undefined"){
        page = req.query.page;
    }
    if (page < 1){
        page = 1;
    }

    var topic = new db.Topic;
    topic._id = topicId;

    db.Topic.getAll({_id: topic._id}, 1, 1, req.user, function(err, topicRes){

        if ((!topicRes) || (topicRes.length <= 0) ){
            logger.error("User ", req.user.id, " tried to access a topic that either doesn't exist or don't have access to");
        }
        if (err || !topicRes || topicRes.length <= 0){
            res.status(400);
            res.json({error: "No such topic"});
            return;
        }

        db.Comment.getAll({topic_id: topic._id}, limit, page, req.user, function(error, results){
            logger.verbose('in comment find');
            if (error){
                res.status(500);
                res.json({error: error});
                return;
            }
            res.json(results);
        })
    });


});

//create a new comment in the topic
router.post("/:topicId", function(req, res, next){
    var db = require('../db/db');
    var subscribers = require('../subscribers/subscribers');

    var comment = new db.Comment;
    var topicId = req.params.topicId;
    comment.topic_id = topicId;
    comment.comment = req.body.comment;
    comment.author_user = req.user.id;

    var log = require('npmlog');

    var topic = new db.Topic;
    topic._id = topicId;

    log.debug("finding topic", topicId);
    db.Topic.getAll({_id: topic._id}, 1, 1, req.user, function(err, topicRes){
        log.debug("Topic find one", topicRes, err);
        if (err || !topicRes){
            res.status(400);
            res.json({message: "Invalid Topic"});
            return;
        }

        subscribers.subscribe(topic._id, req.user.id, true, (err2) => {
            if (err2) {
                res.status(500);
                res.json({error: err2.message});
                return;
            }

            comment.save(function(saveErr, result){
                if (saveErr || !result) {
                    res.status(500);
                    res.json({error: saveErr});
                    return;
                }
                var messages = require('../messages/messages');
                log.debug("comment saved triggering websocket");
                messages.sendCommentMessage(topicId, result);

                //send email notifications
                var notifications = require('../notifications/notifications');
                notifications.notify(topicRes[0], comment, req.user);

                res.json({message: "Successfully written", _id: result._id, result: result});
            });
        });
    });

});

module.exports = router;