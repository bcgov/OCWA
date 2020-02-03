

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
var expect = chai.expect;

var config = require('config');
var jwt = config.get('testJWT');

var db = require('../../routes/v1/db/db');

var logger = require('npmlog');

chai.use(chaiHttp);

describe("Requests", function() {
    var activeRequestId = '';
    var incorrectId = '';
    var validTopicId = '';
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

    describe('/GET v1/', function () {
        it('it should get unauthorized', function (done) {
            chai.request(server)
                .get('/v1/')
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });

        it('it should get file_status_codes', function (done) {
            chai.request(server)
                .get('/v1/file_status_codes')
                .set("Authorization", "Bearer "+jwt)
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
                .get('/v1/request_types')
                .set("Authorization", "Bearer "+jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('import');
                    res.body.should.have.property('export');
                    done();
                });
        });

        it('it should get all status code mappings', function (done) {
            chai.request(server)
                .get('/v1/status_codes')
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

        it('it should get all records (max 100) (currently 0)', function (done) {
            chai.request(server)
                .get('/v1/')
                .set("Authorization", "Bearer "+jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST v1/', function () {
        it('it should get unauthorized', function (done) {
            chai.request(server)
                .post('/v1/')
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });

        it('it should fail without a name', function (done) {
            chai.request(server)
                .post('/v1/')
                .set("Authorization", "Bearer " + jwt)
                .send({
                    tags: ["test"],
                    purpose: "purpose",
                    variableDescriptions: "variable descriptions",
                    selectionCriteria: "selection criteria",
                    steps: "steps",
                    freq: "freq",
                    confidentiality: "none"
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
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('_id');
                    activeRequestId = res.body.result._id;
                    validTopicId = res.body.result.topic;
                    done();
                });
        });

    });

    describe('/GET  v1 & v1/requestId', function () {
        it('it should get requests', function (done) {
            chai.request(server)
                .get('/v1?limit=1&page=1&name=testName&topic_id=' + validTopicId + '&type=export' )
                .set("Authorization", "Bearer " + jwt)
                .end(function (err, res) {
                    console.log('GET REQUESTS ', res.body);
                    res.should.have.status(200);
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        it('it should fail with an invalid id', function (done) {
            chai.request(server)
                .get('/v1/1')
                .set("Authorization", "Bearer " + jwt)
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('it should get supervisor requests from internal', function (done) {
            chai.request(server)
                .get('/v1')
                .set("Authorization", "Bearer " + config.get('testSupervisorInternalJWT'))
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        it('it should get supervisor requests from external', function (done) {
            chai.request(server)
                .get('/v1')
                .set("Authorization", "Bearer " + config.get('testSupervisorExternalJWT'))
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        it('it should get a specific request', function (done) {
            chai.request(server)
                .get('/v1/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('_id');
                    res.body.should.have.property('fileStatus')
                    done();
                });
        });

        it('it should get a specific request but without file statuses', function (done) {
            chai.request(server)
                .get('/v1/' + activeRequestId + "?include_file_status=false")
                .set("Authorization", "Bearer " + jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('_id');
                    res.body.should.not.have.property('fileStatus')
                    done();
                });
        });

    });

    describe('/DELETE /v1/requestId', function() {

        it('it should delete a request', function (done) {
            chai.request(server)
                .delete('/v1/' + activeRequestId)
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

    describe('/PUT /v1/save/requestId', function() {

        it('it should create a request', function (done) {
            chai.request(server)
                .post('/v1/')
                .set("Authorization", "Bearer " + jwt)
                .send({
                    name: "testName2",
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
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('_id');
                    activeRequestId = res.body.result._id;
                    incorrectId = activeRequestId.substring(0, activeRequestId.length-1)+"1";
                    if (incorrectId === activeRequestId){
                        incorrectId = activeRequestId.substring(0, activeRequestId.length-1)+"2";
                    }
                    done();
                });
        });

        it('it should fail to save a with an invalid id', function (done) {
            chai.request(server)
                .put('/v1/save/1')
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
                .put('/v1/save/' + incorrectId)
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
                .put('/v1/save/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({
                    files: [fileId],
                    supportingFiles: [fileId],
                    name: "testNameChanged",
                    tags: ["testChanged"],
                    purpose: "purposeChanged",
                    phoneNumber: "555-555-5554",
                    subPopulation: "sub-populationChanged",
                    variableDescriptions: "variable descriptions changed",
                    selectionCriteria: "selection criteria changed",
                    steps: "steps changed",
                    freq: "freq changed",
                    confidentiality: "none changed"
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
                .get('/v1/' + activeRequestId)
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
    });

    describe('/PUT /v1/submit/requestId', function() {

        it('it should submit a request', function (done) {
            chai.request(server)
                .put('/v1/submit/' + activeRequestId)
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

        it('it should fail to submit a request with an invalid id', function (done) {
            chai.request(server)
                .put('/v1/submit/1')
                .set("Authorization", "Bearer " + jwt)
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('it should fail to save a request that is in wrong state', function (done) {
            chai.request(server)
                .put('/v1/save/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('it should get (submitted) requests by date', function (done) {
            chai.request(server)
                .get('/v1?start_date=2000-01-01-01-01-01&end_date=9999-12-31-23-59-59')
                .set("Authorization", "Bearer " + jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        it('it should fail to submit a request without files', function (done) {
            chai.request(server)
                .post('/v1/')
                .set("Authorization", "Bearer " + jwt)
                .send({
                    name: "testNameX234",
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

                    let intermId = res.body.result._id;
                    
                    chai.request(server)
                        .put('/v1/save/' + activeRequestId)
                        .set("Authorization", "Bearer " + jwt)
                        .send({})
                        .end(function(e, r){

                            chai.request(server)
                                .put('/v1/submit/' + intermId)
                                .set("Authorization", "Bearer " + jwt)
                                .send({})
                                .end(function (err2, res2) {
                                    console.log("EXPECTED FAIL", r, res2.body);
                                    res2.should.have.status(403);
                                    res2.body.should.be.a('object');
                                    res2.body.should.have.property('error');
                                    done();
                            });
                    });
                });
        });
    });

    describe('/PUT /v1/pickup/requestId', function() {
        it('it should pickup a request', function (done) {
            chai.request(server)
                .put('/v1/pickup/' + activeRequestId)
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

    describe('/PUT /v1/approve/requestId', function() {

        it('it should approve a request', function (done) {
            chai.request(server)
                .put('/v1/approve/' + activeRequestId)
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

    describe('/PUT /v1/cancel/requestId', function() {
        it('it should create a request', function (done) {
            chai.request(server)
                .post('/v1/')
                .set("Authorization", "Bearer " + jwt)
                .send({
                    name: "testName3",
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
                .put('/v1/cancel/' + activeRequestId)
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

    describe('/PUT /v1/deny/requestId', function() {
        it('it should create a request', function (done) {
            chai.request(server)
                .post('/v1/')
                .set("Authorization", "Bearer " + jwt)
                .send({
                    name: "testName6",
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
                .put('/v1/save/' + activeRequestId)
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
        
        it('it should fail to submit an invalid request', function (done) {
            chai.request(server)
                .put('/v1/submit/' + incorrectId)
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('it should submit a request', function (done) {
            chai.request(server)
                .put('/v1/submit/' + activeRequestId)
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

        it('it should fail to submit an already submitted request', function (done) {
            chai.request(server)
                .put('/v1/submit/' + activeRequestId)
                .set("Authorization", "Bearer " + jwt)
                .send({})
                .end(function (err, res) {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('it should pickup a request', function (done) {
            chai.request(server)
                .put('/v1/pickup/' + activeRequestId)
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
                .put('/v1/deny/' + activeRequestId)
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
                .post('/v1/')
                .set("Authorization", "Bearer " + jwt)
                .send({
                    name: "testName6",
                    tags: ["test"],
                    phoneNumber: "555-555-5555",
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
                .put('/v1/save/' + activeRequestId)
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
                .put('/v1/submit/' + activeRequestId)
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
