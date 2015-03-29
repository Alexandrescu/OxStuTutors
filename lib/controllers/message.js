'use strict';

var mongoose = require('mongoose'),
  Message = mongoose.model('Message'),
  User = mongoose.model('User'),
  ObjectId = mongoose.Types.ObjectId,
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
        console.log('doing this');
        if(err) {
          return next(err);
        }
        return res.status(200).send({});
      })
    })
  });
};

exports.allMessages = function(req, res, next) {
  var reqObj =new ObjectId(req.user._id.toString());

  Message.find({ $or: [{to :reqObj}, {from: reqObj}]})
    .populate('to', 'username')
    .populate('from', 'username')
    .exec(function(err, messages) {
      if(err) {
        return next(err);
      }

      res.send(messages);
    })
};
