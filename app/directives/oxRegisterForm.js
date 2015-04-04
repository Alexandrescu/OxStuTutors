var ox = angular.module('oxstututors');

ox.directive('oxRegisterForm', function() {
  return {
    restrict: 'E',
    templateUrl: '/pages/oxRegisterForm',
    scope: {
      user:'=',
      tutor:'=?'
    },
    controller : ['$scope', 'Auth', '$location', function($scope, Auth, $location) {
      $scope.submit = function (form) {
        Auth.createUser({
            username: $scope.user.username,
            firstName: $scope.user.firstName,
            lastName: $scope.user.lastName,
            password: $scope.user.password,
            email: $scope.user.email,
            role: $scope.user.role
          },
          function (err) {
            $scope.errors = {};

            if (!err) {
              $location.path('/');
            }
            else {
              angular.forEach(err.errors, function (error, field) {
                form[field].$setValidity('mongoose', false);
              });
            }
          }
        );
      };
    }]
  }
});
