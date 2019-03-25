// Path /v1/admin/
const admin = require('express').Router();
const mongoose = require('mongoose');
const db = require('../db/db');

// all projects (paginated, admin only)
admin.get('/projects', function(req, res, next) {
    res.status(501);
    res.send('Not Implemented');
});

// all groups with specific permissions (admin only)
admin.get('/permissions', function(req, res, next) {
    res.status(501);
    res.send('Not Implemented');
});

// add permisison to project
admin.put('/project', function(req, res, next) {
    res.status(501);
    res.send('Not Implemented');
});

// remove project
admin.delete('/project', function(req, res, next) {
    res.status(501);
    res.send('Not Implemented');
});

// remove permission from project
admin.delete('/permission', function(req, res, next) {
    res.status(501);
    res.send('Not Implemented');
});

module.exports = admin;
