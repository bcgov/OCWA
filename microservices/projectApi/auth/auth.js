const passport = require('passport');
const passJwt = require('passport-jwt');
const JWTStrategy = passJwt.Strategy;
const ExtractJWT = passJwt.ExtractJwt;
const config = require('config');
const logger = require('npmlog');

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get("jwtSecret"),
    passReqToCallback: true,
}, function (req, jwtPayload, cb) {
    const encodedJWT = req.headers['authorization'].substring("Bearer ".length);
    const userConf = config.get('user');
    const user = {
        jwt: encodedJWT,
        email: jwtPayload[userConf.emailField],
        firstName: jwtPayload[userConf.givenNameField],
        lastName: jwtPayload[userConf.surNameField],
        name: jwtPayload[userConf.givenNameField] + " " + jwtPayload[userConf.surNameField],
        groups: jwtPayload[userConf.groupField],
        id: jwtPayload[userConf.idField]
    };
    logger.verbose('user ' + user.id + ' authenticated successfully');

    cb(null, user);
}));

module.exports = passport;