// Path /v1/
const project = require('express').Router();
const mongoose = require('mongoose');
const db = require('../db/db');

// create new project (default no perms, can list perms optionally)
project.post('/create', function(req, res, next) {
    res.status(501);
    res.send('Not Implemented');
});

/* GET all requests. */
project.get('/', function(req, res, next) {
    res.status(501);
    res.send('Not Implemented');
});

module.exports = project;
