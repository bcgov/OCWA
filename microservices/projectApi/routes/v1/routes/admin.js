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

// all projects with specific permissions (admin only)
admin.get('/list/permission/:permissionName', function (req, res) {
    if (!hasAdminGroup(req, res)) return;

    const permissionName = req.params.permissionName
    db.Project.find({
        ['permissions.' + permissionName]: {
            $exists: true
        }
    }, function (err, result) {
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

    log.debug('Creating project:', project);

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
                message: 'Project ' + project.name + ' successfully created'
            });
        }
    });
});

// add or update permisison for existing project
admin.put('/:projectName/:permissionName', function (req, res, next) {
    if (!hasAdminGroup(req, res)) return;

    res.status(501);
    res.json({
        status: 501,
        message: 'Not Implemented'
    });
});

// remove project
admin.delete('/:projectName', function (req, res) {
    if (!hasAdminGroup(req, res)) return;

    const projectName = req.params.projectName
    db.Project.deleteOne({ name: projectName }, function(err, result) {
        if (err) {
            log.debug(err);
            res.status(500);
            res.json({
                status: 500,
                error: err.message
            });
        } else if (!result.deletedCount) {
            log.debug('Project ' + projectName + ' not found');
            res.status(404)
            res.json({
                status: 404,
                message: 'Project ' + projectName + ' not found'
            });
        } else {
            log.debug('Deleted project', projectName);
            res.status(202)
            res.json({
                status: 202,
                message: 'Project ' + projectName + ' successfully deleted'
            });
        }
    });
});

// remove permission from project
admin.delete('/:projectName/:permissionName', function (req, res, next) {
    if (!hasAdminGroup(req, res)) return;

    const projectName = req.params.projectName
    const permissionName = req.params.permissionName
    db.Project.updateOne({name: projectName }, {
        $unset: {
            ['permissions.' + permissionName]: ''
        }
    }, function(err, result) {
        if (err) {
            log.debug(err);
            res.status(500);
            res.json({
                status: 500,
                error: err.message
            });
        } else if (!result.nModified) {
            log.debug('Project ' + projectName + ' or permission ' + permissionName + ' not found');
            res.status(404)
            res.json({
                status: 404,
                message: 'Project ' + projectName + ' or permission ' + permissionName + ' not found'
            });
        } else {
            log.debug('Deleted permission ' + permissionName + ' from project ' + projectName);
            res.status(202)
            res.json({
                status: 202,
                message: 'Permission ' + permissionName + ' from project ' + projectName + ' successfully deleted'
            });
        }
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
