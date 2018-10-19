const config = require('config');
const passport = require('passport');
const OpenIDConnectStrategy = require('passport-openidconnect');

passport.use(
  new OpenIDConnectStrategy(
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
      console.log(test);
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        username: jwtClaims.preferred_username,
        email: jwtClaims.email,
        accessToken,
        expires: jwtClaims.exp,
        authTime: jwtClaims.auth_time,
      };

      req.user = user;

      return verified(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

exports.checkAuth = (req, res, done) => {
  if (!req.user || !req.isAuthenticated || !req.isAuthenticated()) {
    res.redirect('/login');
  }

  done();
};
