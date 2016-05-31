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
    'ngStorage',
    'angulartics',
    'angulartics.google.analytics'
  ])
    .config(function($urlRouterProvider, $compileProvider, $locationProvider, $logProvider, dist) {
      $urlRouterProvider.otherwise('/');

      $locationProvider.html5Mode(false);

      if(dist){
        $compileProvider.debugInfoEnabled(false);
        $logProvider.debugEnabled(false);
      }

    })
    .run(function(toastService, $log, $timeout, $rootScope, $state, $localStorage){

      const ACTIVATE_TOAST_THROTTLE_TIME = 1000 * 60 * 10; //10mins
      let addBodyClass = _.once(() => angular.element(document.body).toggleClass('fade-in', true));
      let hideSplashScreen = _.throttle(() => isCordovaSplashScreen() ? navigator.splashscreen.hide() : undefined, 416, true);
      let activateUpdateToast = _.once(_activateUpdateToast);

      return init();

      function init(){

        document.addEventListener('deviceready', deviceIsReady, false);
        $timeout(deviceIsReady, getFadeTimeout());

        $rootScope.$on('$stateChangeSuccess', handleStateChangeSuccess);
        handleStateChangeSuccess();

        if(window._isServiceWorkerContentUpdated){
          $log.debug('On init app is ready for update');
          activateUpdateToast();
        }
        else {
          $log.debug('Listening for possible app update');
          window._isServiceWorkerContentUpdated = activateUpdateToast;
        }
      }

      function _activateUpdateToast(){

        $log.debug('Activating update toast');

        //Throttle this update toast to only appear once every 10mins
        //This is incase both appcache and serviceworker functions conflict with each other
        if(Date.now() - ( $localStorage.lastUpdateToast || 0 ) > ACTIVATE_TOAST_THROTTLE_TIME ){
          toastService.updateToast();
          $localStorage.lastUpdateToast = Date.now();
        }
        else {
          $log.debug('Toast recently shown in the last 10mins - Ignoring');
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

