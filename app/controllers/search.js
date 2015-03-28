var ox = angular.module('oxstututors');

ox.controller('SearchCtrl', ['$scope', 'User', 'Subject',
  function($scope, User, Subject) {
    $scope.categories = [];
    Subject.categories({}, function(categories) {
      $scope.categories = categories;
      $scope.selectAllCategories(false);
    });

    $scope.userBase = [];
    User.search(function(results) {
      $scope.userBase = results;
    });

    $scope.selectedCategories = {};
    $scope.selectAllCategories = function (value) {
      for(var i in $scope.categories) {
        $scope.selectedCategories[$scope.categories[i].category] = value;
      }
    };

    var subjects = [];

    Subject.get({}, function(sbjs){
      for(var i = 0; i < sbjs.length; i++) {
        subjects[i] = sbjs[i].subject;
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

    $scope.$watch('searchedSubject', function() {
      if($scope.searchedSubject === "") {
        $scope.selectedSubject = $scope.searchedSubject;
      }
    })
}]);
