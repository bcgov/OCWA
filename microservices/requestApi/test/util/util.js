var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var util = require('../../util/util');

describe("Utils", function() {

    describe('FileStatus', function () {
        it('it should chunk with 3 items', function (done) {
            var inArray = ["1","2","3"]
            var result = util.chunkArray(inArray, 25)
            result.length.should.be.eql(1);
            result[0].length.should.be.eql(3);
            done();
        });
        
        it('it should chunk with 30 items', function (done) {
            var inArray = ["1","2","3","4","5","6","7","8","9","10", "1","2","3","4","5","6","7","8","9","10", "1","2","3","4","5","6","7","8","9","10"]
            var result = util.chunkArray(inArray, 25)
            result.length.should.be.eql(2);
            result[0].length.should.be.eql(25);
            result[1].length.should.be.eql(5);
            done();
        });
    });

})