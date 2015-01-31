// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('EditProfileCtrl', function($scope, $location, User, FileUploader){
    if(!$scope.currentUser) {
        $location.path('/login');
    };

    var uploader = $scope.uploader = new FileUploader({
        url: '/avatar/',
        queueLimit: 1
    });

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    }
});
