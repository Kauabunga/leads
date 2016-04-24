'use strict';
(() => {

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
    .run(function(toastService, $log, $timeout, $rootScope, $state){

      let addBodyClass = _.once(() => angular.element(document.body).toggleClass('fade-in', true));
      let hideSplashScreen = _.once(() => {
        isCordovaSplashScreen() ? navigator.splashscreen.hide() : undefined
      });


      return init();

      function init(){

        document.addEventListener('deviceready', deviceIsReady, false);
        $timeout(deviceIsReady, getFadeTimeout());

        $rootScope.$on('$stateChangeSuccess', handleStateChangeSuccess);
        handleStateChangeSuccess();

        if(window._isServiceWorkerContentUpdated){
          $log.debug('On init app is ready for update');
          toastService.updateToast();
        }
        else {
          $log.debug('Listening for possible app update');
          window._isServiceWorkerContentUpdated = toastService.updateToast;
        }
      }

      function deviceIsReady(){
        hideSplashScreen();
        $timeout(addBodyClass);
      }

      function handleStateChangeSuccess(){
        $timeout(() => {
          $rootScope.currentRoute = $state.current.name;
        });
      }

      function getFadeTimeout(){
        return isCordovaSplashScreen() ? 300 : 34;
      }

      function isCordovaSplashScreen() {
        return navigator && navigator.splashscreen && typeof navigator.splashscreen.hide === 'function';
      }

    });

})();

