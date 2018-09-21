var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();

var config = require('config');
var jwt = config.get('testJWT');

var db = require('../../routes/v1/db/db');


chai.use(chaiHttp);

describe("Permisisons", function() {
    afterEach(function(done){
        db.Permission.deleteMany({}, function(err){
            done();
        });
    });

    describe('/GET v1/permission', function () {

        it('it should get all records (currently 0)', function (done) {
            chai.request(server)
                .get('/v1/permission')
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
                .send({
                    'priority': 9000,
                    'allow': true,
                    'topic_id': "*",
                    "group_ids": "*"
                })
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });

        it('it should create a record', function (done) {
            chai.request(server)
                .post('/v1/permission')
                .set("Authorization", "Bearer "+jwt)
                .send({
                    'priority': 9000,
                    'allow': true,
                    'topic_id': "*",
                    "group_ids": "*"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Successfully written');
                    done();
                });
        });

        it('it should fail without priority', function (done) {
            chai.request(server)
                .post('/v1/permission')
                .set("Authorization", "Bearer "+jwt)
                .send({
                    'allow': true,
                    'topic_id': "*",
                    "group_ids": "*"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.be.a('string');
                    done();
                });
        });

        it('it should fail with neither comment or topic defined', function (done) {
            chai.request(server)
                .post('/v1/permission')
                .set("Authorization", "Bearer "+jwt)
                .send({
                    'priority': 9000,
                    'allow': true,
                    "group_ids": "*"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.be.a('string');
                    done();
                });
        });

        it('it should fail with both comment and topic defined', function (done) {
            chai.request(server)
                .post('/v1/permission')
                .set("Authorization", "Bearer "+jwt)
                .send({
                    'priority': 9000,
                    'allow': true,
                    'topic_id': "*",
                    'comment_id': "*",
                    "group_ids": "*"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.be.a('string');
                    done();
                });
        });

        it('it should fail with neither group nor user defined', function (done) {
            chai.request(server)
                .post('/v1/permission')
                .set("Authorization", "Bearer "+jwt)
                .send({
                    'priority': 9000,
                    'allow': true,
                    'topic_id': "*"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.be.a('string');
                    done();
                });
        });

        it('it should fail with both group and user defined', function (done) {
            chai.request(server)
                .post('/v1/permission')
                .set("Authorization", "Bearer "+jwt)
                .send({
                    'priority': 9000,
                    'allow': true,
                    'topic_id': "*",
                    "group_ids": "*",
                    "user_ids": "*"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.be.a('string');
                    done();
                });
        });

    });
});