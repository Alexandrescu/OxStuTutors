// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('SignUpCtrl', function ($scope, Auth, $location) {
  $scope.user = {
    role: null
  };
});
