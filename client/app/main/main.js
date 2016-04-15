'use strict';

angular.module('bbqApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        template: '<bbq-feedback></bbq-feedback>',
        authenticate: true
      });
  });
