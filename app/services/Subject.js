'use strict';

angular.module('oxstututors')
  .factory('Subject', function ($resource) {
    return $resource('/subject/', {}, {
      'get': {
        method: 'GET',
        isArray: true
      }
    });
  });