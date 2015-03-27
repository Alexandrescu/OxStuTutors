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

module.exports = router;
