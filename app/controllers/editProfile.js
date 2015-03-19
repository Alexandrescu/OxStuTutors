// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('EditProfileCtrl',
  ['$scope', '$location', 'User', 'FileUploader', 'Profile', 'Subject',
  function($scope, $location, User, FileUploader, Profile, Subject){

  $scope.profileInput = [];

  if(!$scope.currentUser) {
      $location.path('/login');
  }

  var uploader = $scope.uploader = new FileUploader({
    url: '/avatar/',
    queueLimit: 1
  });

  uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
  };

  Profile.init($scope.currentUser._id, $scope);

  $scope.PrettyName = Profile.fieldName;
  $scope.prettySubject = Profile.subjectName;

  $scope.isSubject = function(key) {
    return key == 'subjects';
  };

  $scope.updateSubject = function () {
    $scope.profile.subjects.push({subject : "", categories : []});
  };

  $scope.tutoringSubject = Subject.get();

}]);
