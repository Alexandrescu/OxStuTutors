'use strict';

var express;
express = require('express');

var router;
router = express.Router();

var passport;
passport = require('passport');

router.get('/signup', function(req, res) {
    res.render('signup/index', {});
});

router.get('/login/', function(req, res) {
    res.render('login/index', { user: req.user });
});

router.post('/login/', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

module.exports = router;
