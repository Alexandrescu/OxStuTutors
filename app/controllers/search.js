var ox = angular.module('oxstututors');

ox.controller('SearchCtrl', ['$scope', 'User', 'Subject', 'Profile',
  function($scope, User, Subject, Profile) {
    $scope.categories = [
      'Personal Statement',
      'Oxbridge Admissions Test',
      'Oxbridge Interview',
      'A-Levels',
      'IB',
      'SAT',
      'GCSE'];

    $scope.search = [];
    User.search(function(results) {
      $scope.search = results;
    });
    $scope.selectedCategories = {};

    $scope.selectAllCategories = function (value) {
      for(var i in $scope.categories) {
        $scope.selectedCategories[$scope.categories[i]] = value;
      }
    };
    $scope.selectAllCategories(false);

    var prettySubject = Profile.subjectName;
    var subjects = [];

    Subject.get({}, function(sbjs){
      for(var i = 0; i < sbjs.length; i++) {
        subjects[i] = prettySubject(sbjs[i].subject);
      }
    });

    $scope.getSubjects = function(query) {
      var filter = createFilterFor(query);
      var results = [];

      for(var i = 0; i < subjects.length; i++) {
        if(filter(subjects[i])){
          results.push(subjects[i]);
        }
      }

      return results;
    };

    function createFilterFor(query) {
      return function(item) {
        var lowercaseQuery = angular.lowercase(query);
        var lowercaseSubject = angular.lowercase(item);
        return lowercaseSubject.indexOf(lowercaseQuery) === 0;
      }
    }
}]);
