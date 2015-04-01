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

// ** Session Routes **
var session;
session = require('../controllers/session');
var auth;
auth = require('../controllers/auth');
// Now bounding the routes
router.get('/session', auth.ensureSession, session.user);
router.post('/session', session.login);
router.delete('/session', session.logout);

// ** API Routes **
var users;
users = require('../controllers/users');

// This is linked with the service User - when calling save
router.get('/users/exists/:username', users.exists);
router.get('/users/all', users.allUsers);
router.get('/users/search', users.allSearchable);
router.get('/users/:userId', users.show);
router.post('/users', users.create);
router.put('/users', auth.ensureSession, users.update);

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
router.post('/users/profileImage', auth.ensureSession, multipartMiddleware, users.update);

module.exports = router;
