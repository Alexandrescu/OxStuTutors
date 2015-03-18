'use strict';

var mongoose = require('mongoose'),
  Subject = mongoose.model('Subject');

exports.getAll = function(req, res, next) {
  Subject.find({}, function(err, subjects) {
    if(err) {
      return next(new Error('Failed to load subjects'));
    }

    res.send(subjects);
  })
};