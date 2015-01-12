'use strict';

var express;
express = require('express');

var router;
router = express.Router();

/* GET users listing. */
router.get('/signup/', function(req, res) {
    res.render('signup/index', {});
});

module.exports = router;
