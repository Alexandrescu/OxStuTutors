var ox = angular.module('oxstututors');

ox.directive('oxSearchProfile', function() {
  return {
    restrict: 'E',
    templateUrl: '/pages/oxSearchProfile',
    scope: {
      users: '=',
      selectedSubject: '=',
      selectedCategories: '='
    },
    controller : function($scope, Profile) {
      $scope.prettySubject = Profile.subjectName;
    }
  }
});

ox.filter('filterSubject', ['Profile', function(Profile) {
  return function(input, subject, categories) {
    if(!subject) {
      return input;
    }

    var output = [];

    for(var i = 0; i < input.length; i++) {
      var sbjs = input[i].profile.subjects;
      for(var j = 0; j < sbjs.length; j++) {
        if(Profile.subjectName(sbjs[j].subject) === subject) {
          output.push(input[i]);
        }
      }
    }

    return output;
  }
}]);

ox.filter('filterCategories', function() {
  return function(input, categories) {
    if(!categories) {
      return input;
    }

    var output = [];

    for(var i = 0; i < input.length; i++) {
      var sbjs = input[i].profile.subjects;

      var toAdd = true;

      for(var j = 0; j < sbjs.length; j++){
        for(var key in categories) {
          if(categories[key] && !sbjs[j].categories[key]) {
            toAdd = false;
          }
        }
      }

      if(toAdd) {
        output.push(input[i]);
      }
    }

    return output;
  }
});