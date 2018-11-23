util = {};

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
        port: storageConfig['port'],
        useSSL: storageConfig['useSSL'],
        accessKey: storageConfig['key'],
        secretKey: storageConfig['secret']
    });

    var log = require('npmlog');

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

    for (var i = 0; i < fileIds.length; i++) {
        var index = i;
        httpReq.get({
            url: config.get('validationApi') + '/v1/validate/' + fileIds[i],
            headers: {
                'X-API-KEY': config.get('validationApiSecret')
            }
        }, function (apiErr, apiRes, body) {
            status[fileIds[index]] = [];
            if (apiErr || !apiRes) {
                status[fileIds[index]].push({error: apiErr.message});
            } else {
                // 0 is pass
                var json = JSON.parse(body);
                body = json;

                for (var j=0; j<body.length; j++) {

                    status[fileIds[index]].push({
                        pass: (body[j].state === 0),
                        state: body[j].state,
                        message: body[j].message,
                        name: body[j].rule_id,
                        mandatory: body[j].mandatory
                    });

                    if (body.state !== 0){
                        fullPass = false;
                    }
                }
            }
            numResults++;
            if (numResults === fileIds.length) {
                callback(status, fullPass);
                return;
            }

        });
    }
};


module.exports = util;