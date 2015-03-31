'use strict';

angular.module('oxstututors')
  .factory('Profile', ['User', function (User) {
    var nameMap = {
      'subjects': 'Tutoring Subjects',
      'approach': 'My approach to teaching',
      'qualifications': 'Degree',
      'funFact': 'Fun fact!',
      'personalVideo': 'Personal video'
    };

    var Profile = {};

    // This is giving the position of the toast on the edit and
    // profile page.

    var toastPosition = {
      bottom: false,
      right: true,
      left: false,
      top: true
    };

    Profile.getToastPosition = function () {
      return Object.keys(toastPosition)
        .filter(function (pos) {
          return toastPosition[pos];
        })
        .join(' ');
    };

    function isCompleted(profile, hasImage) {
      if(profile.subjects &&
         profile.approach &&
         profile.qualifications &&
         profile.funFact &&
         hasImage)
        return true;
      return false;
    }

    Profile.init = function (userId, scope) {
      scope.img = "/avatar/" + userId;
      return User.get({userId: userId}, function (profile) {
        scope.user = {
          _id : userId,
          profile: profile.profile,
          username: profile.username,
          summary: profile.summary,
          completed: isCompleted(profile.profile, true)
        }
      }).$promise;
    };

    Profile.summary = function (userId, result) {
      User.get({userId: userId}, function (user) {
        result[userId] = user.summary;
      });
    };

    Profile.fieldName = function (name) {
      if (name in nameMap) {
        return nameMap[name];
      }
      return name;
    };

    Profile.isDegree = function (key) {
      return key == 'qualifications';
    };

    Profile.isSubject = function (key) {
      return key == 'subjects';
    };

    return Profile;
  }]);
