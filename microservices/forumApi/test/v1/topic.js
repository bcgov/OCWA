

var chai = require('chai');
var { expect } = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();

var config = require('config');
var jwt = config.get('testJWT');

var db = require('../../routes/v1/db/db');


chai.use(chaiHttp);

describe("Topics", function() {

    var permId;

    before(function(done){
        var p = new db.Permission();
        p.priority = 1;
        p.group_ids = ["*"];
        p.allow = true;
        p.topic_id = "*";
        p.save(function(e, r) {
            permId = r._id;
            done();
        });
    });

    after(function(done){
        db.Permission.deleteMany({_id: permId}, function(e) {
            db.Topic.deleteMany({}, function(e2) {done();});
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

        it('it should fail without a topic name', function (done) {
            chai.request(server)
                .post('/v1/')
                .set("Authorization", "Bearer "+jwt)
                .send({})
                .end(function (err, res) {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.be.a('object');
                    done();
                });
        });

        it('it should create a record', function (done) {
            chai.request(server)
                .post('/v1/')
                .set("Authorization", "Bearer "+jwt)
                .send({
                    'name': "Test Topic"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Successfully written');
                    db.Topic.deleteMany({_id: res.body._id}, function(err){
                       done();
                    });
                });
        });

        it('it should get a subtopic error', function (done) {
            chai.request(server)
                .post('/v1/')
                .set("Authorization", "Bearer "+jwt)
                .send({
                    'name': "Test TopicwSub"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    var parent = res.body._id;

                    chai.request(server)
                        .post('/v1/')
                        .set("Authorization", "Bearer "+jwt)
                        .send({
                            'name': "Test Subtopic",
                            'parent_id': parent
                        })
                        .end(function (err2, res2) {
                            res2.should.have.status(200);
                            res2.body.should.be.a('object');
                            res2.body.should.have.property('_id');
                            var nestedParent = res2.body._id;
                            chai.request(server)
                                .post('/v1/')
                                .set("Authorization", "Bearer "+jwt)
                                .send({
                                    'name': "Test Subtopic fail",
                                    'parent_id': nestedParent
                                })
                                .end(function (err3, res3) {
                                    res3.should.have.status(400);
                                    res3.body.should.be.a('object');
                                    res3.body.should.have.property('error').eql('Currently the api only supports nesting 1 topic level');

                                    db.Topic.deleteMany({_id: nestedParent}, function(err) {
                                        db.Topic.deleteMany({_id: parent}, function(err) {
                                            done();
                                        });
                                    });

                                });
                        });
                });
        });

        
    });

    describe('/PUT v1/:topic/subscribe', function () {

        it('it should successfully add the user to contributors', function (done) {
            chai.request(server)
            .post('/v1/')
            .set("Authorization", "Bearer "+jwt)
            .send({
                'name': "Test Subscriber Topic 1a"
            })
            .end(function (err, res) {
                res.should.have.status(200);

                chai.request(server)
                .put('/v1/' + res.body._id + "/subscribe")
                .set("Authorization", "Bearer "+jwt)
                .send({
                    'user_id': "testuser"
                })
                .end(function (err, ures) {
                    ures.should.have.status(200);
                    ures.body.should.be.a('object');
                    ures.body.should.have.property('message').eql('Topic subscriptions ok');
                    done();
                });
            });
        });

        it('it should successfully respond despite user already subscribed', function (done) {
            chai.request(server)
                .post('/v1/')
                .set("Authorization", "Bearer "+jwt)
                .send({
                    'name': "Test Subscriber Topic 1b"
                })
                .end(function (err, res) {
                    res.should.have.status(200);

                    chai.request(server)
                    .put('/v1/' + res.body._id + "/subscribe")
                    .set("Authorization", "Bearer "+jwt)
                    .send({
                        'user_id': "jrocket@example.com"
                    })
                    .end(function (err, ures) {
                        ures.should.have.status(200);
                        ures.body.should.be.a('object');
                        ures.body.should.have.property('message').eql('Topic subscriptions ok');
                        done();
                    });
                });
        });

        it('it should successfully fail due to invalid topic', function (done) {
            chai.request(server)
            .put('/v1/' + "_bad_topic_id_" + "/subscribe")
            .set("Authorization", "Bearer "+jwt)
            .send({
                'user_id': "jrocket@example.com"
            })
            .end(function (err, ures) {
                ures.should.have.status(500);
                expect(ures.body).to.be.an('object').that.is.empty;
                done();
            });
        });

    });

    describe('/PUT v1/:topic/unsubscribe', function () {

        it('it should successfully remove the user from contributors', function (done) {
            chai.request(server)
                .post('/v1/')
                .set("Authorization", "Bearer "+jwt)
                .send({
                    'name': "Test Subscriber Topic 2"
                })
                .end(function (err, res) {
                    res.should.have.status(200);

                    chai.request(server)
                    .put('/v1/' + res.body._id + "/subscribe")
                    .set("Authorization", "Bearer "+jwt)
                    .send({
                        'user_id': "testuser"
                    })
                    .end(function (err, _ignore) {

                        chai.request(server)
                        .put('/v1/' + res.body._id + "/unsubscribe")
                        .set("Authorization", "Bearer "+jwt)
                        .send({
                            'user_id': "testuser"
                        })
                        .end(function (err, ures) {
                            ures.should.have.status(200);
                            ures.body.should.be.a('object');
                            ures.body.should.have.property('message').eql('Topic subscriptions ok');
                            done();
                        });
                    })
                });
        });

        it('it should successfully respond despite not having the user', function (done) {
            chai.request(server)
                .post('/v1/')
                .set("Authorization", "Bearer "+jwt)
                .send({
                    'name': "Test Subscriber Topic 3"
                })
                .end(function (err, res) {
                    res.should.have.status(200);

                    chai.request(server)
                    .put('/v1/' + res.body._id + "/unsubscribe")
                    .set("Authorization", "Bearer "+jwt)
                    .send({
                        'user_id': "some_user_that_does_not_exist"
                    })
                    .end(function (err, ures) {
                        ures.should.have.status(200);
                        ures.body.should.be.a('object');
                        ures.body.should.have.property('message').eql('Topic subscriptions ok');
                        done();
                    });
                });
        });

        it('it should successfully fail due to invalid topic', function (done) {
            chai.request(server)
            .put('/v1/' + "_bad_topic_id_" + "/unsubscribe")
            .set("Authorization", "Bearer "+jwt)
            .send({
                'user_id': "jrocket@example.com"
            })
            .end(function (err, ures) {
                ures.should.have.status(500);
                expect(ures.body).to.be.an('object').that.is.empty;
                done();
            });
        });

    });

});