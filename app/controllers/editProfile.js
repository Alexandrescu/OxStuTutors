// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('EditProfileCtrl', function($scope, $location, User){
    if(!$scope.currentUser) {
        $location.path('/login');
    }

});
