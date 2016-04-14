'use strict';

angular.module('bbqApp', [
  'bbqApp.auth',
  'bbqApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'validation.match'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
