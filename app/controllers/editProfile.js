// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('EditProfileCtrl', function($scope, $location, User, FileUploader){
    if(!$scope.currentUser) {
        $location.path('/login');
    };

    $scope.saveChanges = function() {
        console.log('Saving');
        User.update();
    };

    $scope.uploader = new FileUploader({
        url: 'auth/users/profileImage',
        queueLimit: 1
    });
});
