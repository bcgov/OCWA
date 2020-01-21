//module.exports = require('../../../../shared/js/src/project_config_client');

//used in v2+

const config = require('config');
const httpReq = require('request');
const logger = require('npmlog');

var formio = {};

formio.auth = function(callback){
    var data = {
        data: {
            email: config.get("formio.username"),
            password: config.get("formio.password")
        }
    };
    var url = config.get('formio.url') + "/user/login";
    logger.verbose("formio auth", url);
    httpReq.post(url, {body: data, json: true}, function(err, res, body){
        if (err){
            logger.verbose("formio auth err", err);
            callback(err);
        }else{
            logger.verbose("formio auth success");
            callback(err, res.headers['x-jwt-token']);
        }
    });
}

formio.getSubmissions = function(formName, callback) {
    this.auth(function(err, jwt){
        if (err){
            logger.error("Error getting jwt", err);
        }
        var url = config.get('formio.url') + "/"+formName+"/submission";
        
        logger.verbose("formio get submissions", url);
        httpReq.get(url, {headers: {'x-jwt-token': jwt}}, function(err, res, body){
            if (err){
                logger.verbose("formio get submissions err", err);
                callback(err);
            }else{
                logger.verbose("formio get submissions success");
                callback(null, body);
            }
        });
    });
}

formio.getSubmission = function(formName, submissionId, callback) {
    this.auth(function(err, jwt){
        if (err){
            logger.error("Error getting jwt", err);
        }
        var url = config.get('formio.url') + "/"+formName+"/submission/"+submissionId;
        logger.verbose("formio get submission", url);
        
        httpReq.get(url, {headers: {'x-jwt-token': jwt}}, function(err, res, body){
            if (err){
                logger.verbose("formio get submission err", err);
                callback(err);
            }else{
                logger.verbose("formio get submission success");
                callback(null, body);
            }
        });
    });
};

formio.postSubmission = function(formName, values, callback) {
    this.auth(function(err, jwt){
        if (err){
            logger.error("Error getting jwt", err);
        }
        var url = config.get('formio.url') + "/"+formName+"/submission";

        var data = {
            data: values
        };

        var opts = {
            headers: {
                'x-jwt-token': jwt,
                'Content-Type': "application/json"
            },
            body: data,
            json: true
        }
        
        logger.verbose("formio post submission", url);
        httpReq.post(url, opts, function(err, res, body){
            if (err){
                logger.verbose("formio post submission err", err);
                callback(err);
            }else{
                logger.verbose("formio post submission success", res.statusCode, res.body, body);
                callback(null, body);
            }
        });
    });
};

formio.deleteSubmission = function(formName, submissionId, callback) {
    this.auth(function(err, jwt){
        if (err){
            logger.error("Error getting jwt", err);
        }
        var url = config.get('formio.url') + "/"+formName+"/submission/"+submissionId;
        
        httpReq.delete(url, {headers: {'x-jwt-token': jwt}}, function(err, res, body){
            if (err){
                callback(err);
            }else{
                callback(null, body);
            }
        });
    });
};

formio.putSubmission = function(formName, submissionId, values, callback) {
    this.auth(function(err, jwt){
        if (err){
            logger.error("Error getting jwt", err);
        }
        var url = config.get('formio.url') + "/"+formName+"/submission/"+submissionId;

        var data = {
            data: values
        };
        
        httpReq.put(url, {headers: {'x-jwt-token': jwt}, body: data, json: true}, function(err, res, body){
            if (err){
                callback(err);
            }else{
                callback(null, body);
            }
        });
    });
};

formio.getForms = function(callback) {
    this.auth(function(err, jwt){
        if (err){
            logger.error("Error getting jwt", err);
        }
        var url = config.get('formio.url') + "/form";
        
        logger.verbose("formio get forms", url);
        httpReq.get(url, {headers: {'x-jwt-token': jwt}}, function(err, res, body){
            if (err){
                logger.verbose("formio get forms err", err);
                callback(err);
            }else{
                logger.verbose("formio get forms success");
                callback(null, body);
            }
        });
    });
};

formio.getForm = function(formName, callback) {
    this.auth(function(err, jwt){
        if (err){
            logger.error("Error getting jwt", err);
        }
        var url = config.get('formio.url') + "/"+formName;
        
        logger.verbose("formio get form", url);
        httpReq.get(url, {headers: {'x-jwt-token': jwt}}, function(err, res, body){
            if (err){
                logger.verbose("formio get form err", err);
                callback(err);
            }else{
                logger.verbose("formio get form success");
                callback(null, body);
            }
        });
    });
};

formio.postForm = function(data, callback) {
    this.auth(function(err, jwt){
        if (err){
            logger.error("Error getting jwt", err);
        }
        var url = config.get('formio.url') + "/form";
        
        httpReq.post(url, {headers: {'x-jwt-token': jwt}, body: data, json: true}, function(err, res, body){
            if (err){
                callback(err);
            }else{
                callback(null, body);
            }
        });
    });
};

formio.putForm = function(formName, data, callback) {
    this.auth(function(err, jwt){
        if (err){
            logger.error("Error getting jwt", err);
        }
        var url = config.get('formio.url') + "/form/" + formName;
        
        httpReq.put(url, {headers: {'x-jwt-token': jwt}, body: data, json: true}, function(err, res, body){
            if (err){
                callback(err);
            }else{
                callback(null, body);
            }
        });
    });
};

formio.deleteForm = function(formName, callback) {
    this.auth(function(err, jwt){
        if (err){
            logger.error("Error getting jwt", err);
        }
        var url = config.get('formio.url') + "/" + formName;
        
        httpReq.delete(url, {headers: {'x-jwt-token': jwt}}, function(err, res, body){
            if (err){
                callback(err);
            }else{
                callback(null, body);
            }
        });
    });
};


//formio.getSubmissions("test", function(e,r){console.log("Yo", e, r);});

module.exports = formio;
