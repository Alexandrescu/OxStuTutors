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

  newUser.save(function (err) {
    if (err) {
      return res.status(400).send(err);
    }

    // This function is exposed by passport js
    req.login(newUser, function (err) {
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
      res.send({username: user.username, profile: user.profile});
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
  User.findOne({username: username}, function (err, user) {
    if (err) {
      return next(new Error('Failed to load User ' + username));
    }

    if (user) {
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
  var userId = req.user._id;
  var sharp = req.app.sharp;

  workflow.on('parseRequest', function () {

    console.log(req.body, req.files);

    console.log(req.user._id);

    req.accepts('image/*');
    workflow.emit('saveImage');
  });

  workflow.on('saveImage', function () {
    sharp(req.files.file.path)
      .resize()
      .toBuffer(function (err, outputBuffer) {

        if (err) {
          workflow.emit('exception', err);
        }

        var query = {_id: ObjectId(userId)};
        var newFields = {
          profilePic: {
            data: outputBuffer,
            contentType: req.files.file.type
          }
        };
        User.update(query, newFields, {}, function (err, numAff) {
          if (err) {
            workflow.emit('exception', err);
          }
          res.send(200);
        })
      });
  });

  workflow.emit('parseRequest');
};