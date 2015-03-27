var ox = angular.module('oxstututors');

ox.controller('LoginCtrl', function ($scope, Auth, $location) {
  $scope.error = {};
  $scope.user = {};

  $scope.login = function (form) {
    Auth.login('password', {
        'username': $scope.user.username,
        'password': $scope.user.password
      },
      function (err) {
        $scope.errors = {};

        if (!err) {
          $location.path('/');
        }
        else {
          angular.forEach(err.errors, function (error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.type;
          });
          $scope.error.other = err.message;
        }
      });
  };
});