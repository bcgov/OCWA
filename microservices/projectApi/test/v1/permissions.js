const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const should = chai.should();

const config = require('config');
const jwt = config.get('testJWT');

const db = require('../../routes/v1/db/db');


chai.use(chaiHttp);

describe("Permissions", function() {

});
