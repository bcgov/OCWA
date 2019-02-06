const config = require('config');
const express = require('express');
const get = require('lodash/get');
const has = require('lodash/has');
const isEmpty = require('lodash/isEmpty');
const jwt = require('jsonwebtoken');
const merge = require('lodash/merge');
const passport = require('passport');
const pick = require('lodash/pick');
const request = require('request');
const addMonths = require('date-fns/add_months');

const router = express.Router();

// Test token generator
function generateTestSession(req) {
  const group = config.get('testGroup');
  const testToken = config.get(`testJWT:${group.replace('/', '')}`); // groups contain slashes
  const user = jwt.decode(testToken);
  const expiresAt = addMonths(new Date(), 1);

  req.user = user;

  return {
    token: testToken,
    expiresAt,
    user,
  };
}

router.get(
  '/',
  passport.authenticate('openidconnect', { failureRedirect: '/' }),
  (req, res) => {
    // Clean up the token on first successful sign in
    const jwtSecret = config.get('jwtSecret');
    const jwtClaims = get(req, 'user.claims');
    const { redirectTo } = req.session;

    if (redirectTo) {
      delete req.session.redirectTo;
    }

    if (jwtClaims) {
      // Passport/KeyCloak doesn't sign the token correctly, sign here
      req.user.accessToken = jwt.sign(jwtClaims, jwtSecret);
    }

    res.redirect(redirectTo || '/');
  }
);

// Return the session token
router.get('/session', (req, res, done) => {
  const jwtSecret = config.get('jwtSecret');
  let token = null;

  if (process.env.NODE_ENV === 'development' && config.has('testGroup')) {
    const session = generateTestSession(req);
    return res.json(session);
  }

  // If there is no jwtSecret defined go with OCID only
  if (isEmpty(jwtSecret)) {
    if (req.isAuthenticated()) {
      token = req.user.accessToken;
    }
  } else {
    token = get(req, 'user.accessToken');
  }

  if (token) {
    jwt.verify(token, jwtSecret, (err, claims) => {
      if (err) {
        res.status(401).end();
      }

      const userFields = pick(req.user, [
        'displayName',
        'username',
        'id',
        'email',
        'groups',
      ]);

      return res.json({
        token,
        refreshToken: req.user.refreshToken,
        expiresAt: new Date(claims.exp * 1000),
        user: userFields,
      });
    });
  } else {
    res.status(401).end();
  }
});

router.post('/refresh', (req, res) => {
  const jwtSecret = config.get('jwtSecret');
  const tokenURL = config.get('auth.tokenEndpoint');
  const clientID = config.get('auth.clientID');
  const clientSecret = config.get('auth.clientSecret');
  const form = {
    client_id: clientID,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token: req.body.refreshToken,
  };

  request.post(
    tokenURL,
    {
      form,
    },
    (err, response, body) => {
      if (err) {
        res.status(401).end();
      }
      const json = JSON.parse(body);
      const claims = jwt.decode(json.id_token);
      const token = jwt.sign(claims, jwtSecret);

      // Update the session under the hood so refreshes work.
      if (has(req, 'session.passport.user')) {
        const currentUser = req.session.passport.user;

        // Update the passport session manually
        req.session.passport.user = merge({}, currentUser, claims, {
          expires: claims.exp,
          accessToken: token,
          refreshToken: json.refresh_token,
        });

        // Persist the session on refresh
        req.session.save(e => {
          if (e) {
            res.status(401).end();
          }
        });
      }

      res.json({
        token,
        refreshToken: json.refresh_token,
        expiresAt: new Date(claims.exp * 1000),
      });
    }
  );
});

router.get('/logout', (req, res) => {
  req.logout();
  req.user = null;
  res.redirect('/');
});

module.exports = router;
