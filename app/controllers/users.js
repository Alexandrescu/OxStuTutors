// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('UsersCtrl', ['$scope', '$routeParams', 'User', '$mdToast', 'Profile',
  function($scope, $routeParams, User, $mdToast, Profile){
    // This is used to have a check on top of the page saying to complete your profile
    if($scope.currentUser && $scope.currentUser._id === $routeParams.userId) {
        $scope.thisIsMe = true;
    }

    $scope.profile = Profile.init($routeParams.userId, $scope);

    $scope.PrettyName = Profile.fieldName;

    var toast = $mdToast.simple()
      .content('Action Toast!')
      .action('OK')
      .highlightAction(false)
      .position(Profile.getToastPosition());


    $mdToast.show(toast).then(function() {
        alert('You clicked \'OK\'.');
    });

    $scope.isDegree = Profile.isDegree;
    $scope.isSubject = Profile.isSubject;
    $scope.prettySubject = Profile.subjectName;
}]);
