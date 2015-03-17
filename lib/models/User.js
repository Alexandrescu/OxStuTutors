'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var ValidationError = require('../../node_modules/mongoose/lib/error/validation');
var ValidatorError = require('../../node_modules/mongoose/lib/error/validator');

var UserSchema = new Schema({
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
    subjects : [String],
    qualifications: [String],
    approach: {type : String, default: ""},
    personalVideo: {type : String, default : ""},
    funFact: {type : String, default : ""},
    provider: String,
    profilePic: { data: Buffer, contentType: String }
});

/**
 * Virtuals - creates a variable which is not persistan in the db.
 */

UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

UserSchema
    .virtual('user_info')
    .get(function () {
        return {
            '_id': this._id,
            'username': this.username,
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
        function(value, respond) {
            mongoose.models["User"].findOne({email: value}, function(err, user) {
                if(err) throw err;

                if(user) return respond(false);

                respond(true);
            });
        },
        'The specified email address is already in use.');

UserSchema
    .path('username')
    .validate(
        function(value, respond) {
            mongoose.models["User"].findOne({username: value}, function(err, user) {
                if(err) throw err;

                if(user) return respond(false);

                respond(true);
            });
        },
        'The specified username is already in use.');

UserSchema
    .path('role')
    .validate(
        function(value, respond) {
            if(value !== 'Client' && value !== 'Tutor') {
                respond(false);
            }
            respond(true);
        },
        'The role must be specified.');

/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
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

    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    /**
     * Make salt
     */

    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     */

    encryptPassword: function(password) {
        if (!password || !this.salt) {
            return '';
        }
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

module.exports = mongoose.model('User', UserSchema);
