'use strict';

angular.module('bbqApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        template: '<bbq-feedback></bbq-feedback>',
        authenticate: true
        // authenticate: false
      });
    $stateProvider
      .state('info', {
        url: '/info',
        template: '<bbq-info></bbq-info>',
        authenticate: false
      });
    $stateProvider
      .state('welcome', {
        url: '/welcome',
        template: '<bbq-welcome></bbq-welcome>',
        authenticate: false
      });
  });
