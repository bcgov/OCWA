const config = require('config');
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : 'Login failed',
          user: user,
        });
      }

      req.login(user, { session: false }, async err => {
        if (err) {
          return next(err);
        }
        const token = jwt.sign(user, config.get('jwtSecret'), {
          expiresIn: '1y',
        });

        return res.json({ user, token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post(
  '/register',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    try {
      res.json({
        messsage: 'Registration Success',
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
