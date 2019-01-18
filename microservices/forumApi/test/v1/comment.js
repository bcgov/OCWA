var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();

var config = require('config');
var jwt = config.get('testJWT');

var db = require('../../routes/v1/db/db');


chai.use(chaiHttp);

describe("Comments", function() {

    var topic = null;
    var perm = null;

    before(function(done){
        var p = new db.Permission();
        p.priority = 1;
        p.group_ids = ["*"];
        p.allow = true;
        p.topic_id = "*";
        p.save(function(e, r) {
            perm = r;
            var t = new db.Topic();
            t.name = "Comment Test Topic";
            t.save(function (err, result) {
                topic = result;
                done();
            });
        });
    });

    after(function(done){
        db.Permission.deleteMany({_id: perm._id}, function(e) {
            db.Topic.deleteOne({_id: topic._id}, function (err) {
                done();
            });
        });
    });

    afterEach(function(done){
        db.Comment.deleteMany({}, function(err){
            done();
        });
    });

    describe('/GET v1/comment/', function () {
        it('it should get unauthorized', function (done) {
            chai.request(server)
                .get('/v1/comment/'+topic._id)
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });

        it('it should get all records (max 100) (currently 0)', function (done) {
            chai.request(server)
                .get('/v1/comment/' + topic._id)
                .set("Authorization", "Bearer " + jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST v1/comment', function () {
        it('it should get unauthorized', function (done) {
            chai.request(server)
                .post('/v1/comment/'+topic._id)
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });

        it('it should fail without a comment', function (done) {
            chai.request(server)
                .post('/v1/comment/'+topic._id)
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
                .post('/v1/comment/'+topic._id)
                .set("Authorization", "Bearer "+jwt)
                .send({
                    'comment': "Test Comment"
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