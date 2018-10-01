const passport = require('passport');
const passJwt = require('passport-jwt');
const JWTStrategy = passJwt.Strategy;
const ExtractJWT = passJwt.ExtractJwt;
var config = require('config');
var logger = require('npmlog');


passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.get("jwtSecret"),
        passReqToCallback: true,
    }, function(req, jwtPayload, cb) {

        var encodedJWT = req.headers['authorization'].substring("Bearer ".length);
        var userConf = config.get('user');
        var user = {
            jwt: encodedJWT,
            email: jwtPayload.Email,
            firstName: jwtPayload.GivenName,
            lastName: jwtPayload.Surname,
            name: jwtPayload.GivenName + " " + jwtPayload.Surname,
            groups: jwtPayload.Groups,
            id: jwtPayload[userConf.idField]
        };
        logger.verbose('user ' + user.id + ' authenticated successfully');

        cb(null, user);
    }
));

module.exports = passport;