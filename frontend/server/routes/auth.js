const config = require('config');
const express = require('express');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const jwt = require('jsonwebtoken');
const mapKeys = require('lodash/mapKeys');
const passport = require('passport');

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
    // Passport/KeyCloak doesn't sign the token correctly so some fixing is needed.
    const jwtClaims = get(req, 'user.claims');
    if (jwtClaims) {
      // Create a normalized JWT that works with the microservices auth.
      // It needs an `Email` and `Groups` property.
      const data = {
        ...jwtClaims,
        Email: jwtClaims.email,
        Groups: [],
      };
      delete data.email;

      token = jwt.sign(data, jwtSecret);
    }
  }

  if (token) {
    res.json({
      token,
    });
  } else {
    res.status(401).end();
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  req.user = null;
  res.redirect('/');
});

module.exports = router;
