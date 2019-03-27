// Path /v1/admin/
const admin = require('express').Router();
const config = require('config');
const log = require('npmlog');
const db = require('../db/db');

// all projects (paginated, admin only)
admin.get('/list/project', function (req, res) {
    if (!hasAdminGroup(req, res)) return;

    // TODO: Pagination and result ordering
    db.Project.find({}, 'name -_id', function (err, result) {
        if (err || !result) {
            log.debug(err);
            res.status(500);
            res.json({
                status: 500,
                error: err.message
            });
        } else {
            res.json(result.map(function (e) { return e.name }));
        }
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
admin.post('/create', function (req, res) {
    if (!hasAdminGroup(req, res)) return;

    const project = new db.Project;
    if (req.body.name && typeof req.body.name === 'string') {
        project.name = req.body.name;
    } else {
        log.error('User ' + req.user.id + ' tried to create a project without a name string');
        res.status(400);
        res.json({
            status: 400,
            error: 'Missing required name string in project'
        });
        return;
    }

    if (req.body.permissions && typeof req.body.permissions === 'object') {
        project.permissions = req.body.permissions;
    } else {
        log.info('Permissions was not defined - defaulting to empty object')
        project.permissions = {};
    }

    log.debug("Creating project:", project);

    project.save(function (err) {
        if (err) {
            log.debug(err);
            res.status(500);
            res.json({
                status: 500,
                error: err.message
            });
        } else {
            res.status(201);
            res.json({
                status: 201,
                message: 'Successfully written'
            });
        }
    });
});

// add permisison to project
admin.put('/:projectName/:permissionName', function (req, res, next) {
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
admin.delete('/:permissionName/:permissionName', function (req, res, next) {
    if (!hasAdminGroup(req, res)) return;

    res.status(501);
    res.json({
        status: 501,
        message: 'Not Implemented'
    });
});

// Returns true if there an admin group
function hasAdminGroup(req, res) {
    if (config.has('adminGroup')) {
        const reqRole = config.get('adminGroup');
        if (req.user.groups.includes(reqRole)) {
            return true;
        } else {
            log.error('User ' + req.user.id + ' tried to create a project but lacks required role: ' + reqRole);
            res.status(403);
            res.json({
                status: 403,
                error: 'Lack required role to create a request'
            });
            return false;
        }
    }
    return false;
}

module.exports = admin;
