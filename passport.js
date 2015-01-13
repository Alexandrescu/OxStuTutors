'use strict';

module.exports = function(app, passport) {
    var LocalStrategy = require('passport-local').Strategy;
    var User = require('./lib/models/User.js');


    // Function to initiate the authentication.
    function passAuthenticate(username, password, done) {
        // Allowing connections vis username or email.
        // Setting up conditions for both kinds of auth.
        var conditions;
        if(username.indexOf('@') === -1) {
            conditions.username = username;
        }
        else {
            conditions.email = username;
        }

        // Searching in the database
        app.db.models.User.findOne(conditions, function(err, user) {
            if(err) {
                return done(err);
            }

            if(!user) {
                // User not found.
                return done(null, false, { message: 'Unknown user' });
            }

            app.db.models.User.validatePassword(password, user.password, function(err, isValid){
                if(err) {
                    return done(err);
                }

                if(!isValid) {
                    // Since creating users means no duplicate username,
                    // someone can duplicate the user base.
                    return done(null, false, { message: 'Invalid password'});
                }

                return done(null, user);
            });
        });
    }

    /*
    passport.use(new LocalStrategy(
        function(username, password, done) {
            passAuthenticate(username, password, done);
        }));
        */
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

};
