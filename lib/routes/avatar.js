// /avatar/$

var express;
express = require('express');
var router;
router = express.Router();

var avatar = require('../controllers/avatar');
var auth = require('../controllers/auth');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.get("/:userId", avatar.showImage);
router.post("/",  auth.ensureSession, multipartMiddleware, avatar.update);

module.exports = router;