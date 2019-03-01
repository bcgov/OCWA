var chai = require('chai');
var { expect, assert } = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();

const mongoose = require('mongoose');

var config = require('config');
var jwt = config.get('testJWT');

var db = require('../../routes/v1/db/db');

var collaborators = require('../../routes/v1/collaborators/collaborators')

chai.use(chaiHttp);

describe("Collaborators", function() {

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

    describe('Negative scenarios for collaborators', function () {
        var topicId = mongoose.Types.ObjectId();

        it('it should fail with error when subscribing to invalid topic', function (done) {
            collaborators.subscribe(topicId, "_user_", (err) => {
                expect(err).to.be.an('object').that.is.not.empty;
                assert.propertyVal(err, 'error', 'topic not found');
                done();
            });
        });

        it('it should fail with error when unsubscribing to invalid topic', function (done) {
            collaborators.unsubscribe(topicId, "_user_", (err) => {
                expect(err).to.be.an('object').that.is.not.empty;
                assert.propertyVal(err, 'error', 'topic not found');
                done();
            });
        });
    });
});
