'use strict';

angular.module('oxstututors')
  .factory('Message', function ($resource) {
    return $resource('/message/', {},
      {
        'to': {
          method: 'GET',
          isArray: true,
          url: '/message/to/:userId'
        },
        'from': {
          method: 'GET',
          isArray: true,
          url: '/message/from/:userId'
        },
        'all': {
          method: 'GET',
          isArray: true,
          url: '/message/all/'
        }
      });
  });
