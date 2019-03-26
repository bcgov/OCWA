// Path /v1/admin/
const admin = require('express').Router();
const config = require('config');
const log = require('npmlog');
const db = require('../db/db');

// all projects (paginated, admin only)
admin.get('/list/project', function (req, res, next) {
    if (!hasAdminGroup(req, res)) return;

    res.status(501);
    res.json({
        status: 501,
        message: 'Not Implemented'
    });
});

// all groups with specific permissions (admin only)
admin.get('/list/permission', function (req, res, next) {
    if (!hasAdminGroup(req, res)) return;

    res.status(501);
    res.json({
        status: 501,
        message: 'Not Implemented'
    });
});

// create new project (default no perms, can list perms optionally)
admin.post('/create', function (req, res, next) {
    if (!hasAdminGroup(req, res)) return;

    res.status(201);
    res.json({
        status: 201,
        message: "Successfully written",
        result: "TBD"
    });
});

// add permisison to project
admin.put('/:projectId/:permissionId', function (req, res, next) {
    if (!hasAdminGroup(req, res)) return;

    res.status(501);
    res.json({
        status: 501,
        message: 'Not Implemented'
    });
});

// remove project
admin.delete('/:projectId', function (req, res, next) {
    if (!hasAdminGroup(req, res)) return;

    res.status(501);
    res.json({
        status: 501,
        message: 'Not Implemented'
    });
});

// remove permission from project
admin.delete('/:projectId/:permissionId', function (req, res, next) {
    if (!hasAdminGroup(req, res)) return;

    res.status(501);
    res.json({
        status: 501,
        message: 'Not Implemented'
    });
});

// Returns a boolean on the presence of the admin group
function hasAdminGroup(req, res) {
    if (config.has('adminGroup')) {
        const reqRole = config.get('adminGroup');
        if (req.user.groups.includes(reqRole)) {
            return true;
        } else {
            log.error('User ' + req.user.id + " tried to create a project but lacks required role: " + reqRole);
            res.status(403);
            res.json({
                status: 403,
                error: "Lack required role to create a request"
            });
            return false;
        }
    }
    return false;
}

module.exports = admin;
