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
const exporterGroup = config.get('exporterGroup');
const ocGroup = config.get('ocGroup');

// Derive a token from a request
function getToken(req, jwtSecret) {
  let token = null;

  // If there is no jwtSecret defined go with OCID only
  if (isEmpty(jwtSecret)) {
    if (req.isAuthenticated()) {
      token = req.user.accessToken;
    }
  } else {
    token = get(req, 'user.accessToken');
  }

  return token;
}

// Only pass through required groups and the one selected by a user at login
const groupFilter = (groups, validGroups) =>
  groups.filter(g => validGroups.includes(g));

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

router.get('/groups', (req, res) => {
  const jwtSecret = config.get('jwtSecret');
  const token = getToken(req, jwtSecret);

  if (token) {
    jwt.verify(token, jwtSecret, err => {
      if (err) {
        res.status(401).end();
      }

      const groups = get(req, 'user.groups', []).filter(
        group => group !== exporterGroup
      );

      return res.json({
        groups,
      });
    });
  } else {
    res.status(401).end();
  }
});

// Return the session token
router.get('/session', (req, res) => {
  const jwtSecret = config.get('jwtSecret');
  const token = getToken(req, jwtSecret);
  const { group } = req.query;

  if (process.env.NODE_ENV === 'development' && config.has('testGroup')) {
    const session = generateTestSession(req);
    return res.json(session);
  }

  if (token) {
    jwt.verify(token, jwtSecret, (err, claims) => {
      if (err) {
        res.status(401).end();
      }

      // Limit a token's groups to the one selected by a user at login
      // and/or either the exporter or output checker group
      const validGroups = [group, ocGroup, exporterGroup];
      const tokenWithModifiedGroups = jwt.sign(
        {
          ...claims,
          groups: groupFilter(claims.groups, validGroups),
        },
        jwtSecret
      );

      const userFields = pick(req.user, [
        'displayName',
        'username',
        'id',
        'email',
        'groups',
      ]);

      return res.json({
        token: tokenWithModifiedGroups,
        refreshToken: req.user.refreshToken,
        expiresAt: new Date(claims.exp * 1000),
        user: {
          ...userFields,
          groups: groupFilter(userFields.groups, validGroups),
        },
      });
    });
  } else {
    res.status(401).end();
  }
});

router.post('/refresh', (req, res) => {
  const { group } = req.query;
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
  const validGroups = [group, ocGroup, exporterGroup];

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
      // Make sure to remove extra groups from the refresh token as well
      const token = jwt.sign(
        {
          ...claims,
          groups: groupFilter(claims.groups, validGroups),
        },
        jwtSecret
      );

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
