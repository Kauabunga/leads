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
  .run(function(toastService, $log, $timeout){



    return init();

    function init(){

      document.addEventListener('deviceready', deviceIsReady, false);
      document.addEventListener('resume', hideSplashScreen, false);
      $timeout(deviceIsReady, getFadeTimeout());


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
      angular.element(document.getElementById('main-ui-view')).toggleClass('fade-in', true);
    }

    function hideSplashScreen(){
      if(isCordovaSplashScreen()) {
        navigator.splashscreen.hide();
      }
    }

    function getFadeTimeout(){
      return isCordovaSplashScreen() ? 250 : 17;
    }

    function isCordovaSplashScreen() {
      return navigator && navigator.splashscreen && navigator.splashscreen.hide;
    }

  });



