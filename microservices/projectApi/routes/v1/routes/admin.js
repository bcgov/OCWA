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

    if (req.body.permissions &&
        typeof req.body.permissions === 'object' &&
        Array.isArray(req.body.permissions)) {
        const permissions = req.body.permissions;
        for (let i = 0; i < permissions.length; i++) {
            if (!validatePermission(req, res, permissions[i], true)) return;
        }

        project.permissions = req.body.permissions;
    } else {
        log.info('Permissions is either missing or invalid format - defaulting to empty array')
        project.permissions = [];
    }

    log.debug("Creating project:", project);

    res.status(201);
    res.json({
        status: 201,
        message: 'Successfully written',
        _id: project._id
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

// Returns true if the permission object is correct
// Set respond to true if a response is needed
function validatePermission(req, res, permission, respond = false) {
    if (!permission || typeof permission !== 'object') {
        if (respond) {
            log.error('User ' + req.user.id + ' tried to create a project with an invalid permission object');
            res.status(400);
            res.json({
                status: 400,
                error: 'Missing or invalid required permission object'
            });
        }
        return false;
    }
    if (!permission.label || typeof permission.label !== 'string') {
        if (respond) {
            log.error('User ' + req.user.id + ' tried to create a project with an invalid or missing label string');
            res.status(400);
            res.json({
                status: 400,
                error: 'Missing or invalid required label string in permission'
            });
        }
        return false;
    }
    if (!permission.value) {
        if (respond) {
            log.error('User ' + req.user.id + ' tried to create a project without a permission value object');
            res.status(400);
            res.json({
                status: 400,
                error: 'Missing required value object in permission'
            });
        }
        return false;
    }

    return true;
}

module.exports = admin;
