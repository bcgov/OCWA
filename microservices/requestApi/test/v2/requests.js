

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
var expect = chai.expect;

var config = require('config');
var jwt = config.get('testJWT');

var db = require('../../routes/v2/db/db');

var logger = require('npmlog');

chai.use(chaiHttp);

describe("Requests", function() {
    var activeRequestId = '';
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

        it('it should get all records (max 100) (currently 0)', function (done) {
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
                    console.log("create request response", err, res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('_id');
                    activeRequestId = res.body.result._id;
                    done();
                });
        });

    });

    describe('/GET  v2 & v2/requestId', function () {
        it('it should get requests', function (done) {
            chai.request(server)
                .get('/v2')
                .set("Authorization", "Bearer " + jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(2);
                    done();
                });
        });

        it('it should get supervisor requests from internal', function (done) {
            chai.request(server)
                .get('/v2')
                .set("Authorization", "Bearer " + config.get('testSupervisorInternalJWT'))
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(2);
                    done();
                });
        });

        it('it should get supervisor requests from external', function (done) {
            chai.request(server)
                .get('/v2')
                .set("Authorization", "Bearer " + config.get('testSupervisorExternalJWT'))
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(2);
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
    });

    describe('/PUT /v2/submit/requestId', function() {

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
