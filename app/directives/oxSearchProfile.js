var ox = angular.module('oxstututors');

ox.directive('oxSearchProfile', function() {
  return {
    restrict: 'E',
    templateUrl: '/pages/oxSearchProfile',
    scope: {
      users: '='
    },
    controller : function($scope, Profile) {
      $scope.prettySubject = Profile.subjectName;
    }
  }
});
