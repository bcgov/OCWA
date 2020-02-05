

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
var expect = chai.expect;

var config = require('config');
var jwt = config.get('testJWT');
var adminJwt = config.get('testAdminJWT');

var db = require('../../routes/v2/db/db');

var logger = require('npmlog');

chai.use(chaiHttp);

describe("Requests", function() {
    var activeRequestId = '';
    var firstId = '';
    var incorrectId = '';
    var fileId = 'test_' + Math.random().toString(36) + '.jpeg';
    after(function(done){
        db.Request.deleteMany({}, function(err){
            var minio = require('minio');
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
            minioClient.removeObject(storageConfig.bucket, fileId, function(err) {
                if (err) {
                    console.log('Unable to remove object', err);
                    done();
                    return;
                }
                done();
            })
        });
        
    });

    before(function(done){
        var minio = require('minio');
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

        var Fs = require('fs');
        var file = __dirname+'/../file/gov.jpeg';
        var fileStream = Fs.createReadStream(file);

        minioClient.bucketExists(storageConfig.bucket, function(err, exists) {
            if (err) {
                return console.log(err)
            }
            if (!exists) {
                minioClient.makeBucket(storageConfig.bucket, 'us-east-1', function(err) {
                    if (err) {
                        console.log('Error creating bucket.', err);
                        done();
                    }
                    minioClient.putObject(storageConfig.bucket, fileId, fileStream, function(err, etag) {
                        done();
                    });
                })
            }else{
                minioClient.putObject(storageConfig.bucket, fileId, fileStream, function(err, etag) {
                    done();
                });
            }
        });

    });

    describe('/GET v2/', function () {
        it('it should get unauthorized', function (done) {
            chai.request(server)
                .get('/v2/')
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });

        it('it should get file_status_codes', function (done) {
            chai.request(server)
                .get('/v2/file_status_codes')
                .set("Authorization", "Bearer " + jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('0');
                    res.body.should.have.property('1');
                    res.body.should.have.property('2');
                    done();
                });
        });

        it('it should get request_types', function (done) {
            chai.request(server)
                .get('/v2/request_types')
                .set("Authorization", "Bearer " + jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('import');
                    res.body.should.have.property('export');
                    done();
                });
        });

        it('it should get all status code mappings', function (done) {
            chai.request(server)
                .get('/v2/status_codes')
                .set("Authorization", "Bearer "+jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('0');
                    res.body.should.have.property('1');
                    res.body.should.have.property('2');
                    res.body.should.have.property('3');
                    res.body.should.have.property('4');
                    res.body.should.have.property('5');
                    res.body.should.have.property('6');
                    done();
                });
        });

        it('it should get all records (max 100) (currently 6)', function (done) {
            chai.request(server)
                .get('/v2/')
                .set("Authorization", "Bearer "+jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST v2/', function () {
        it('it should get unauthorized', function (done) {
            chai.request(server)
                .post('/v2/')
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });

        it('it should fail without a name', function (done) {
            chai.request(server)
                .post('/v2/')
                .set("Authorization", "Bearer " + jwt)
                .send({
                    text: "text",
                    number: 9
                })
                .end(function (err, res) {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.be.a('string');
                    done();
                });
        });

        it('it should create a request', function (done) {
            chai.request(server)
                .post('/v2/')
                .set("Authorization", "Bearer " + jwt)
                .send({
                    name: "testName",
                    text: "text",
                    number: 9
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('_id');
                    activeRequestId = res.body.result._id;
                    firstId = res.body.result._id;
                    incorrectId = activeRequestId.substring(0, activeRequestId.length-1)+"1";
                    if (incorrectId === activeRequestId){
                        incorrectId = activeRequestId.substring(0, activeRequestId.length-1)+"2";
                    }
                    done();
                });
        });

    });

    describe('/GET  v2 & v2/requestId', function () {
        it('it should get requests', function (done) {
            chai.request(server)
                .get('/v2?limit=101&page=0&state=0&name=*&id='+activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        it('it should get supervisor requests from internal', function (done) {
            chai.request(server)
                .get('/v2')
                .set("Authorization", "Bearer " + config.get('testSupervisorInternalJWT'))
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        it('it should get supervisor requests from external', function (done) {
            chai.request(server)
                .get('/v2')
                .set("Authorization", "Bearer " + config.get('testSupervisorExternalJWT'))
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        it('it should get a specific request', function (done) {
            chai.request(server)
                .get('/v2/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('_id');
                    done();
                });
        });

        it('it should get a specific request but without file statuses', function (done) {
            chai.request(server)
                .get('/v2/' + activeRequestId + "?include_file_status=false")
                .set("Authorization", "Bearer " + jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('_id');
                    res.body.should.not.have.property('fileStatus')
                    done();
                });
        });

    });

    describe('/DELETE /v2/requestId', function() {

        it('it should delete a request', function (done) {
            chai.request(server)
                .delete('/v2/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
        });

        it('it should fail to delete an incorrect id', function (done) {
            chai.request(server)
                .delete('/v2/' + incorrectId)
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        

        it('it should fail to delete an invalid id', function (done) {
            chai.request(server)
                .delete('/v2/1')
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/PUT /v2/save/requestId', function() {

        it('it should create a request', function (done) {
            chai.request(server)
                .post('/v2/')
                .set("Authorization", "Bearer " + jwt)
                .send({
                    name: "testName2",
                    text: "text",
                    number: 9
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('_id');
                    activeRequestId = res.body.result._id;
                    done();
                });
        });

        it('it should fail to save a with an invalid id', function (done) {
            chai.request(server)
                .put('/v2/save/1')
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });


        it('it should fail to save a request', function (done) {
            chai.request(server)
                .put('/v2/save/' + incorrectId)
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('it should save a request', function (done) {
            chai.request(server)
                .put('/v2/save/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({
                    files: [fileId]
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    setTimeout(done, 2000);
                });
        });

        
        it('it should get request file status', function (done) {
            chai.request(server)
                .get('/v2/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('fileStatus');

                    var fs = res.body.fileStatus;
                    // expect(fs[Object.keys(fs)[0]].length).to.equal(2);
                    // expect(fs[Object.keys(fs)[0]][0]["pass"]).to.equal(true);
                    // expect(fs[Object.keys(fs)[0]][1]["pass"]).to.equal(true);
                    // expect(JSON.stringify(res.body, null, 3)).to.equal("");
                    done();
                });
        });

        it('it should update a v1 request', function (done) {
                chai.request(server)
                    .post('/v1/')
                    .set("Authorization", "Bearer " + jwt)
                    .send({
                        name: "testName",
                        tags: ["test"],
                        purpose: "purpose",
                        phoneNumber: "555-555-5555",
                        subPopulation: "sub-population",
                        variableDescriptions: "variable descriptions",
                        selectionCriteria: "selection criteria",
                        steps: "steps",
                        freq: "freq",
                        confidentiality: "none"
                    })
                    .end(function (err, res) {
                        
                        var intermId = res.body.result._id;
                        
                        chai.request(server)
                            .put('/v2/save/' + intermId)
                            .set("Authorization", "Bearer " + jwt)
                            .send({})
                            .end(function (err, res) {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('message');
                                done();
                        });
                    });
            });
        });

    describe('/PUT /v2/submit/requestId', function() {

        it('it should submit a request', function (done) {
            chai.request(server)
                .put('/v2/submit/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    console.log("SHOULD SUBMIT", firstId, activeRequestId);
                    expect(res.body.error).to.equal(undefined);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
        });

        it('it should fail to delete a request that is submitted', function (done) {
            chai.request(server)
                .delete('/v2/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/PUT /v2/pickup/requestId', function() {
        it('it should pickup a request', function (done) {
            chai.request(server)
                .put('/v2/pickup/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    expect(res.body.error).to.equal(undefined);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
        });
    });

    describe('/PUT /v2/approve/requestId', function() {

        it('it should approve a request', function (done) {
            chai.request(server)
                .put('/v2/approve/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    expect(res.body.error).to.equal(undefined);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
        });
    });

    describe('/PUT /v2/cancel/requestId', function() {
        it('it should create a request', function (done) {
            chai.request(server)
                .post('/v2/')
                .set("Authorization", "Bearer " + jwt)
                .send({
                    name: "testName3",
                    text: "text",
                    number: 9
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('_id');
                    activeRequestId = res.body.result._id;
                    done();
                });
        });

        it('it should cancel a request', function (done) {
            chai.request(server)
                .put('/v2/cancel/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
        });
    });

    describe('/PUT /v2/deny/requestId', function() {
        it('it should create a request', function (done) {
            chai.request(server)
                .post('/v2/')
                .set("Authorization", "Bearer " + jwt)
                .send({
                    name: "testName6",
                    text: "text",
                    number: 9
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('_id');
                    activeRequestId = res.body.result._id;
                    done();
                });
        });

        it('it should save a request', function (done) {
            chai.request(server)
                .put('/v2/save/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({
                    files: [fileId]
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    setTimeout(done, 2000);
                });
        });

        it('it should submit a request', function (done) {
            chai.request(server)
                .put('/v2/submit/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    expect(res.body.error).to.equal(undefined);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
        });

        it('it should pickup a request', function (done) {
            chai.request(server)
                .put('/v2/pickup/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    expect(res.body.error).to.equal(undefined);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
        });

        it('it should deny a request', function (done) {
            chai.request(server)
                .put('/v2/deny/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    expect(res.body.error).to.equal(undefined);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('result');
                    done();
                });
        });

    });


    describe('CODE Requests', function() {
        it('it should create a CODE request', function (done) {
            chai.request(server)
                .post('/v2/')
                .set("Authorization", "Bearer " + jwt)
                .send({
                    name: "testName6",
                    text: "text",
                    number: 9,
                    exportType: "code",
                    codeDescription: "Whats the code about",
                    repository: "http://somewhere.com",
                    externalRepository: "http://somewhere.external.com",
                    branch: "develop"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('_id');
                    res.body.result.should.have.property('mergeRequestStatus');
                    activeRequestId = res.body.result._id;
                    done();
                });
        });

        it('it should save a request', function (done) {
            chai.request(server)
                .put('/v2/save/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    setTimeout(done, 1000);
                });
        });

        it('it should fail submit', function (done) {
            chai.request(server)
                .put('/v2/submit/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    expect(res.body.error).to.equal("");
                    done();
                });
        });
    });
});


describe("Forms", function() {
    describe('/GET v2/forms', function () {
        it('it should get unauthorized', function (done) {
            chai.request(server)
            .get('/v2/forms')
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
        });

        it('it should get all forms', function (done) {
            chai.request(server)
                .get('/v2/forms')
                .set("Authorization", "Bearer "+jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('0');
                    res.body[0].should.have.property('_id');
                    done();
                });
        });

        it('it should get default forms', function (done) {
            chai.request(server)
                .get('/v2/forms/defaults')
                .set("Authorization", "Bearer "+jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('forms');
                    res.body.forms.should.have.property('internal')
                    res.body.forms.should.have.property('external')
                    done();
                });
        });

        it('it should get a specific form', function (done) {
            chai.request(server)
                .get('/v2/forms/test')
                .set("Authorization", "Bearer "+jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('_id');
                    done();
                });
        });

        it('it should fail to create a form without admin', function (done) {
            chai.request(server)
                .post('/v2/forms')
                .set("Authorization", "Bearer "+jwt)
                .end(function (err, res) {
                    console.log("FORM ADMIN", res.status, res.body);
                    res.should.have.status(403);
                    res.body.should.have.property('error');
                    done();
                });
        });


        it('it should fail to create a form with no information', function (done) {
            chai.request(server)
                .post('/v2/forms')
                .set("Authorization", "Bearer "+adminJwt)
                .send({})
                .end(function (err, res) {
                    console.log("FORM ADMIN", res.status, res.body);
                    res.should.have.status(500);
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('it should create a form', function (done) {
            chai.request(server)
                .post('/v2/forms')
                .set("Authorization", "Bearer "+adminJwt)
                .send({
                    "title": "testform",
                    "display": "form",
                    "type": "form",
                    "name": "testform",
                    "path": "testform",
                    "components": [{
                        "input": true,
                        "tableView": true,
                        "inputType": "text",
                        "inputMask": "",
                        "label": "First Name",
                        "key": "firstName",
                        "placeholder": "",
                        "prefix": "",
                        "suffix": "",
                        "multiple": false,
                        "defaultValue": "",
                        "protected": false,
                        "unique": false,
                        "persistent": true,
                        "validate": {
                            "required": false,
                            "minLength": "",
                            "maxLength": "",
                            "pattern": "",
                            "custom": "",
                            "customPrivate": false
                        },
                        "conditional": {
                            "show": "",
                            "when": null,
                            "eq": ""
                        },
                        "type": "textfield",
                        "tags": [],
                        "lockKey": true,
                        "isNew": false
                    }, {
                        "input": true,
                        "tableView": true,
                        "inputType": "text",
                        "inputMask": "",
                        "label": "Last Name",
                        "key": "lastName",
                        "placeholder": "",
                        "prefix": "",
                        "suffix": "",
                        "multiple": false,
                        "defaultValue": "",
                        "protected": false,
                        "unique": false,
                        "persistent": true,
                        "validate": {
                            "required": false,
                            "minLength": "",
                            "maxLength": "",
                            "pattern": "",
                            "custom": "",
                            "customPrivate": false
                        },
                        "conditional": {
                            "show": "",
                            "when": null,
                            "eq": ""
                        },
                        "type": "textfield",
                        "tags": [],
                        "lockKey": true,
                        "isNew": false
                    }, {
                        "input": true,
                        "tableView": true,
                        "inputType": "email",
                        "label": "Email",
                        "key": "email",
                        "placeholder": "Enter your email address",
                        "prefix": "",
                        "suffix": "",
                        "defaultValue": "",
                        "protected": false,
                        "unique": false,
                        "persistent": true,
                        "kickbox": {
                            "enabled": false
                        },
                        "type": "email",
                        "lockKey": true,
                        "isNew": false
                    }, {
                        "input": true,
                        "tableView": true,
                        "inputMask": "(999) 999-9999",
                        "label": "Phone Number",
                        "key": "phoneNumber",
                        "placeholder": "",
                        "prefix": "",
                        "suffix": "",
                        "multiple": false,
                        "protected": false,
                        "unique": false,
                        "persistent": true,
                        "defaultValue": "",
                        "validate": {
                            "required": false
                        },
                        "type": "phoneNumber",
                        "conditional": {
                            "eq": "",
                            "when": null,
                            "show": ""
                        },
                        "tags": [],
                        "lockKey": true,
                        "isNew": false
                    }, {
                        "input": true,
                        "label": "Submit",
                        "tableView": false,
                        "key": "submit",
                        "size": "md",
                        "leftIcon": "",
                        "rightIcon": "",
                        "block": false,
                        "action": "submit",
                        "disableOnInvalid": false,
                        "theme": "primary",
                        "type": "button"
                    }]
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('_id');
                    done();
                });
        });

        it('it should fail to update a form with no admin', function (done) {
            chai.request(server)
                .put('/v2/forms/testform')
                .set("Authorization", "Bearer "+jwt)
                .send({
                    "title": "testform2",
                })
                .end(function (err, res) {
                    res.should.have.status(403);
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('it should update a form', function (done) {
            chai.request(server)
                .put('/v2/forms/testform')
                .set("Authorization", "Bearer "+adminJwt)
                .send({
                    "title": "testform2",
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('_id');
                    done();
                });
        });

        it('it should fail to delete a form with no admin', function (done) {
            chai.request(server)
                .delete('/v2/forms/testform')
                .set("Authorization", "Bearer "+jwt)
                .send({})
                .end(function (err, res) {
                    res.should.have.status(403);
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('it should delete a form', function (done) {
            chai.request(server)
                .delete('/v2/forms/testform')
                .set("Authorization", "Bearer "+adminJwt)
                .send({})
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('_id');
                    done();
                });
        });
    });
});
