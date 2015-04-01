var ox = angular.module('oxstututors');

ox.directive('oxUniqueUsername', ['User', '$q', function(User, $q) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$asyncValidators.unique = function(modelValue, viewValue) {
        return User.isUser({username: modelValue}).$promise
          .then(function(res) {
            if(res.exists) {
              return $q.reject('Username already exists');
            }
            else {
              return true;
            }
          });
      };
    }
  }
}]);
