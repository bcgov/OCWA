
const log = require('npmlog');

log.level = "verbose";
log.addLevel('debug', 2900, { fg: 'green' });

const request = require("request");
const sinon = require('sinon');
const { expect } = require('chai');

const projectConfig = require('../client/project_config_client');

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

});
