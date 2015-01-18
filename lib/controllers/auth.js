'use strict';

/**
 *  Route middleware to ensure user is authenticated.
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send(401);
};

exports.ensureSession = function ensureSession(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
};