

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();

var config = require('config');
var jwt = config.get('testJWT');

var db = require('../../routes/v1/db/db');


chai.use(chaiHttp);

describe("Requests", function() {
    var activeRequestId = '';
    after(function(done){
        db.Request.deleteMany({}, function(err){
            done();
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
                    variableDescriptions: "variable descriptions",
                    selectionCriteria: "selection criteria",
                    steps: "steps",
                    freq: "freq",
                    confidentiality: "none"
                })
                .end(function (err, res) {
                    try {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                        res.body.should.have.property('result');
                        res.body.result.should.have.property('_id');
                        activeRequestId = res.body.result._id;
                    } catch (ex) {
                        console.log(res.body);
                        throw(ex);
                    }
                    done();
                });
        });
    });

    describe('/GET  v1 & v1/requestId', function () {
        it('it should get a request', function (done) {
            chai.request(server)
                .get('/v1')
                .set("Authorization", "Bearer " + jwt)
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
                    res.body.length.should.be.eql(1);
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
    })

    describe('/PUT /v1/save/requestId', function() {

        it('it should create a request', function (done) {
            chai.request(server)
                .post('/v1/')
                .set("Authorization", "Bearer " + jwt)
                .send({
                    name: "testName",
                    tags: ["test"],
                    purpose: "purpose",
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
                .send({})
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
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
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
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
                    name: "testName",
                    tags: ["test"],
                    purpose: "purpose",
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
});