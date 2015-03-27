var ox = angular.module('oxstututors');

ox.controller('SearchCtrl', ['$scope', 'User', function($scope, User) {
  $scope.search = User.search();
}]);