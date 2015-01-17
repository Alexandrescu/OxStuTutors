// This file contains the logic for these routes
var passport = require('passport');
var User = require('.././User');

'use strict';

var exports;

// TODO Create individual handlers
exports.init = function(req, res) {
    var workflow = req.app.workflow(req, res);
    console.log(req.body);

    workflow.on('validate', function() {
        console.log(req.body);

        var user;
        user = req.body.user;

        console.log(req.body);
        if (!user || !user.username || !user.password || !user.email || !user.role) {
            workflow.outcome.errors.push({
                error: 0,
                description: 'Request does not match the required format'
            });

            return workflow.emit('response');
        }
        workflow.emit('register');
    });

    workflow.on('register', function() {
        console.log(req.body.user.password);

        User.register(
            new User(req.body.user),
            req.body.user.password,
            function (err, user) {
                if (err) {
                    workflow.outcome.errors.push(err);
                    return workflow.emit('response');
                }

                return workflow.emit('response');
            }
        );
    });

    workflow.emit('validate');
};

module.export = exports;