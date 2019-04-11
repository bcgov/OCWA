const config = require('config');
const httpReq = require('request');
const log = require('npmlog');

var projectConfig = {};

function getProjectConfig (project, key) {
    return new Promise(function(resolve, reject) {    
        httpReq.get({
            url: config.get('projectApi') + '/v1/permissions/' + project,
            headers: {
                'Authorization': "Api-Key " + config.get("projectApiSecret")
            }
        }, function(apiErr, apiRes, pconfig){
            if ((!apiErr) && (apiRes.statusCode === 200)){

                // if the key is defined in the project, then return its value,
                // otherwise return the one defined globally
                if (key in pconfig) {
                    log.info("project_config", "Using project %j", pconfig[key]);
                    resolve(pconfig[key]);
                } else {
                    log.info("project_config", "Using default %j", config.get(key));
                    resolve(config.get(key));
                }
            } else {
                log.info("project_config", "[%j : %j] No project config - using default: %j", project, key, config.get(key));
                resolve(config.get(key));
            }
        });
    });
}

projectConfig.deriveProjectFromUser = function (user) {
    var groups = user.groups.slice();

    var ignoreGroups = config.has('ignoreGroupsFromConsideration') ? config.get('ignoreGroupsFromConsideration') : [];
    if (config.has('requiredRoleToCreateTopic')) {
        ignoreGroups.push(config.get('requiredRoleToCreateTopic'));
    }

    for (var i=0; i<ignoreGroups.length; i++){
        var ignoreIndex = groups.indexOf(ignoreGroups[i]);
        if (ignoreIndex !== -1){
            groups.splice(ignoreIndex, 1);
        }
    }

    var index = groups.indexOf('/oc');
    if (index !== -1){
        groups.splice(index,1);
    }

    return groups.length == 0 ? null:groups[0];
};

projectConfig.get = async function(project, key) {
    return await getProjectConfig(project, key);
};

module.exports = projectConfig;
