process.env.NODE_ENV = 'test';

const config = require('config');
const request = require('supertest');

describe("server", function() {
    beforeEach(() => {
        app = require('../app');
    });

    test('Auth', () => {
        return request(app).get("/auth/").then(response => {
            expect(response.statusCode).toBe(302)
        })
    });    
    
/*
    test('Auth Session with no jwtSecret (assume oidc) and authenticated', () => {
        config.override = {jwtSecret: ""}

        return request(app)
            .get("/auth/session")
            .set('Authorization', 'Bearer ' + token)
            .then(response => {
                expect(response.statusCode).toBe(200)
                expect('{"token":"abc"}')
            })
    });
    */

    test('Auth Session with no jwtSecret (assume oidc) and not authenticated', () => {
        config.override = {jwtSecret: ""}

        return request(app).get("/auth/session").then(response => {
            expect(response.statusCode).toBe(401)
        })
    });    

    test('Auth Session with jwtSecret and no claims', () => {
        return request(app).get("/auth/session").then(response => {
            expect(response.statusCode).toBe(401)
        })
    });    
/*
    test('Auth Session with jwtSecret and claims', () => {
        return request(app).get("/auth/session").then(response => {
            expect(response.statusCode).toBe(200)
            expect('{"token":"abc"}')
        })
    });    
*/

test('Auth Logout', () => {
    return request(app).get("/auth/logout").then(response => {
        expect(response.statusCode).toBe(302)
    })
});    

});
