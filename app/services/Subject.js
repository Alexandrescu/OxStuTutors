'use strict';

angular.module('oxstututors')
  .factory('Subject', function ($resource) {
    return $resource('/subject/', {}, {
      'get': {
        method: 'GET',
        isArray: true
      },
      'categories' : {
        method: 'GET',
        isArray: true,
        url: '/subject/categories'
      }
    });
  });
