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
  console.log(req.body);
  User.findById(req.body.from._id, function(err, userFrom) {
    if(err) {
      return res.status(404).send(err);
    }

    User.findById(req.body.to._id, function(err, userTo) {
      if(err){
        return res.status(404).send(err);
      }

      if(!userTo) {
        return res.status(404).send('No user selected');
      }

      var newMessage = new Message({
        from: userFrom,
        to: userTo,
        content: req.body.message
      });

      newMessage.save(function(err) {
        console.log('doing this');
        if(err) {
          return res.status(404).send(err);
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

exports.unread = function(req, res, next) {
  var toObject = new ObjectId(req.user._id.toString());

  Message.count(
    {$and : [{to: toObject}, {read: false}]},
    function(err, counter) {
      if(err) {
        return next(err);
      }
      return res.status(200).send({unread:counter});
    });
};

exports.read = function(req, res, next) {
  console.log(req.body);
  var fromObject = new ObjectId(req.body.fromId);
  var toObject = new ObjectId(req.body.toId);
  console.log('updating read messages');
  Message.update(
    {$and: [{from: fromObject}, {to: toObject}, {read: false}]},
    {$set: {read: true}},
    {multi: true},
    function(err, affected) {
      if(err) {
        next(err);
      }

      res.status(200).send({read: affected});
    }
  );
};
