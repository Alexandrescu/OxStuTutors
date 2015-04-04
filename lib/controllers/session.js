'use strict';

var mongoose = require('mongoose'),
  passport = require('passport');

/**
 * Session
 * returns info on authenticated user
 */
exports.user = function (req, res) {
  res.send(req.user.user_info);
};

/**
 * Logout
 * returns nothing
 */
exports.logout = function (req, res) {
  if (req.user) {
    req.logout();
    res.status(200).end();
  } else {
    // Maybe another format is required
    req.logout();
    res.send("Not logged in");
  }
};

/**
 *  Login
 *  requires: {email, password}
 */
exports.login = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) {
      return res.status(400).send(error);
    }

    // This function is exposed by passport js
    req.logIn(user, function (err) {
      if (err) {
        return res.send(err);
      }
      res.send(req.user.user_info);
    });
  })(req, res, next);
};
