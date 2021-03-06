'use strict';

// Module dependencies
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

// Required by passport
var session = require('express-session');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var Grid = require('gridfs-stream');

var app = express();
var env = process.env.NODE_ENV || 'development';
// This will be generated
var config;
if ('production' === env) {
    config = require('./lib/config/config_production');
}
else {
    // should be development - not necessary tho

    app.use(require('connect-livereload')());
    config = require('./lib/config/config_development');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.public = path.join(__dirname, 'public');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('OxStuTutors'));
app.use(express.static(path.join(__dirname, 'public')));

// *** Configuring Passport js

// From passport tutorial
var sessionOptions = {
    secret: 'OxStuTutors',
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require('./passport.js')(app, passport);

// *** Connecting to Mongo
mongoose.connect(config.mongodb.uri);

Grid.mongo = mongoose.mongo;

var conn = mongoose.connection;
conn.once('open', function() {
    app.gfs = Grid(conn.db);
});

app.mongoCollection = 'oxstu';
app.workflow = require('./module/workflow');
app.fs = fs;
app.lwip = require('lwip');

// Bootstrap models
// This is needed to be able to initialize the controllers
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    require(modelsPath + '/' + file);
});

// *** Routes
var routes = require('./lib/routes/index');
var authRoutes = require('./lib/routes/auth');
var avatarRoutes = require('./lib/routes/avatar');
var messageRoutes = require('./lib/routes/message');
var pagesRoutes = require('./lib/routes/pages');
var subjectRoutes = require('./lib/routes/subject');


// Routes are matched by order of creation.
// JS is single threaded o/w I can't see this thing working.
app.use('/', routes);
app.use('/auth', authRoutes);
app.use('/avatar', avatarRoutes);
app.use('/pages', pagesRoutes);
app.use('/message', messageRoutes);
app.use('/subject', subjectRoutes);

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

app.set('port', config.port);

app.listen(app.get('port'), function() {
    //debug('Express server listening on port ' + server.address().port);
});
