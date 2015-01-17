'use strict';

angular.module('oxstututors', [
    'ui.bootstrap',
    'ngRoute',
    'ngResource',
    'ngCookies',
    'http-auth-interceptor'
])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/index',
                controller: 'MainCtrl'
            })
            .when('/signup/', {
                templateUrl: '/auth/signup',
                controller: 'SignUpCtrl'
            })
            .otherwise({});

        $locationProvider.html5Mode(true);
    })
    .run(function ($rootScope, $location, Auth) {

        // Watching currentUser variable.
        $rootScope.$watch('currentUser', function(currentUser) {
            // It will trigger 401 if user does not have a valid session
            if (!currentUser && (['/', '/login', '/logout', '/signup'].indexOf($location.path()) == -1 )) {
                // If the current user is not set and we're not on the current pages it will get it
                Auth.currentUser();
            }
        });

        // On catching 401 errors, redirect to the login page.
        $rootScope.$on('event:auth-loginRequired', function() {
            $location.path('/login');
            return false;
        });
    });
