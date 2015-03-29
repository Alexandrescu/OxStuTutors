'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  content : {
    type: String,
    unique: true,
    required: false
  },
  date : {
    type: Date,
    default: Date.now
  },
  from : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  read : {type: Boolean, default: false}
});

module.exports = mongoose.model('Message', MessageSchema);
