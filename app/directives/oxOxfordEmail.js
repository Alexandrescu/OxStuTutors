var ox = angular.module('oxstututors');

ox.directive('oxOxfordEmail', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      tutor: '=?'
    },
    link: function(scope, element, attrs, ngModel) {
      ngModel.$validators.oxford = function(modelValue, viewValue) {
        if(!scope.tutor) return true;
        return modelValue && modelValue.indexOf("ox.ac.uk") > 0;
      }
    }
  }
});
