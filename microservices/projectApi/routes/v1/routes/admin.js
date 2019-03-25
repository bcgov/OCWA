// Path /v1/admin/
const admin = require('express').Router();
const mongoose = require('mongoose');
const db = require('../db/db');

// all projects (paginated, admin only)
admin.get('/list/project', function(req, res, next) {
    res.status(501);
    res.json({
        status: 501,
        message: 'Not Implemented'
    });
});

// all groups with specific permissions (admin only)
admin.get('/list/permission', function(req, res, next) {
    res.status(501);
    res.json({
        status: 501,
        message: 'Not Implemented'
    });
});

// create new project (default no perms, can list perms optionally)
admin.post('/create', function(req, res, next) {
    res.status(501);
    res.json({
        status: 501,
        message: 'Not Implemented'
    });
});

// add permisison to project
admin.put('/:projectId/:permissionId', function(req, res, next) {
    res.status(501);
    res.json({
        status: 501,
        message: 'Not Implemented'
    });
});

// remove project
admin.delete('/:projectId', function(req, res, next) {
    res.status(501);
    res.json({
        status: 501,
        message: 'Not Implemented'
    });
});

// remove permission from project
admin.delete('/:projectId/:permissionId', function(req, res, next) {
    res.status(501);
    res.json({
        status: 501,
        message: 'Not Implemented'
    });
});

module.exports = admin;
