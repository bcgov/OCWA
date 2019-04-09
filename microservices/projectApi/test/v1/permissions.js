const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const should = chai.should();

const config = require('config');
const jwt = config.get('testJWT');

const db = require('../../routes/v1/db/db');


chai.use(chaiHttp);

describe("Permissions", function() {
    beforeEach(function(done){
        var projectX = new db.Project({"name":"projectX", "permissions": { "autoAccept": false} });
        var projectY = new db.Project({"name":"projectY", "permissions": { "language": "fr"} });
        var projectZ = new db.Project({"name":"projectZ", "permissions": { "autoAccept": true} });

        projectX.save(() => {
            projectY.save(() => {
                projectZ.save(() => {
                    done();
                });
            })
        });
    });

    afterEach(function(done){
        db.Project.deleteMany({}, function(err){
            done();
        });
    });

    describe('/GET v1/permissions/list', function () {
        it('it should deny access', function (done) {
            chai.request(server)
                .get('/v1/permissions/list')
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });

        it('it should list all configured permissions', function (done) {
            chai.request(server)
                .get('/v1/permissions/list')
                .set("Authorization", "Bearer "+jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(2);
                    expect(res.body).to.eql(["autoAccept", "language"]);
                    done();
                });
        });
    });

    describe('/GET v1/permissions/:project', function () {
        it('it should deny access', function (done) {
            chai.request(server)
                .get('/v1/permissions/projectX')
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });

        it('it should get all permissions for projectY', function (done) {
            chai.request(server)
                .get('/v1/permissions/projectY')
                .set("Authorization", "Bearer "+jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('language').eql('fr');
                    done();
                });
        });
    });

});
