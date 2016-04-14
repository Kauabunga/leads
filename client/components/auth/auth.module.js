'use strict';

angular.module('bbqApp.auth', [
  'bbqApp.constants',
  'bbqApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
