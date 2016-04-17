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

  })
  .run(function(toastService, $log){

    if(window._isServiceWorkerContentUpdated){
      $log.debug('On init app is ready for update');
      toastService.updateToast();
    }
    else {
      $log.debug('Listening for possible app update');
      window._isServiceWorkerContentUpdated = toastService.updateToast;
    }

  });



