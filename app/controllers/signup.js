// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('SignUpCtrl', function($scope, Auth, $location){
    $scope.user = {
        role: null
    };

    $scope.submit = function(form) {
        Auth.createUser({
                username: $scope.user.username,
                password: $scope.user.password,
                email: $scope.user.email,
                role: $scope.user.role
            },
            function(err) {
                $scope.errors = {};

                if (!err)
                {
                    $location.path('/');
                }
                else
                {
                    angular.forEach(err.errors, function(error, field) {
                        form[field].$setValidity('mongoose', false);
                        $scope.errors[field] = error.message;
                    });
                }
            }
        );
    };
});
