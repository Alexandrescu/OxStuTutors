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
            .when('/login/', {
                templateUrl: '/auth/login',
                controller: 'LoginCtrl'
            })
            .otherwise({
                // Should redirect to an error page
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
    })
    .run(function ($rootScope, $location) {
        // On catching 401 errors, redirect to the login page.
        $rootScope.$on('event:auth-loginRequired', function() {
            $location.path('/login');
            return false;
        });
    });
