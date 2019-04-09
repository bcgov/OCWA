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
                    log.debug("project_config", "Using project %j", pconfig[key]);
                    resolve(pconfig[key]);
                } else {
                    log.debug("project_config", "Using default %j", config.get(key));
                    resolve(config.get(key));
                }
            } else {
                log.debug("project_config", "[%j : %j] No project config - using default: %j", project, key, config.get(key));
                resolve(config.get(key));
            }
        });
    });
}

projectConfig.get = async function(project, key) {
    return await getProjectConfig(project, key);
};

module.exports = projectConfig;
