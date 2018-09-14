const passport = require('passport');
const passJwt = require('passport-jwt');
const JWTStrategy = passJwt.Strategy;
const ExtractJWT = passJwt.ExtractJwt;
var config = require('config');
var logger = require('npmlog');

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.get("jwtSecret")
    }, function(jwtPayload, cb) {
        logger.debug('in jwt strategy');
        var userConf = config.get('user');
        var user = {
            jwt: jwtPayload,
            email: jwtPayload.Email,
            firstName: jwtPayload.GivenName,
            lastName: jwtPayload.Surname,
            name: jwtPayload.GivenName + " " + jwtPayload.Surname,
            groups: jwtPayload.Groups,
            id: jwtPayload[userConf.idField]
        };

        cb(null, user);
    }
));

module.exports = passport;