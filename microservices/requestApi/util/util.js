var log = require('npmlog');


util = {};

util.chunkArray = (array=[],chunkSize) =>{
    return array.length? [array.slice(0,chunkSize), ...util.chunkArray(array.slice(chunkSize),chunkSize)]: []
}

util.pushError = (status, files, message) => {
    for (var fileId of files) {
        status[fileId].push({error: message});
    }
}

util.getBundleMeta = function(fileIds, callback){

    if (fileIds.length === 0){
        callback([]);
        return;
    }

    var config = require('config');
    var storageConfig = config.get('storageApi');
    var Minio = require('minio');
    var minioClient = new Minio.Client({
        endPoint: storageConfig['uri'],
        port: parseInt(storageConfig['port']),
        useSSL: (storageConfig['useSSL'] === 'true'),
        accessKey: storageConfig['key'],
        secretKey: storageConfig['secret']
    });

    var metadata = [];
    for (var i=0; i<fileIds.length; i++) {
        minioClient.statObject(storageConfig.bucket, fileIds[i], function(err, stat){
            if (err){
                log.error(err);
                metadata.push({});
            }else{
                metadata.push(stat);
            }

            if (metadata.length >= fileIds.length){
                callback(metadata);
            }
        });
    }

};

util.getFileStatus = function(fileIds, callback){

    if (fileIds.length === 0){
        callback({}, true);
        return;
    }

    var config = require('config');

    var status = {};
    var fullPass = true;
    var numResults = 0;
    var httpReq = require('request');

    var chunkedFileIds = this.chunkArray(fileIds, 25);
    for (var i in chunkedFileIds) {
        (function(index){
            var chunk = chunkedFileIds[index];
            log.debug("Attempting to get status for", chunk.length, "fileids");
            httpReq.get({
                url: config.get('validationApi') + '/v1/validate',
                qs: {files: chunk.join(',')},
                headers: {
                    'X-API-KEY': config.get('validationApiSecret')
                }
            }, function (apiErr, apiRes, body) {
                for (var fileId of chunk) {
                    status[fileId] = []
                }
                if (apiErr || !apiRes) {
                    util.pushError (status, chunk, apiErr.message);
                    fullPass = false;
                } else {
                    // 0 is pass
                    try {
                        var json = JSON.parse(body);
                        body = json;
                        log.debug("Got statuses for", chunk.length, "files:", body.length, "results returned from validate");

                        for (var j = 0; j < body.length; j++) {
                            
                            status[body[j].file_id].push({
                                pass: (body[j].state === 0),
                                state: body[j].state,
                                message: body[j].message,
                                name: body[j].rule_id,
                                mandatory: body[j].mandatory
                            });

                            if (body[j].state !== 0) {
                                fullPass = false;
                            }
                        }
                    }catch(ex){
                        log.error(ex);
                        util.pushError (status, chunk, "parsing error for validation response.");
                        fullPass = false;
                    }
                }
                numResults += chunk.length;
                if (numResults === fileIds.length) {
                    log.debug("Returning all file statuses for", Object.keys(status).length, "files");
                    log.verbose("Returning all file statuses of:", status);
                    callback(status, fullPass);
                    return;
                }

            });
        })(i);
    }
};

util.deleteRouterRoute = function(router, routePath){
    var routes = router.stack;
    routes.forEach(removeMiddlewares);
    function removeMiddlewares(route, i, routes) {
        console.log(route.route.path);
        switch (route.route.path) {
            case routePath:
                console.log("++++++++REMOVING route", routePath);
                routes.splice(i, 1);
        }
    }
}

util.listRouterRoutes = function(router){
    var routes = router.stack;
    routes.forEach(listMiddlewares);
    function listMiddlewares(route, i, routes) {
        console.log(route.route.path);
    }
};


module.exports = util;