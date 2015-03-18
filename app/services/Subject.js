'use strict';

angular.module('oxstututors')
  .factory('Subjects', function($resource) {
    return $resource('/subject/')
  });