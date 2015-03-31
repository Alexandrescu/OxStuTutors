'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  ObjectId = mongoose.Types.ObjectId,
  _ = require('underscore');

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
      res.send({
        username: user.username,
        profile: user.profile,
        summary: user.profileSummary,
        completed: user.completed
      });
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
    if (!req.files) {
      workflow.emit('saveProfile');
      console.log('doing the save profile');
      return;
    }

    console.log("saving image");

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
          },
          hasProfilePic : true
        };
        User.update(query, newFields, {}, function (err, numAff) {
          if (err) {
            workflow.emit('exception', err);
          }
          else {
            workflow.emit('response');
          }
        })
      });
  });

  workflow.on('saveProfile', function () {
    console.log(req.body.profile);

    if (!req.body.profile) {
      workflow.emit('exception', 'Nothing to update');
    }

    var updateObject = {};
    updateObject[req.body.profile.field] = req.body.profile.fieldValue;

    User.findByIdAndUpdate(userId, updateObject, function (err, user) {
      if (err) {
        workflow.emit('exception', err);
      }
      else {
        workflow.emit('response');
      }
    });
  });

  workflow.emit('parseRequest');
};

exports.allSearchable = function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      return next(new Error('Failed to search'));
    }

    var result = _.filter(users, function(user) {
      return user.completed;
    });

    result = _.map(result, function(user) {
      return {
        _id: user._id,
        username: user.username,
        profile: user.profile,
        summary: user.profileSummary
      }
    });

    res.send(result);
  })
};

exports.allUsers = function(req, res, next){
  User.find({})
    .select('username')
    .exec(function(err, users) {
      if(err) {
        return next(new Error('Failed to load all users'));
      }

      res.send(users);
    }
  )
};
