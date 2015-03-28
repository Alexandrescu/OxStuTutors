'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  category : {
    type: String,
    unique: true,
    required: false
  }
}, {collection: 'categories'});

module.exports = mongoose.model('Category', CategorySchema);
