// This is creating a resource with details for each request.
// Example: In this case, if I call User.save() it knows to call the link /auth/users/ (line 9)
// with the params I will pass in the controller.

'use strict';

angular.module('oxstututors')
  .factory('User', function ($resource) {
    return $resource('/auth/users/:userId/', {},
      {
        'update': {
          method: 'PUT'
        }
      });
  });
