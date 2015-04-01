var ox = angular.module('oxstututors');

ox.controller('SearchCtrl', ['$scope', 'User', 'Subject',
  function($scope, User, Subject) {
    var initCategories = false;
    $scope.categories = [];
    Subject.categories({}, function(categories) {
      $scope.categories = categories;
      $scope.selectAllCategories(false);

      $scope.$watch('selectedCategories', function() {
        if(!initCategories) {
          initCategories = true;
          $scope.newSearch = true;
        }
        else {
          $scope.newSearch = false;
        }
      }, true);
    });

    $scope.userBase = [];
    User.search(function(results) {
      $scope.userBase = results;
    });

    $scope.selectedCategories = {};
    $scope.selectAllCategories = function (value) {
      for(var i = 0; i < $scope.categories.length; i++) {
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

    var init = false;
    $scope.$watch('searchedSubject', function() {
      if(!init) {
        $scope.newSearch = true;
        init = true;
      }
      else {
        $scope.newSearch = false;
      }
    });

}]);
