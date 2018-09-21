

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();

var config = require('config');
var jwt = config.get('testJWT');

var db = require('../../routes/v1/db/db');


chai.use(chaiHttp);

describe("Topics", function() {
    afterEach(function(done){
        db.Topic.deleteMany({}, function(err){
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
                    res.should.have.status(200);
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
                    done();
                });
        });

    });
});