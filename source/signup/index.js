// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('SignUpCtrl', ['$scope', '$http', function($scope, $http){
    $scope.user = {
        role: null
    };

    $scope.submit = function() {
        console.log("submit2");

        $http.post('/signup/', {user: $scope.user})
            .success(function(data, status, headers, config) {
                console.log(data);
               console.log('Congratulations!');
            })
            .error(function(data, status, headers, config){
                console.log('Error')
            });
    };
}]);
