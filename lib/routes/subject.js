// Routing to /subject/$

'use strict';

var express;
express = require('express');
var router;
router = express.Router();
var subject = require('../controllers/subject.js');

router.get('/', subject.getAll);

module.exports = router;