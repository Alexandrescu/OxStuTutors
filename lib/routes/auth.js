// Routing to /auth/$

'use strict';

var express;
express = require('express');
var router;
router = express.Router();

// ** Routes to layouts **
router.get('/signup', function(req, res) {
    res.render('signup/index', {});
});

router.get('/login', function(req, res) {
    console.log('Login');
    res.render('login/index', {});
});

// ** API Routes **
var users;
users = require('../controllers/users');

// This is linked with the service User - when calling save
router.post('/users', users.create);

// ** Session Routes **
var session;
session = require('../controllers/session');
var auth;
auth = require('../config/auth');
// Now bounding the routes
router.get('/session', auth.ensureSession, session.user);
router.post('/session', session.login);
router.delete('/session', session.logout);

module.exports = router;
