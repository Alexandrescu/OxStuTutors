'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    ObjectId = mongoose.Types.ObjectId;

/**
 * Create user
 * requires: {username, password, email}
 * returns: {email, password}
 */
exports.create = function (req, res, next) {
    console.log('Creating new user');
    var newUser = new User(req.body);
    newUser.provider = 'local';

    newUser.save(function(err) {
        if (err) {
            return res.status(400).send(err);
        }

        // This function is exposed by passport js
        req.login(newUser, function(err) {
            if (err) {
                return next(err);
            }
            return res.send(newUser.user_info);
        });
    });
};

/**
 *  Show profile
 *  returns {username, profile}
 */
exports.show = function (req, res, next) {
    var userId = req.params.userId;

    User.findById(ObjectId(userId), function (err, user) {
        if (err) {
            return next(new Error('Failed to load User'));
        }
        if (user) {
            res.send({username: user.username, profile: user.profile });
        } else {
            res.send(404, 'USER_NOT_FOUND')
        }
    });
};

/**
 *  Username exists
 *  returns {exists}
 */
exports.exists = function (req, res, next) {
    var username = req.params.username;
    User.findOne({ username : username }, function (err, user) {
        if (err) {
            return next(new Error('Failed to load User ' + username));
        }

        if(user) {
            res.json({exists: true});
        } else {
            res.json({exists: false});
        }
    });
};

/**
 *  Update user profile
 */

exports.update = function (req, res, next) {
    var workflow = req.app.workflow(req, res);
    var gfs = req.app.gfs;
    var options = {
        _id: req.user._id,
        root: req.app.mongoCollection
    };
    var fs = req.app.fs;

    workflow.on('parseRequest', function () {

        console.log(req.body, req.files);

        console.log(req.user._id);

        // req.accepts('image/*');
        workflow.emit('removeExistingPhoto');
    });

    workflow.on('removeExistingPhoto', function () {
        gfs.exist({_id: options._id }, function(err, found) {
            if(err) {
                console.log(err.stack);
                res.status(404).send("Operation failed.");
            }
            if(found) {
                // need to delete the file and upload the new one
                gfs.remove(options, function(err) {
                    if(err) {
                        console.log(err.stack);
                    }
                    console.log("Successfully deleted the file");
                    res.send(500).send("Operation failed.");
                });
                workflow.emit('saveImage');
            }
            else {
                workflow.emit('saveImage');
            }
        });
    });

    workflow.on('saveImage', function() {
        var writeStream = gfs.createWriteStream([options]);
        fs.createReadStream(req.files.file.path).pipe(writeStream);
        writeStream.on('close', function(file) {
            res.send(200);
        });
    });

    workflow.emit('parseRequest');
};