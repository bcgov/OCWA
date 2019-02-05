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
            email: jwtPayload[userConf.emailField],
            firstName: jwtPayload[userConf.givenNameField],
            lastName: jwtPayload[userConf.surNameField],
            name: jwtPayload[userConf.givenNameField] + " " + jwtPayload[userConf.surNameField],
            groups: jwtPayload[userConf.groupField],
            id: jwtPayload[userConf.idField]
        };

        var db = require('../db/db');
        db.User.findOneAndUpdate({id: user.id}, user, {upsert: true, setDefaultsOnInsert: true, new: true}, function(err, userDoc){
            if (err || !userDoc){
                logger.error("Error upserting user:", err);
                return;
            }
            logger.debug("User upserted successfully");
        });

        cb(null, user);
    }
));

module.exports = passport;