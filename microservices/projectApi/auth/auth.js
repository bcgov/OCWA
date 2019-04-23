const passport = require('passport');
const passJwt = require('passport-jwt');
const passApiKey = require('passport-headerapikey');
const JWTStrategy = passJwt.Strategy;
const HeaderAPIKeyStrategy = passApiKey.HeaderAPIKeyStrategy;
const ExtractJWT = passJwt.ExtractJwt;
const config = require('config');
const logger = require('npmlog');

passport.use(new HeaderAPIKeyStrategy(
    { header: 'Authorization', prefix: 'Api-Key ' },
    false,
    function(apiKey, cb) {
        if (config.get("apiKey") == apiKey) {
            const user = {
                "groups": [config.get("adminGroup")]
            }
            return cb(null, user);
        } else {
            return cb(null, false);
        }
    }
));


passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get("jwtSecret"),
    passReqToCallback: true,
}, function(req, jwtPayload, cb) {
    if (req.headers['authorization'].indexOf("Bearer") == -1) {
        return cb(null, false);
    }
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