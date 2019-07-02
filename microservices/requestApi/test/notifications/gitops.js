
process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var server = require('../../app');

var config = require('config');
var jwt = config.get('testJWT');

var db = require('../../routes/v1/db/db');

var logger = require('npmlog');

var gitops = require('../../notifications/gitops');

chai.use(chaiHttp);

describe("Gitlab Integration", function() {
    after(function(done){
        db.Request.deleteMany({}, function(err){
            done();
        });
    });    

    it('it should update request properly', function (done) {
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
            gitops
                .updateRequest(res.body.result, 'http://gitlab.link', 200, '')
                .then(() => {
                    chai.request(server)
                    .get('/v1/' + activeRequestId)
                    .set("Authorization", "Bearer " + jwt)
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.should.have.property('_id');
                        expect(res.body.mergeRequestStatus.code).to.equal(200);
                        expect(res.body.mergeRequestLink).to.equal('http://gitlab.link');
                        done();
                    });
                    done();
                });

        });        
    });

    it('it should succeed for the noop operation', function (done) {
        gitops.noop().then(() => {
            done();
        })
    });

    it('it should succeed with correct parsing empty chronology', function (done) {
        let request = {
            chronology: [
            ]
        }
        let transition = gitops.getTransition(request);
        expect(transition).to.equal("");
        done();
    });

    it('it should succeed with correct parsing for draft request', function (done) {
        let request = {
            chronology: [
                {
                    enteredState: 0
                }
            ]
        }
        let transition = gitops.getTransition(request);
        expect(transition).to.equal("-0");
        done();
    });

    it('it should succeed with correct parsing for wip request', function (done) {
        let request = {
            chronology: [
                {
                    enteredState: 0
                },
                {
                    enteredState: 1
                }
            ]
        }
        let transition = gitops.getTransition(request);
        expect(transition).to.equal("0-1");
        done();
    });

});
