'use strict';

var mongoose = require('mongoose'),
  Subject = mongoose.model('Subject'),
  Category = mongoose.model('Category');

exports.getAll = function (req, res, next) {
  Subject.find({}, function (err, subjects) {
    if (err) {
      return next(new Error('Failed to load subjects'));
    }

    res.send(subjects);
  })
};

exports.getCategories = function(req, res, next) {
  Category.find({}, function(err, categories) {
    if(err) {
      return next(new Error('Failed to load categories'));
    }

    res.send(categories);
  })
};
