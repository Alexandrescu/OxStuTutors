'use strict';

var express;
express = require('express');

var router;
router = express.Router();

var auth;
auth = require('../controllers/auth');

var message = require('../controllers/message');

router.get('/inbox', auth.ensureAuthenticated, message.inbox);
router.get('/all/', auth.ensureAuthenticated, message.allMessages);
router.post('/', auth.ensureAuthenticated, message.send);

module.exports = router;
