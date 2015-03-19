'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubjectSchema = new Schema({
  subject : {
    type: String,
    unique: true,
    required: true
  },
  categories : {
    type: Object,
    unique: true,
    required: false
  }
});

module.exports = mongoose.model('Subject', SubjectSchema);