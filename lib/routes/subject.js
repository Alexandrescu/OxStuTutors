// Routing to /subject/$

'use strict';

var express;
express = require('express');
var router;
router = express.Router();
var subject = require('../controllers/subject.js');

router.get('/', subject.getAll);
router.get('/categories', subject.getCategories);

module.exports = router;
