var express = require('express');
var router = express.Router();
var path = require('path');

var db = require('./db/db');

var requestRouter = require('./routes/requests')(db);

var auth = require('./auth/auth')(db);

//api spec
router.use('/spec', express.static(path.join(__dirname, 'spec')));

//api docs
router.use('/api-docs', function(req, res){
    var docs = require('./docs/docs');
    res.send(docs.getDocHTML("v2"));
});

//requests
router.use('/', auth.authenticate('jwt', {session: false}), requestRouter);

module.exports = router;