'use strict';

angular.module('oxstututors', [
    'ui.bootstrap',
    'ngRoute',
    'ngResource',
    'ngCookies'
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
    });
