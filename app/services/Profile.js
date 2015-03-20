'use strict';

angular.module('oxstututors')
  .factory('Profile', ['User', function(User) {
    var nameMap = {
      'subjects' : 'Tutoring Subjects',
      'approach' : 'My approach to teaching',
      'qualifications' : 'Degree',
      'funFact' : 'Fun fact!',
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
      return User.get({userId: userId}, function(profile) {
        scope.profile = profile.profile;
        scope.username = profile.username;
      }).$promise;
    };

    Profile.fieldName = function(name) {
      if(name in nameMap) {
        return nameMap[name];
      }
      return name;
    };

    var subjectMap = {
      'compsci' : 'Computer Science',
      'maths' : 'Mathematics',
      'oxbridge' : 'OxBridge interview'
    };

    Profile.subjectName = function(abrv) {
      if(abrv in subjectMap) {
        return subjectMap[abrv];
      }
      return abrv;
    };

    return Profile;
  }]);
