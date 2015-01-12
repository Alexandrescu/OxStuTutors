var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// This should be constructed as I want.
// Username, hash, salt and password are in the care of the plugin
// TODO: Get rid of dependency

var User = new Schema({});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
