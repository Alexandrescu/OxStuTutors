var ox = angular.module('oxstututors');

ox.controller('NavbarCtrl', function ($scope, Auth, $location) {
    Auth.currentUser();
    $scope.logout = function () {
      Auth.logout(function (err) {
        if (!err) {
          $location.path('/');
        }
      });
    }
  }
);