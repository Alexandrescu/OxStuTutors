// The purpose of this session is to maintain the user session active
// It will return 401 if the user is not authenticated.
// This behaviour is required for angular-http-auth
'use strict';

angular.module('oxstututors')
    .factory('Avatar', function ($resource) {
        return $resource('/avatar/:userId/', {},
            {
                get :
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'image/jpg'
                    }
                }
            }
        );
    });
