// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('EditProfileCtrl',
  ['$scope', '$location', 'User', 'FileUploader', 'Profile', 'Subject',
    function ($scope, $location, User, FileUploader, Profile, Subject) {

      $scope.profileInput = [];

      if (!$scope.currentUser) {
        $location.path('/login');
      }

      var uploader = $scope.uploader = new FileUploader({
        url: '/avatar/',
        queueLimit: 1
      });

      uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
      };

      var getProfilePromise = Profile.init($scope.currentUser._id, $scope);

      $scope.PrettyName = Profile.fieldName;

      $scope.isSubject = Profile.isSubject;

      $scope.updateSubject = function () {
        $scope.user.profile.subjects.push({subject: "", categories: {}});
      };

      var getCategoriesPromise = Subject.categories().$promise;
      var getSubjectPromise = Subject.get().$promise;

      var loadSubjectsPromise = getProfilePromise.then(function () {
        getCategoriesPromise.then(function(categories) {
          getSubjectPromise.then(function (subjects) {
            for (var i = 0; i < subjects.length; i++) {
              subjects[i].categories = {};
              // This is ensuring that all the subjects have the required values
              for(var j = 0; j < categories.length; j++) {
                subjects[i].categories[categories[j].category] = false;
              }

              for (var j = 0; j < $scope.user.profile.subjects.length; j++) {
                if ($scope.user.profile.subjects[j].subject == subjects[i].subject) {
                  subjects[i] = $scope.user.profile.subjects[j];
                }
              }
              delete subjects[i]._id;
            }

            $scope.tutoringSubject = subjects;
          })
        })
      });

      $scope.loadSubjects = function () {
        return loadSubjectsPromise;
      };

      $scope.updateUser = function (field) {
        if ($scope.isSubject(field)) {
          // Need to check for dummy subject
          var dummy = $scope.user.profile.subjects.pop();
          if (dummy.subject && dummy.subject != "") {
            $scope.user.profile.subjects.push(dummy);
          }
        }

        var promise = User.update({
          profile: {
            field: field,
            fieldValue: $scope.user.profile[field]
          }
        }).$promise;

        promise.then(function (response) {
          if (response.success) {
            $scope.profileInput[field] = false;
          }
        });
      };

      $scope.isDegree = Profile.isDegree;
      $scope.updateDegree = function () {
        $scope.user.profile.qualifications.push("");
      }
    }]);
