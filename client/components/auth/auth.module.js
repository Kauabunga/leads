'use strict';

angular.module('bbqApp.auth', [
  'bbqApp.constants',
  'bbqApp.util',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
