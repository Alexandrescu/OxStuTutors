var ox = angular.module('oxstututors');

ox.controller('UsersCtrl', ['$scope', '$routeParams', 'User', '$mdToast', 'Profile', '$location',
  function ($scope, $routeParams, User, $mdToast, Profile, $location) {
    // This is used to have a check on top of the page saying to complete your profile
    if ($scope.currentUser && $scope.currentUser._id === $routeParams.userId) {
      $scope.thisIsMe = true;
    }

    $scope.profile = Profile.init($routeParams.userId, $scope);

    $scope.PrettyName = Profile.fieldName;

    $scope.profile.then(function() {
      if(!$scope.user.completed) {
        $mdToast.show({
          controller: 'EditProfileToast',
          templateUrl: '/pages/editProfileToast',
          hideDelay: 7000,
          position: Profile.getToastPosition()
        });
      }
    });

    $scope.isDegree = Profile.isDegree;
    $scope.isSubject = Profile.isSubject;
  }]
);

ox.controller('EditProfileToast', ['$scope', '$location', '$mdToast', function($scope, $location, $mdToast) {
  $scope.goEdit = function() {
    console.log('Doing redirect');
    $location.path('/editProfile');
    $mdToast.hide();
  };

  $scope.closeToast = function() {
    $mdToast.hide();
  };
}]);
