// Path /v1/permissions/
const permissions = require('express').Router();
const db = require('../db/db');
const log = require('npmlog');

// all unique permissions
permissions.get('/list', function(_, res) {
    db.Project.aggregate([
        {
            $group: {
                _id: null,
                permissions: {
                    $mergeObjects: '$permissions'
                }
            }
        },
        {
            $project: {
                _id: 0,
                permissions: 1
            },
        }
    ]).exec(function(err, result) {
        if (err || !result) {
            log.debug(err);
            res.status(500);
            res.json({
                status: 500,
                error: err.message
            });
        } else {
            res.json(Object.keys(result[0].permissions));
        }
    });
});

// specific project's permissions
permissions.get('/:projectName', function(req, res) {
    const projectName = req.params.projectName;
    db.Project.find({
        name: projectName
    }, 'permissions -_id', function(err, result) {
        if (err || !result) {
            log.debug(err);
            res.status(500);
            res.json({
                status: 500,
                error: err.message
            });
        } else {
            if (result.length === 1) {
                const currentPerms = (result[0].permissions) ? result[0].permissions : {}
                res.json(currentPerms);
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

module.exports = permissions;
