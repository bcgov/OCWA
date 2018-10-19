const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get(
  '/',
  passport.authenticate('openidconnect', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Return the session for the
router.get('/session', (req, res) => {
  console.log(test);
  if (req.isAuthenticated()) {
    res.json({
      token: req.user.accessToken,
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
