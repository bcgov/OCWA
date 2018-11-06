process.env.NODE_ENV = 'test';

const config = require('config');
const request = require('supertest');

describe("server", function() {
    beforeEach(() => {
        app = require('../app');
    });

    test('It should get a simple response for the GET method', () => {
        return request(app).get("/hello").then(response => {
            expect(response.statusCode).toBe(200)
            expect("hi")
        })
    });    
});
