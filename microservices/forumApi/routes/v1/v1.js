var express = require('express');
var router = express.Router();
var path = require('path');

var topicRouter = require('./routes/topics');
var commentRouter = require('./routes/comments');
var permissionRouter = require('./routes/permissions');

var auth = require('./auth/auth');

//api spec
router.use('/spec', express.static(path.join(__dirname, 'spec')));

//api docs
router.use('/api-docs', function(req, res){
    var docs = require('./docs/docs');
    res.send(docs.getDocHTML("v1"));
});


//permissions
router.use('/permission', permissionRouter);

//topics
router.use('/', auth.authenticate('jwt', {session: false}), topicRouter);

//comments
router.use('/comment', auth.authenticate('jwt', {session: false}), commentRouter);


module.exports = router;