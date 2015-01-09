var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.log('Index');
  res.render('index', { title: 'Express' });
});

router.get('/users', function(req, res) {
  console.log('Users in index router\n');
});

module.exports = router;
