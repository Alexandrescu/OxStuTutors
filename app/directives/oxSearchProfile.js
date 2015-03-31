var ox = angular.module('oxstututors');

ox.directive('oxSearchProfile', function() {
  return {
    restrict: 'E',
    templateUrl: '/pages/oxSearchProfile',
    scope: {
      users: '=',
      selectedSubject: '=?',
      selectedCategories: '=?',
      isProfile: '=?'
    }
  }
});

ox.filter('filterSubject',function() {
  return function(input, subject) {
    if(!subject) {
      return input;
    }

    var output = [];

    for(var i = 0; i < input.length; i++) {
      var sbjs = input[i].profile.subjects;
      for(var j = 0; j < sbjs.length; j++) {
        if(sbjs[j].subject === subject) {
          output.push(input[i]);
        }
      }
    }

    return output;
  }
});

ox.filter('filterCategoriesInSubject', function() {
  return function(input, subject, categories) {
    if(!categories) {
      return input;
    }

    var output = [];

    for(var i = 0; i < input.length; i++) {
      var sbjs = input[i].profile.subjects;
      var added = false;

      for(var j = 0; j < sbjs.length && !added; j++) {
        if(!subject || sbjs[j].subject === subject) {
          var toAdd = true;
          for(keyCategory in categories) {
            if(categories[keyCategory] && !sbjs[j].categories[keyCategory]){
              toAdd = false;
            }
          }

          if(toAdd) {
            output.push(input[i]);
            added = true;
          }
        }
      }
    }

    return output;
  }
});
