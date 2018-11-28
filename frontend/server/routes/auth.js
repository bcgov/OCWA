const config = require('config');
const express = require('express');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const pick = require('lodash/pick');
const request = require('request');

const router = express.Router();

router.get(
  '/',
  passport.authenticate('openidconnect', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Return the session token
router.get('/session', (req, res) => {
  const jwtSecret = config.get('jwtSecret');
  let token = null;

  // If there is now jwtSecret defined go with OCID only
  if (isEmpty(jwtSecret)) {
    if (req.isAuthenticated()) {
      token = req.user.accessToken;
    }
  } else {
    // Passport/KeyCloak doesn't sign the token correctly, sign here
    const jwtClaims = get(req, 'user.claims');

    if (jwtClaims) {
      token = jwt.sign(jwtClaims, jwtSecret);
    }
  }

  if (token) {
    const userFields = pick(req.user, [
      'displayName',
      'username',
      'id',
      'email',
    ]);
    res.json({
      token,
      refreshToken: req.user.refreshToken,
      expiresAt: new Date(req.user.expires * 1000),
      user: userFields,
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

  request.post(
    tokenURL,
    {
      form: {
        client_id: clientID,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: req.body.refreshToken,
      },
    },
    (err, response, body) => {
      if (err) {
        res.status(401).end();
      }
      const json = JSON.parse(body);
      const claims = jwt.decode(json.id_token);
      const token = jwt.sign(claims, jwtSecret);

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
