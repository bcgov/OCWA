const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const should = chai.should();

const config = require('config');
const jwt = config.get('testJWT');

const db = require('../../routes/v1/db/db');


chai.use(chaiHttp);



describe("Admin", function() {

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

        it('it should get all records (currently 0)', function (done) {
            chai.request(server)
                .get('/v1/admin/list/project')
                .set("Authorization", "Bearer "+jwt)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST v1/admin/project/create', function () {
        it('it should deny access', function (done) {
            chai.request(server)
                .post('/v1/admin/project/create')
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });

        it('it should successfully create a new project', function (done) {
            chai.request(server)
                .post('/v1/admin/project/create')
                .set("Authorization", "Bearer " + jwt)
                .send({
                    'name': "project1",
                    'permissions': {
                        'autoAccept': true
                    }
                })                
                .end(function (err, res) {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Project project1 successfully created');
                    done();
                });
        });
    });

    describe('/GET v1/admin/list/permission/autoAccept', function () {

        it('it should return the newly created project', function (done) {
            const project = new db.Project({"name":"project1","permissions":{"autoAccept": true}});
            project.save(function(err){
                expect(err).to.be.null;

                chai.request(server)
                    .get('/v1/admin/list/permission/autoAccept')
                    .set("Authorization", "Bearer " + jwt)              
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.length.should.be.eql(1);
                        expect(res.body).to.eql(["project1"]);
                        done();
                    });
                });
        });

    });

    describe('/PUT v1/admin/project/:projectName/permission', function () {

        it('it should update project permissions', function (done) {
            const project = new db.Project({"name":"project1","permissions":{"autoAccept": true}});
            project.save(function(err){
                expect(err).to.be.null;

                chai.request(server)
                    .put('/v1/admin/project/project1/permission')
                    .set("Authorization", "Bearer " + jwt)       
                    .send({
                        "autoAccept": false
                    })       
                    .end(function (err, res) {
                        res.should.have.status(202);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Permissions for project project1 updated');

                        db.Project.findOne({ name: "project1" }, 'permissions -_id', function(err, result) {
                            expect(err).to.be.null;
                            result.should.be.a('object');
                            result.should.have.property('permissions').eql({"autoAccept":false});
                            done();
                        });
                    });
                });
        });

    });

    describe('/DELETE v1/admin/project/:projectName', function () {

        it('it should delete all project settings', function (done) {
            const project = new db.Project({"name":"project1","permissions":{"autoAccept": true}});
            project.save(function(err){
                expect(err).to.be.null;

                chai.request(server)
                    .delete('/v1/admin/project/project1')
                    .set("Authorization", "Bearer " + jwt)       
                    .end(function (err, res) {
                        res.should.have.status(202);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Project project1 deleted');

                        db.Project.find({ name: "project1" }, 'permissions -_id', function(err, result) {
                            expect(err).to.be.null;
                            result.length.should.be.eql(0);
                            done();
                        });
                    });
                });
        });

    });

    describe('/DELETE v1/admin/project/:projectName/permission/:permission', function () {

        it('it should throw an error if the permission is not set for project', function (done) {
            const project = new db.Project({"name":"project1","permissions":{"autoAccept": true}});
            project.save(function(err){
                expect(err).to.be.null;

                chai.request(server)
                    .delete('/v1/admin/project/project1/permission/specialPermission')
                    .set("Authorization", "Bearer " + jwt)       
                    .end(function (err, res) {
                        res.should.have.status(404);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Project project1 or permission specialPermission not found');
                        done();
                    });
                });
        });

        it('it should delete a particular permission for a project', function (done) {
            const project = new db.Project({"name":"project1","permissions":{"autoAccept": true}});
            project.save(function(err){
                expect(err).to.be.null;

                chai.request(server)
                    .delete('/v1/admin/project/project1/permission/autoAccept')
                    .set("Authorization", "Bearer " + jwt)       
                    .end(function (err, res) {
                        res.should.have.status(202);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Permission autoAccept from project project1 deleted');

                        db.Project.findOne({ name: "project1" }, 'permissions -_id', function(err, result) {
                            expect(err).to.be.null;
                            result.should.be.a('object');
                            result.should.have.property('permissions').eql({});
                            done();
                        });
                    });
                });
        });

    });

});
