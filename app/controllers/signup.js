// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('SignUpCtrl', function($scope, Auth){
    $scope.user = {
        role: null
    };

    $scope.submit = function(form) {
        Auth.createUser({
                email: $scope.user.email,
                username: $scope.user.username,
                password: $scope.user.password
            },
            function(err) {
                $scope.errors = {};

                if (!err) {
                    $location.path('/');
                } else {
                    angular.forEach(err.errors, function(error, field) {
                        form[field].$setValidity('mongoose', false);
                        $scope.errors[field] = error.type;
                    });
                }
            }
        );
    };
});
