var ox = angular.module('oxstututors');

ox.controller('LoginCtrl', ['$scope', 'Auth', '$location', '$routeParams',
  function ($scope, Auth, $location, $routeParams) {
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
            var location = '/' + ($routeParams.location ? $routeParams.location : '');
            return $location.url(location);
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
  }]);
