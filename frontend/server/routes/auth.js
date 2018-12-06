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

const router = express.Router();

router.get(
  '/',
  passport.authenticate('openidconnect', { failureRedirect: '/' }),
  (req, res) => {
    const jwtSecret = config.get('jwtSecret');
    const jwtClaims = get(req, 'user.claims');

    if (jwtClaims) {
      // Passport/KeyCloak doesn't sign the token correctly, sign here
      req.user.accessToken = jwt.sign(jwtClaims, jwtSecret);
    }
    res.redirect('/');
  }
);

// Return the session token
router.get('/session', (req, res) => {
  const jwtSecret = config.get('jwtSecret');
  let token = null;

  // If there is no jwtSecret defined go with OCID only
  if (isEmpty(jwtSecret)) {
    if (req.isAuthenticated()) {
      token = req.user.accessToken;
    }
  } else {
    token = get(req, 'user.accessToken');
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
      console.log('claims exp', claims.exp);
      console.log('refresh', token);

      // Update the session under the hood so refreshes work.
      if (has(req, 'session.passport.user')) {
        req.session.passport.user = merge(
          {},
          req.session.passport.user,
          claims,
          {
            accessToken: token,
            refreshToken: json.refresh_token,
          }
        );
        req.session.save(err => {
          if (err) {
            console.log('error!');
          } else {
            console.log('success');
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
