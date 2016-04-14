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
  'ngAnimate'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
