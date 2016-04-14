'use strict';

angular.module('bbqApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        template: '<main></main>',
        authenticate: true
      });
  });
