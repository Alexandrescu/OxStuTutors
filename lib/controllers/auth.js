'use strict';

/**
 *  Route middleware to ensure user is authenticated.
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).end();
};

exports.ensureSession = function ensureSession(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    return res.status(404).end();
  }
};
