var ox = angular.module('oxstututors');

ox.controller('NavbarCtrl', function($scope, Auth, $location) {
        $scope.logout = function() {
            Auth.logout(function(err) {
                if(!err) {
                    $location.path('/');
                }
            });
        }
    }
);