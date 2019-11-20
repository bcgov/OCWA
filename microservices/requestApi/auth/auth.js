var auth = function(db){
    const passport = require('passport');
    const passJwt = require('passport-jwt');
    const JWTStrategy = passJwt.Strategy;
    const ExtractJWT = passJwt.ExtractJwt;
    var config = require('config');
    var logger = require('npmlog');

    const isOutputChecker = (user => user.groups.includes(config.get('outputCheckerGroup')))
    const isInReportsGroup = (user => user.groups.includes(config.get('reportsGroup')))
    const isInGroupToCreateRequest = (user => user.groups.includes(config.get('requiredRoleToCreateRequest')))

    passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("jwtSecret"),
            passReqToCallback: true,
        }, function(req, jwtPayload, cb) {
            try{
                var encodedJWT = req.headers['authorization'].substring("Bearer ".length);
                var userConf = config.get('user');
                var user = {
                    jwt: encodedJWT,
                    email: jwtPayload[userConf.emailField],
                    firstName: jwtPayload[userConf.givenNameField],
                    lastName: jwtPayload[userConf.surNameField],
                    name: jwtPayload[userConf.givenNameField] + " " + jwtPayload[userConf.surNameField],
                    groups: jwtPayload[userConf.groupField],
                    id: jwtPayload[userConf.idField],
                    zone: (jwtPayload.zone) ? jwtPayload.zone : "external",
                    EXTERNAL_ZONE: 'external',
                    INTERNAL_ZONE: 'internal',
                };

                user.getProject = function(){
                    var ocG = config.get('outputCheckerGroup');
                    var repG = config.get('reportsGroup');
                    var expG = config.get('requiredRoleToCreateRequest');

                    var project = null;

                    for (var i=0; i<this.groups.length; i++){
                        var group = this.groups[i];
                        if ( (group !== ocG) && (group !== repG) && (group !== expG) ){
                            project = group;
                            break;
                        }
                    }
                    return project;

                }
                user.outputchecker = isOutputChecker(user);
                user.supervisor = isInReportsGroup(user); // && !isInGroupToCreateRequest(user);

                logger.verbose('user ' + user.id + ' authenticated successfully ', user.groups, user.supervisor, user.outputchecker);

                // var getVersionedDb = require('../db/db');
                // var db = new getVersionedDb.db();
                db.User.findOneAndUpdate({id: user.id}, user, {upsert: true, setDefaultsOnInsert: true, new: true}, function(err, userDoc){
                    if (err || !userDoc){
                        logger.error("Error upserting user:", err);
                        return;
                    }
                    logger.debug("User upserted successfully");
                });
                cb(null, user);
            } catch (e) {
                logger.error(e);
                raise(e);
            }

        }
    ));
    
    return passport;
};

module.exports = auth;
