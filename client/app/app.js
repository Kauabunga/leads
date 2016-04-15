'use strict';

angular.module('bbqApp', [
  'bbqApp.auth',
  'bbqApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'validation.match',

  'ngMaterial',
  'ngMessages',
  'ngAnimate',
  'ngStorage'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(false);
  });
