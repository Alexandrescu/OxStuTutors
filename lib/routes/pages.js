'use strict';

var express;
express = require('express');

var router;
router = express.Router();

router.get('/search', function(req, res) {
  res.render('search/index');
});
router.get('/oxSearchProfile', function(req, res) {
  res.render('search/oxSearchProfile');
});
router.get('/editProfileToast', function(req, res) {
  res.render('users/editProfileToast');
});
router.get('/oxRegisterForm', function(req, res) {
  res.render('signup/oxRegisterForm');
});

module.exports = router;
