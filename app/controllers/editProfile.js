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
        uploader.queue.length = 0;
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
          if (dummy && dummy.subject && dummy.subject != "") {
            $scope.user.profile.subjects.push(dummy);
          }

          // Removing duplicates
          for(var i = 0; i < $scope.user.profile.subjects.length; i++) {
            for(var j = i + 1; j < $scope.user.profile.subjects.length; j++) {
              if($scope.user.profile.subjects[i].subject == $scope.user.profile.subjects[j].subject) {
                $scope.user.profile.subjects.splice(j, 1);
              }
            }
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
            $scope.user.summary = response.newSummary;
            $scope.user.completed = response.completed;
          }
        });
      };

      $scope.isDegree = Profile.isDegree;
      $scope.updateDegree = function () {
        $scope.user.profile.qualifications.push("");
      };

      $scope.selectFile = function(){
        angular.element('#selectFile').trigger('click');
      };
      $scope.cache = {};
      $scope.edit = function(key) {
        $scope.profileInput[key] = true;
        $scope.cache[key] = angular.copy($scope.user.profile[key]);
        if($scope.isSubject(key)) {
          $scope.cacheSubjects = angular.copy($scope.tutoringSubject);
        }
      };
      $scope.cancelEdit = function(key) {
        $scope.profileInput[key] = false;
        $scope.user.profile[key] = angular.copy($scope.cache[key]);
        delete $scope.cache[key];
        if($scope.isSubject(key)) {
          $scope.tutoringSubject = angular.copy($scope.cacheSubjects);
          delete $scope.cacheSubjects;
        }
      };

      $scope.removeSubject = function(index) {
        $scope.user.profile.subjects.splice(index, 1);
      };

      $scope.removeDegree = function(index) {
        $scope.user.profile.qualifications.splice(index, 1);
      };
    }
  ]);
