'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  ObjectId = mongoose.Types.ObjectId,
  path = require('path');


var scale = {
  width: 400,
  height: 400
};

exports.update = function (req, res, next) {
  var workflow = req.app.workflow(req, res);
  var userId = req.user._id;
  var lwip = req.app.lwip;

  workflow.on('parseRequest', function () {
    req.accepts('image/*');
    workflow.emit('saveImage');
  });

  workflow.on('saveImage', function () {
    lwip.open(req.files.file.path, function (err, image) {
      var width = image.width();
      var height = image.height();

      var widthRatio = width / scale.width;
      var heightRatio = height / scale.height;
      var bestRatio = Math.min(widthRatio, heightRatio);

      var newWidth = width / bestRatio;
      var newHeight = height / bestRatio;

      image.batch()
        .resize(newWidth, newHeight)
        .crop(0, 0, scale.width, scale.height)
        .toBuffer('jpg', function (err, outputBuffer) {

          if (err) {
            workflow.emit('exception', err);
          }

          var query = {_id: ObjectId(userId)};
          var newFields = {
            profilePic: {
              data: outputBuffer,
              contentType: req.files.file.type
            },
            hasProfilePic: true
          };
          User.update(query, newFields, {}, function (err, numAff) {
            if (err) {
              workflow.emit('exception', err);
            }
            res.status(200).end();
          });
        })

    });
  });

  workflow.emit('parseRequest');
};

exports.showImage = function (req, res, next) {
  if(!req.params.userId) {
    res.status(404).send({});
  }
  var userId = req.params.userId;

  User.findById(ObjectId(userId), function (err, user) {
    if (err) {
      throw err;
    }

    if(!user.hasProfilePic) {
      var options = {
        root: path.join(req.app.public, 'media'),
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      };
      var fileName = 'defaultAvatar.jpg';

      res.sendFile(fileName, options, function (err) {
        if (err) {
          console.log(err);
          res.status(err.status).end();
        }
      });
    }
    else {
      res.type('jpg');
      return res.send(user.profilePic.data).end();
    }
  });
};
