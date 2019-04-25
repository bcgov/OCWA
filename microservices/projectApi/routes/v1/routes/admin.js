// Path /v1/admin/
const admin = require('express').Router();
const config = require('config');
const log = require('npmlog');
const db = require('../db/db');

// list all projects
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

// list all projects with a specific permission
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
admin.post('/project/create', function (req, res) {
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

// add or update permissions for an existing project
admin.put('/project/:projectName/permission', function (req, res) {
    if (!hasAdminGroup(req, res)) return;

    const projectName = req.params.projectName

    if (!req.body || Object.getOwnPropertyNames(req.body).length === 0) {
        log.debug('Empty or missing body in request');
        res.status(400)
        res.json({
            status: 400,
            message: 'Empty or missing body in request'
        });
        return;
    }

    db.Project.find({ name: projectName }, 'permissions -_id', function(err, result) {
        if (err || !result) {
            log.debug(err);
            res.status(500);
            res.json({
                status: 500,
                error: err.message
            });
        } else {
            if (result.length === 1) {
                // Merge permissions by overlaying incoming permissions
                const currentPerms = (result[0].permissions) ? result[0].permissions : {}
                const permissions = Object.assign(currentPerms, req.body);

                db.Project.findOneAndUpdate({ name: projectName }, {
                    permissions: permissions
                }, function(err) {
                    if (err) {
                        log.debug(err);
                        res.status(500);
                        res.json({
                            status: 500,
                            error: err.message
                        });
                    } else {
                        log.debug('Updated permissions for project ' + projectName);
                        res.status(202)
                        res.json({
                            status: 202,
                            message: 'Permissions for project ' + projectName + ' updated'
                        });
                    }
                });
            } else if (result.length > 1) {
                res.status(500);
                res.json({
                    status: 500,
                    message: 'No distinct project ' + projectName + ' found'
                })
            } else {
                res.status(404);
                res.json({
                    status: 404,
                    message: 'Project ' + projectName + ' not found'
                })
            }
        }
    });
});

// remove project
admin.delete('/project/:projectName', function (req, res) {
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
                message: 'Project ' + projectName + ' deleted'
            });
        }
    });
});

// remove permission from project
admin.delete('/project/:projectName/permission/:permissionName', function (req, res, next) {
    if (!hasAdminGroup(req, res)) return;

    const projectName = req.params.projectName
    const permissionName = req.params.permissionName
    db.Project.updateOne({ name: projectName }, {
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
                message: 'Permission ' + permissionName + ' from project ' + projectName + ' deleted'
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
            log.error('User ' + req.user.id + ' tried to perform an action but lacks required role: ' + reqRole);
            res.status(403);
            res.json({
                status: 403,
                error: 'Lack required role to perform action'
            });
            return false;
        }
    }
    return false;
}

module.exports = admin;
