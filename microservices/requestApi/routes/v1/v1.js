var express = require('express');
var router = express.Router();
var path = require('path');

var db = require('./db/db');

var requestRouter = require('./routes/requests')(db);
var webhookRouter = require('./routes/webhook')(db);

var auth = require('./auth/auth')(db);
var webhookAuth = require('./auth/webhook_auth')();

//api spec
router.use('/spec', express.static(path.join(__dirname, 'spec')));

//api docs
router.use('/api-docs', function(req, res){
    var docs = require('./docs/docs');
    res.send(docs.getDocHTML("v1"));
});

// webhook to receive file status updates from validate API
router.use('/webhook', webhookAuth.authenticate('headerapikey', {session: false}), webhookRouter);

//requests
router.use('/', auth.authenticate('jwt', {session: false}), requestRouter);

module.exports = router;