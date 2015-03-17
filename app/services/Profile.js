'use strict';

angular.module('oxstututors')
  .factory('Profile', ['User', function(User) {
    var nameMap = {
      'subjects' : 'Subjects',
      'approach' : 'My approach to teaching',
      'qualifications' : 'Qualifications',
      'funFact' : 'Fun fact',
      'personalVideo' : 'Personal video'
    };

    var Profile = {};

    // This is giving the position of the toast on the edit and
    // profile page.

    var toastPosition = {
      bottom : true,
      right : true,
      left: false,
      top: false
    };

    Profile.getToastPosition = function() {
      return Object.keys(toastPosition)
        .filter(function(pos) { return toastPosition[pos]; })
        .join(' ');
    };

    Profile.init = function(userId, scope) {
      scope.img = "/avatar/" + userId;
      User.get({userId: userId}, function(profile) {
        scope.profile = profile.profile;
        scope.username = profile.username;
      })
    };

    Profile.subjectName = function(name) {
      if(name in nameMap) {
        return nameMap[name];
      }
      return name;
    };

    return Profile;
  }]);
