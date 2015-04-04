'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var ValidationError = require('../../node_modules/mongoose/lib/error/validation');
var ValidatorError = require('../../node_modules/mongoose/lib/error/validator');

var UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: String,
  salt: String,
  name: String,
  admin: Boolean,
  role: {
    type: String,
    required: true
  },
  // **TUTORS ** profile related fields
  subjects: [{
    subject: {
      type: String,
      required: true
    },
    categories: Object
  }],
  qualifications: [String],
  approach: {type: String, default: ""},
  personalVideo: {type: String, default: ""},
  funFact: {type: String, default: ""},
  provider: String,
  profilePic: {data: Buffer, contentType: String},
  hasProfilePic : {
    type: Boolean,
    required: true,
    default: false
  }
});

/**
 * Virtuals - creates a variable which is not persistan in the db.
 */

UserSchema
  .virtual('completed')
  .get(function() {
    return (this.subjects && this.qualifications
      && this.approach && this.funFact
      && this.subjects.length > 0
      && this.qualifications.length > 0
      && this.approach != "" && this.funFact != ""
      && this.profilePic && this.hasProfilePic) || false;
  });

UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema
  .virtual('user_info')
  .get(function () {
    return {
      '_id': this._id,
      'username': this.username,
      'firstName': this.firstName,
      'lastName': this.lastName,
      'email': this.email
    };
  });

UserSchema
  .virtual('profile')
  .get(function () {
    return {
      'subjects': this.subjects,
      'qualifications': this.qualifications,
      'approach': this.approach,
      'personalVideo': this.personalVideo,
      'funFact': this.funFact
    }
  });

UserSchema
  .virtual('profileSummary')
  .get(function () {
    if(!this.subjects) {
      return "No subject";
    }
    var subjectSummary = [];

    var subjectLength = this.subjects.length;
    for(var i = 0; i < subjectLength; i++) {
      var summary = "";

      for(var key in this.subjects[i].categories) {
        if(this.subjects[i].categories[key] == true) {
          if(summary.length == 0) {
            summary = key;
          }
          else {
            summary = summary + ", " + key;
          }
        }
      }

      if(summary.length > 0) {
        var newSummary = {};
        newSummary.subject = this.subjects[i].subject;
        newSummary.description = summary;
        subjectSummary.push(newSummary);
      }
    }

    return {
      summary: subjectSummary,
      degree: this.qualifications
    }
  });

/**
 * Validations
 * Are run in the pre('save') hook and will be ran async if they have 2 params.
 * i.e. the ones with response will be ran async
 */

var validatePresenceOf = function (value) {
  return value && value.length;
};

UserSchema
  .path('email')
  .validate(
  function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
  },
  'The specified email is invalid.');

UserSchema
  .path('email')
  .validate(
  function (value, respond) {
    mongoose.models["User"].findOne({email: value}, function (err, user) {
      if (err) throw err;

      if (user) return respond(false);

      respond(true);
    });
  },
  'The specified email address is already in use.');

UserSchema
  .path('username')
  .validate(
  function (value, respond) {
    mongoose.models["User"].findOne({username: value}, function (err, user) {
      if (err) throw err;

      if (user) return respond(false);

      respond(true);
    });
  },
  'The specified username is already in use.');

UserSchema
  .path('role')
  .validate(
  function (value, respond) {
    if (value !== 'Client' && value !== 'Tutor') {
      respond(false);
    }
    respond(true);
  },
  'The role must be specified.');

/**
 * Pre-save hook
 */

UserSchema.pre('save', function (next) {
  if (!this.isNew) {
    return next();
  }

  if (!validatePresenceOf(this.password)) {
    var error;
    error = new ValidationError('PasswordValidation');
    error.errors.password =
      new ValidatorError('password', 'Invalid password');
    next(error);
  }
  else {
    next();
  }
});

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   */

  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   */

  encryptPassword: function (password) {
    if (!password || !this.salt) {
      return '';
    }
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
