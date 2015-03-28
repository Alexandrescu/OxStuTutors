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
  from : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  to : {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Message', MessageSchema);
