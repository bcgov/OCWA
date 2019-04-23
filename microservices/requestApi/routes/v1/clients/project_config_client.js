//module.exports = require('../../../../shared/js/src/project_config_client');
// Since we do not have an NPM registry for our code, we will duplicate this client code
// in the microservices that need it, ugh

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
        }, function(apiErr, apiRes, _pconfig){
            if ((!apiErr) && (apiRes.statusCode === 200)){

                var pconfig = (typeof _pconfig === "string" ? JSON.parse(_pconfig):_pconfig);

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
    if (config.has('requiredRoleToCreateRequest')) {
        ignoreGroups.push(config.get('requiredRoleToCreateRequest'));
    }

    for (var i=0; i<ignoreGroups.length; i++){
        var ignoreIndex = groups.indexOf(ignoreGroups[i]);
        if (ignoreIndex !== -1){
            groups.splice(ignoreIndex, 1);
        }
    }

    var index = config.has('outputCheckerGroup') ? groups.indexOf(config.get('outputCheckerGroup')) : -1;
    if (index !== -1){
        groups.splice(index,1);
    }

    return groups.length == 0 ? null: (groups[0].startsWith('/') ? groups[0].substring(1):groups[0]);
};

projectConfig.get = async function(project, key) {
    return await getProjectConfig(project, key);
};

module.exports = projectConfig;
