'use strict';

var express;
express = require('express');

var router;
router = express.Router();

var auth;
auth = require('../controllers/auth');

var message = require('../controllers/message');

router.get('/inbox', auth.ensureAuthenticated, message.inbox);

module.exports = router;
