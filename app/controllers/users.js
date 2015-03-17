// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('UsersCtrl', function($scope, $routeParams, User, $mdToast){
    // This is used to have a check on top of the page saying to complete your profile
    if($scope.currentUser && $scope.currentUser._id === $routeParams.userId) {
        $scope.thisIsMe = true;
    }

    $scope.img = "/avatar/" + $routeParams.userId;
    User.get({userId: $routeParams.userId}, function(profile) {
        $scope.profile = profile.profile;
        $scope.username = profile.username;
        // Now you have the 'profile'
    });

    // This should be included in a service
    var nameMap = {
        'subjects' : 'Subjects',
        'approach' : 'My approach to teaching'
    };

    $scope.PrettyName = function(name) {
        if(name in nameMap) {
            return nameMap[name];
        }
        return name;
    };

    var toastPosition = {
        bottom: true,
        right: true,
        top: false
    };

    var getToastPosition = function() {
        return Object.keys(toastPosition)
            .filter(function(pos) { return toastPosition[pos]; })
            .join(' ');
    };

    var toast = $mdToast.simple()
      .content('Action Toast!')
      .action('OK')
      .highlightAction(false)
      .position(getToastPosition());


    $mdToast.show(toast).then(function() {
        alert('You clicked \'OK\'.');
    });

});
