'use strict';

var mongoose = require('mongoose'),
  Message = mongoose.model('Message'),
  User = mongoose.model('User'),
  _ = require('underscore');

exports.inbox = function(req, res, next) {
  res.render('message/inbox');
};

exports.send = function(req, res, next) {
  User.findById(req.body.from._id, function(err, userFrom) {
    if(err) {
      return next(err);
    }

    User.findById(req.body.to.userId, function(err, userTo) {
      if(err){
        return next(err);
      }

      if(!userTo) {
        res.status(404);
      }

      var newMessage = new Message({
        from: userFrom,
        to: userTo,
        content: req.body.message
      });

      newMessage.save(function(err) {
        if(err) {
          return next(err);
        }
        return res.status(200);
      })
    })
  });
};
