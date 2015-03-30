'use strict';

angular.module('oxstututors')
  .factory('Message', function ($resource) {
    return $resource('/message/', {},
      {
        'all': {
          method: 'GET',
          isArray: true,
          url: '/message/all/'
        },
        'read' : {
          method: 'PUT',
          url: '/message/read/'
        },
        'unread' : {
          method: 'GET',
          url: '/message/unread/'
        }
      });
  });
