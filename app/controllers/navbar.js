var ox = angular.module('oxstututors');

ox.controller('NavbarCtrl',[ '$scope', 'Auth', '$location', 'Inbox', function ($scope, Auth, $location, Inbox) {
    Auth.currentUser(Inbox.updateUnread);
    $scope.logout = function () {
      Auth.logout(function (err) {
        if (!err) {
          $location.path('/');
        }
      });
    };
  }]
);