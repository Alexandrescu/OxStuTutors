var express;
express = require('express');

var router;
router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    console.log('Index');
    res.render('index', { title: 'Express' });
});

/* GET users listing. */
router.get('/signup/', function(req, res) {
    res.render('signup/index', {});
});

router.post('/signup/', require('../views/signup/index.js').init);

router.get('/login/', function(req, res) {
   res.render('login/index', { user: req.user });
});

module.exports = router;
