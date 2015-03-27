var ox = angular.module('oxstututors');

ox.controller('SearchCtrl', ['$scope', 'User', 'Subject', 'Profile',
  function($scope, User, Subject, Profile) {
    $scope.categories = [
      'Personal Statement',
      'Oxbridge Admissions Test',
      'Oxbridge Interview',
      'A-Levels',
      'IB',
      'SAT II',
      'GCSE'];

    $scope.search = [];
    $scope.search = User.search();
    $scope.selectedCategories = {};

    $scope.selectAllCategories = function (value) {
      for(var i in $scope.categories) {
        $scope.selectedCategories[$scope.categories[i]] = value;
      }
    };

    var prettySubject = Profile.subjectName;
    var subjects = [];

    Subject.get({}, function(sbjs){
      console.log(sbjs);
      for(var i = 0; i < sbjs.length; i++) {
        subjects[i] = prettySubject(sbjs[i].subject);
      }
      console.log(subjects);
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
