const config = require('config');
const get = require('lodash/get');
const passport = require('passport');
const OpenIDConnectStrategy = require('passport-openidconnect');

const idField = config.get('user.idField');
const strategy = new OpenIDConnectStrategy(
  {
    issuer: config.get('auth.issuer'),
    authorizationURL: config.get('auth.authorizationEndpoint'),
    tokenURL: config.get('auth.tokenEndpoint'),
    clientID: config.get('auth.clientID'),
    callbackURL: config.get('auth.callbackURL'),
    clientSecret: config.get('auth.clientSecret'),
    userInfoURL: config.get('auth.userInfoURL'),
    passReqToCallback: true,
    scope: config.get('auth.scope'),
  },
  (
    req,
    iss,
    sub,
    profile,
    jwtClaims,
    accessToken,
    refreshToken,
    params,
    verified
  ) => {
    const user = {
      id: get(jwtClaims, idField),
      displayName: profile.displayName,
      username: jwtClaims.preferred_username,
      email: jwtClaims.email,
      groups: jwtClaims.groups,
      accessToken,
      refreshToken,
      expires: jwtClaims.exp,
      authTime: jwtClaims.auth_time,
      claims: jwtClaims,
    };

    req.user = user;

    return verified(null, user);
  }
);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

exports.checkAuth = (req, res, done) => {
  if (!req.user || !req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect('/login');
  }

  done();
};
