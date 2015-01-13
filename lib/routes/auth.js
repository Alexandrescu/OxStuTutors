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

// ** API Routes **
var users;
users = require('../controllers/users');
router.post('/signup', users.create);



module.exports = router;
