'use strict';

angular.module('oxstututors')
    .factory('Session', function ($resource) {
        return $resource('/auth/session/');
    });
