'use strict';

// Module dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Required by passport
var session = require('express-session');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');

// Required by livereload - not sure if still needed
// TODO Test if this is needed
var app = module.exports.app = exports.app = express();
app.use(require('connect-livereload')());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('OxStuTutors'));
app.use(express.static(path.join(__dirname, 'public')));

// From passport tutorial
var sessionOptions = {
    secret: 'OxStuTutors',
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

// Connect to the db
mongoose.connect('mongodb://localhost/oxstu');

app.workflow = require('./module/workflow');

// Routes in files
var routes = require('./routes/index');
var authRoutes = require('./routes/auth');

// Routes are matched by order of creation.
// JS is single threaded o/w I can't see this thing working.
app.use('/', routes);
app.use('/auth', authRoutes);

// ** Routing
//require('./routes/index')(app, passport);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Passport config
require('./passport.js')(app, passport);

// require('./lib/config/routes')(app);

module.exports = app;
