// Path /v1/permissions/
const permissions = require('express').Router();
const mongoose = require('mongoose');
const db = require('../db/db');

// all unique permissions
permissions.get('/', function(req, res, next) {
    res.status(501);
    res.send('Not Implemented');
});

// specific project's permissions
permissions.get('/:requestName', function(req, res, next) {
    res.status(501);
    res.send('Not Implemented');
});

module.exports = permissions;
