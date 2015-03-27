'use strict';

var express;
express = require('express');

var router;
router = express.Router();

router.get('/search', function(req, res) {
  res.render('search/index');
});

module.exports = router;