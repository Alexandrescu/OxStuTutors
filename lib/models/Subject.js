'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubjectSchema = new Schema({
  subject : {
    type: String,
    unique: true,
    required: true
  }
});

module.exports = mongoose.model('Subject', SubjectSchema);
