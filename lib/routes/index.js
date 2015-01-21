/**
 * Server side:
 * Will route the layout which is situate at '/'
 *
 *          and
 *
 * Client Side:
 * Angular is loading different templates for each path
 */

'use strict';

var express;
express = require('express');

var router;
router = express.Router();

var passport;
passport = require('passport');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('layouts/layout', { title: 'OxStuTutors' });
});

/* Partials */
router.get('/index', function(req, res) {
    res.render('index');
});
router.get('/navbar', function(req, res)  {
    res.render('layouts/navbar');
});
router.get('/users', function(req, res) {
    res.render('users/index');
});
module.exports = router;
