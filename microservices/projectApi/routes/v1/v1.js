const express = require('express');
const router = express.Router();
const path = require('path');

const adminRouter = require('./routes/admin');
const permissionsRouter = require('./routes/permissions');
const projectRouter = require('./routes/project');

const auth = require('./auth/auth');

// API Spec
router.use('/spec', express.static(path.join(__dirname, 'spec')));

// API Docs
router.use('/api-docs', function (_, res) {
    var docs = require('./docs/docs');
    res.send(docs.getDocHTML("v1"));
});

// Admin
router.use('/admin', auth.authenticate('jwt', { session: false }), adminRouter);

// Permissions
router.use('/permissions', auth.authenticate('jwt', { session: false }), permissionsRouter);

// Project
router.use('/', auth.authenticate('jwt', { session: false }), projectRouter);

module.exports = router;