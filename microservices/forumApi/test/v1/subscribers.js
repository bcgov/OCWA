var chai = require('chai');
var { expect, assert } = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();

const mongoose = require('mongoose');

var config = require('config');
var jwt = config.get('testJWT');

var db = require('../../routes/v1/db/db');

var subscribers = require('../../routes/v1/subscribers/subscribers')

chai.use(chaiHttp);

describe("Subscribers", function() {

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

    describe('Negative scenarios for subscribers', function () {
        var topicId = mongoose.Types.ObjectId();

        it('it should fail with error when subscribing to invalid topic', function (done) {
            subscribers.subscribe(topicId, "_user_", true, (err) => {
                expect(err).to.be.an('object').that.is.not.empty;
                assert.propertyVal(err, 'error', 'topic not found');
                done();
            });
        });

        it('it should fail with error when unsubscribing to invalid topic', function (done) {
            subscribers.unsubscribe(topicId, "_user_", (err) => {
                expect(err).to.be.an('object').that.is.not.empty;
                assert.propertyVal(err, 'error', 'topic not found');
                done();
            });
        });
    });

    describe('Scenarios contributing subscribers', function () {

        it('it should succeed with subscriber being a contributor as well', function (done) {
            chai.request(server)
            .post('/v1/')
            .set("Authorization", "Bearer "+jwt)
            .send({
                'name': "Test Subscriber_1 Topic"
            })
            .end(function (err, res) {
                res.should.have.status(200);

                const topicId = res.body._id;

                subscribers.subscribe(topicId, "_user_", true, (err) => {
                    expect(err).to.be.null;
                    done();
                });
            });
        });

        it('it should succeed with subscriber not being a contributor', function (done) {
            chai.request(server)
            .post('/v1/')
            .set("Authorization", "Bearer "+jwt)
            .send({
                'name': "Test Subscriber_2 Topic"
            })
            .end(function (err, res) {
                res.should.have.status(200);

                const topicId = res.body._id;

                subscribers.subscribe(topicId, "_user_", false, (err) => {
                    expect(err).to.be.null;
                    done();
                });
            });
        });

    });
});
