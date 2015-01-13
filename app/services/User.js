'use strict';

angular.module('oxstututors')
    .factory('User', function ($resource) {
        return $resource('/auth/users/:id/', {},
            {
                'update': {
                    method:'PUT'
                }
            });
    });
