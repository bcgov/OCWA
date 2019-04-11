
const config = require("config");
const log = require('npmlog');
const request = require("request");
const sinon = require('sinon');
const { expect } = require('chai');

log.level = config.get('logLevel');

const projectConfig = require('../src/project_config_client');

describe('project_config_client', function () {

    var stub;

    before((done) => {
        stub = sinon.stub(request, 'get');
        done();
    });

    after ((done) => {
        request.get.restore()
        done()
    });

    it('should return results based on the default', function (done) {

        var body = {};

        stub.yields(null, {statusCode: 200}, body);

        const val = projectConfig.get("project1", "autoAccept")
        val.then((value) => {
            expect(value).is.eq(false);
            done();
        })
        
    });

    it('should return results based on the default because of no project', function (done) {

        var body = {};

        stub.yields(null, {statusCode: 404}, body);

        const val = projectConfig.get("project_not_exists", "autoAccept")
        val.then((value) => {
            expect(value).is.eq(false);
            done();
        })
        
    });

    it('should return results based on the project', function (done) {

        var body = {
            autoAccept: true
        };

        stub.yields(null, {statusCode: 200}, body);

        const val = projectConfig.get("project1", "autoAccept")
        val.then((value) => {
            expect(value).is.eq(true);
            done();
        })
        
    });

    it('should return expected project name from user', function (done) {

        const user = {
            groups: ["/oc", "project1"]
        }
        const project = projectConfig.deriveProjectFromUser(user);
        expect(project).is.eq("project1");
        done();
    });

    it('should return null because no valid project', function (done) {

        const user = {
            groups: ["/oc"]
        }
        const project = projectConfig.deriveProjectFromUser(user);
        expect(project).is.null;
        done();
    });    
});
