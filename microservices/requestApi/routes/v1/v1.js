var express = require('express');
var router = express.Router();
var path = require('path');

var requestRouter = require('./routes/requests');

var auth = require('./auth/auth');

//api spec
router.use('/spec', express.static(path.join(__dirname, 'spec')));

//api docs
router.use('/api-docs', function(req, res){
    var docs = require('./docs/docs');
    res.send(docs.getDocHTML("v1"));
});

// webhook to receive file status updates from validate API
router.use('/webhook', require('./auth/webhook_auth').authenticate('headerapikey', {session: false}), require('./routes/webhook'));

//requests
router.use('/', auth.authenticate('jwt', {session: false}), requestRouter);

module.exports = router;