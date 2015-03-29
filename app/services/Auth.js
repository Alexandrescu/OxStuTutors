'use strict';

angular.module('oxstututors')
  .factory('Auth', ['$location', '$rootScope', 'Session', 'User', 'Inbox',
    function Auth($location, $rootScope, Session, User, Inbox) {
    return {

      login: function (provider, user, callback) {
        var cb = callback || angular.noop;

        Session.save({
          provider: provider,
          username: user.username,
          password: user.password,
          rememberMe: user.rememberMe
        }, function (user) {
          $rootScope.currentUser = user;
          Inbox.updateUnread();
          return cb();
        }, function (err) {
          return cb(err.data);
        });
      },

      logout: function (callback) {
        var cb = callback || angular.noop;

        Session.delete(function (res) {
            delete $rootScope.unread;
            delete $rootScope.currentUser;
            return cb();
          },
          function (err) {
            delete $rootScope.unread;
            delete $rootScope.currentUser;
            return cb(err.data);
          });
      },

      createUser: function (userinfo, callback) {
        // angular.noop - function that doesn't do anything
        var cb = callback || angular.noop;

        User.save(userinfo,
          function (user) {
            $rootScope.currentUser = user;
            return cb();
          },
          function (err) {
            return cb(err.data);
          });
      },

      currentUser: function (callback) {
        var cb = callback || angular.noop;
        Session.get(function (user) {
          $rootScope.currentUser = user;
          cb();
        });
      },

      changePassword: function (email, oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;
        User.update({
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function (user) {
          console.log('password changed');
          return cb();
        }, function (err) {
          return cb(err.data);
        });
      },

      removeUser: function (email, password, callback) {
        var cb = callback || angular.noop;
        User.delete({
          email: email,
          password: password
        }, function (user) {
          console.log(user + 'removed');
          return cb();
        }, function (err) {
          return cb(err.data);
        });
      }
    };
  }]);
