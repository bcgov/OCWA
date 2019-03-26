// Path /v1/permissions/
const permissions = require('express').Router();
const config = require('config');
const db = require('../db/db');
const log = require('npmlog');

// all unique permissions
permissions.get('/list', function(req, res, next) {
    res.status(501);
    res.json({
        status: 501,
        message: 'Not Implemented'
    });
});

// specific project's permissions
permissions.get('/:projectId', function(req, res, next) {
    res.status(501);
    res.json({
        status: 501,
        message: 'Not Implemented'
    });
});

module.exports = permissions;
